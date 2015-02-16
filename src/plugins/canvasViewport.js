import * as Core from "../core";

export class CanvasSprite extends Core.Component {
  static defaults() {
    return {
      name: null,
      color: '#fff',
      size: 100,
      width: null,
      height: null
    };
  }
  static create(attrs) {
    var c = super.create(attrs);
    if (!c.width) { c.width = c.size; }
    if (!c.height) { c.height = c.size; }
    return c;
  }
}
Core.registerComponent('Sprite', CanvasSprite);

// See also: http://phrogz.net/JS/wheeldelta.html
var wheelDistance = function(evt){
  if (!evt) evt = event;
  var w=evt.wheelDelta, d=evt.detail;
  if (d){
    if (w) return w/d/40*d>0?1:-1; // Opera
    else return -d/3;              // Firefox;         TODO: do not /3 for OS X
  } else return w/120;             // IE/Safari/Chrome TODO: /3 for Chrome OS X
};

export class CanvasViewport extends Core.System {

  defaultOptions() {
    return {
      debug: false,
      lineWidth: 1.5,
      zoom: 1.0,
      zoomMin: 0.1,
      zoomMax: 10.0,
      zoomWheelFactor: 0.025,
      gridEnabled: true,
      gridSize: 500,
      gridColor: "#111",
      followEnabled: true,
      followName: null,
      followEntityId: null
    };
  };

  initialize() {
    this.container = document.querySelector(this.options.container);
    this.canvas = document.querySelector(this.options.canvas);
    this.ctx = this.canvas.getContext('2d');

    var events = {
      'resize': (ev) => { this.updateMetrics(ev) },
      'orientationchange': (ev) => { this.updateMetrics(ev) },
      'mousedown': (ev) => { this.onMouseDown(ev); },
      'mousemove': (ev) => { this.onMouseMove(ev); },
      'mouseup': (ev) => { this.onMouseUp(ev); },
      //'wheel': (ev) => { this.onMouseWheel(ev); }
    };

    for (var name in events) {
      window.addEventListener(name, events[name], false);
    }

    // See also: http://phrogz.net/JS/wheeldelta.html
    var boundOnMouseWheel = (ev) => this.onMouseWheel(ev);
    if (window.addEventListener){
      window.addEventListener('mousewheel', boundOnMouseWheel, false); // Chrome/Safari/Opera
      window.addEventListener('DOMMouseScroll', boundOnMouseWheel, false); // Firefox
    } else if (window.attachEvent){
      window.attachEvent('onmousewheel', boundOnMouseWheel); // IE
    }

    this.debug = this.options.debug;
    this.followEnabled = this.options.followEnabled;
    this.zoom = this.options.zoom;
    this.followEntityId = this.options.followEntityId;
    this.gridEnabled = this.options.gridEnabled;
    this.lineWidth = this.options.lineWidth;

    this.cursorRawX = 0;
    this.cursorRawY = 0;

    this.cursorChanged = false;
    this.cursorPosition = { x: 0, y: 0 };

    this.cameraX = 0;
    this.cameraY = 0;

    this.debugDummySprite = { size: 100 };
  }

  draw(timeDelta) {
    this.updateMetrics();
    this.ctx.save();

    this.clear();
    this.centerAndZoom(timeDelta);
    this.followEntity(timeDelta);

    if (this.gridEnabled) { this.drawBackdrop(timeDelta); }

    this.drawScene(timeDelta);

    //if (this.debug) { this.drawDebugCursor(); }

    this.ctx.restore();
  }

  onMouseWheel(ev) {
    this.zoom += wheelDistance(ev) * this.options.zoomWheelFactor;
    if (this.zoom < this.options.zoomMin) {
      this.zoom = this.options.zoomMin;
    }
    if (this.zoom > this.options.zoomMax) {
      this.zoom = this.options.zoomMax;
    }
  }

  // TODO: Use a symbol for 'mouse{Down,Move,Up}' message?

  onMouseDown(ev) {
    this.setCursor(ev.clientX, ev.clientY);
    this.world.publish('mouseDown', this.cursorPosition);
  }

  onMouseMove(ev) {
    this.setCursor(ev.clientX, ev.clientY);
  }

  onMouseUp(ev) {
    this.setCursor(ev.clientX, ev.clientY);
    this.world.publish('mouseUp', this.cursorPosition);
  }

  update(timeDelta) {
    // Use the cursorChanged flag set by setCursor to limit mouseMove messages
    // to one per game loop tick
    if (this.cursorChanged) {
      this.cursorChanged = false;
      this.world.publish('mouseMove', this.cursorPosition);
    }
  }

  setCursor(x, y) {
    var width = this.container.offsetWidth;
    var height = this.container.offsetHeight;

    this.cursorRawX = x;
    this.cursorRawY = y;

    var newX = ((x - (width / 2)) / this.zoom) + this.cameraX;
    var newY = ((y - (height / 2)) / this.zoom) + this.cameraY;

    if (newX !== this.cursorPosition.x || newY !== this.cursorPosition.y) {
      this.cursorChanged = true;
      this.cursorPosition.x = newX;
      this.cursorPosition.y = newY;
    }
  }

  updateMetrics() {
    var width = this.container.offsetWidth;
    var height = this.container.offsetHeight;

    this.canvas.width = width;
    this.canvas.height = height;

    this.visibleWidth = width / this.zoom;
    this.visibleHeight = height / this.zoom;

    this.visibleLeft = (0 - this.visibleWidth / 2) + this.cameraX;
    this.visibleTop = (0 - this.visibleHeight / 2) + this.cameraY;
    this.visibleRight = this.visibleLeft + this.visibleWidth;
    this.visibleBottom = this.visibleTop + this.visibleHeight;
  }

  clear() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  centerAndZoom() {
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.scale(this.zoom, this.zoom);
  }

  followEntity() {
    if (!this.followEnabled) {
      this.cameraX = this.cameraY = 0;
      return;
    }
    if (this.options.followName && !this.followEntityId) {
      // Look up named entity, if necessary.
      this.followEntityId = Core.getComponent('Name')
        .findEntityByName(this.world, this.options.followName);
    }
    if (this.followEntityId) {
      // Adjust the viewport center offset to the entity position
      var position = this.world.entities.get('Position', this.followEntityId);
      if (position) {
        this.cameraX = position.x;
        this.cameraY = position.y;
        this.setCursor(this.cursorRawX, this.cursorRawY);
        this.ctx.translate(0 - this.cameraX, 0 - this.cameraY);
      }
    }
  }

  drawDebugCursor() {
    var ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = '#f0f';
    ctx.lineWidth = this.lineWidth / this.zoom;
    ctx.translate(this.cursorPosition.x, this.cursorPosition.y);
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(20, 0)
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 20);
    ctx.strokeRect(-10, -10, 20, 20);
    ctx.stroke();
    ctx.restore();
  }

  drawBackdrop() {
    var gridSize = this.options.gridSize;
    var gridOffsetX = this.visibleLeft % gridSize;
    var gridOffsetY = this.visibleTop % gridSize;

    var ctx = this.ctx;

    ctx.save();
    ctx.beginPath();

    ctx.strokeStyle = this.options.gridColor;
    ctx.lineWidth = this.lineWidth / this.zoom;

    for (var x = (this.visibleLeft - gridOffsetX); x < this.visibleRight; x += gridSize) {
      ctx.moveTo(x, this.visibleTop);
      ctx.lineTo(x, this.visibleBottom);
    }

    for (var y = (this.visibleTop - gridOffsetY); y < this.visibleBottom; y += gridSize) {
      ctx.moveTo(this.visibleLeft, y);
      ctx.lineTo(this.visibleRight, y);
    }

    ctx.stroke();
    ctx.restore();
  }

  drawScene(timeDelta) {
    var positions = this.world.entities.get('Position');
    for (var entityId in positions) {
      this.drawSprite(timeDelta, entityId, positions[entityId]);
    }
  }

  drawSprite(timeDelta, entityId, position) {

    var sprite = this.world.entities.get('Sprite', entityId);
    if (!sprite) { sprite = CanvasSprite.defaults(); }

    var spriteFn = getSprite(sprite.name);
    if (!spriteFn) { spriteFn = getSprite('default'); }

    var ctx = this.ctx;

    ctx.save();

    ctx.translate(position.x, position.y);
    ctx.rotate(position.rotation + Math.PI/2);
    ctx.scale(sprite.size / 100, sprite.size / 100);

    // HACK: Try to keep line width consistent regardless of zoom, to sort of
    // simulate a vector display
    ctx.lineWidth = this.lineWidth / this.zoom / (sprite.size / 100);

    /*
    if (this.debug) {
      ctx.strokeStyle = '#303';
      this.debugDummySprite.size = sprite.size;
      getSprite('default')(ctx, timeDelta, this.debugDummySprite);
    }
    */

    ctx.strokeStyle = sprite.color;
    spriteFn(ctx, timeDelta, sprite);

    ctx.restore();

  }

}

Core.registerSystem('CanvasViewport', CanvasViewport);

var spriteRegistry = {};
export function registerSprite(name, sprite) {
  spriteRegistry[name] = sprite;
}
export function getSprite(name) {
  return spriteRegistry[name];
}

registerSprite('default', (ctx, timeDelta, sprite) => {
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2, true);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -50);
  ctx.moveTo(0, 0);
  ctx.stroke();
});

registerSprite('sun', (ctx, timeDelta, sprite) => {
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2, true)
  ctx.stroke();
});

registerSprite('enemyscout', (ctx, timeDelta, sprite) => {
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.lineTo(-45, 50);
  ctx.lineTo(-12.5, 12.5);
  ctx.lineTo(0, 25);
  ctx.lineTo(12.5, 12.5);
  ctx.lineTo(45, 50);
  ctx.lineTo(0, -50);
  ctx.moveTo(0, -50);
  ctx.stroke();
});

registerSprite('hero', (ctx, timeDelta, sprite) => {
  ctx.rotate(Math.PI);
  ctx.beginPath();
  ctx.moveTo(-12.5, -50);
  ctx.lineTo(-25, -50);
  ctx.lineTo(-50, 0);
  ctx.arc(0, 0, 50, Math.PI, 0, true);
  ctx.lineTo(25, -50);
  ctx.lineTo(12.5, -50);
  ctx.lineTo(25, 0);
  ctx.arc(0, 0, 25, 0, Math.PI, true);
  ctx.lineTo(-12.5, -50);
  ctx.stroke();
});

registerSprite('asteroid', (ctx, timeDelta, sprite) => {

  if (!sprite.points) {
    var NUM_POINTS = 7 + Math.floor(8 * Math.random());
    var MAX_RADIUS = 50;
    var MIN_RADIUS = 35;
    var ROTATION = (Math.PI*2) / NUM_POINTS;

    sprite.points = [];
    for (var idx = 0; idx < NUM_POINTS; idx++) {
      var rot = idx * ROTATION;
      var dist = (Math.random() * (MAX_RADIUS - MIN_RADIUS)) + MIN_RADIUS;
      sprite.points.push([dist * Math.cos(rot), dist * Math.sin(rot)]);
    }
  }

  ctx.beginPath();
  ctx.moveTo(sprite.points[0][0], sprite.points[0][1]);
  for (var idx = 0; idx < sprite.points.length; idx++) {
    ctx.lineTo(sprite.points[idx][0], sprite.points[idx][1]);
  }
  ctx.lineTo(sprite.points[0][0], sprite.points[0][1]);
  ctx.stroke();

});
