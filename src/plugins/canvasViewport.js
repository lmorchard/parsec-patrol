import * as Core from "../core";

export class CanvasViewport extends Core.System {

  defaultOptions() {
    return {
      zoomStart: 1.0,
      zoomMin: 0.1,
      zoomMax: 10.0,
      zoomWheelFactor: 0.001,
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
      'wheel': (ev) => { this.onMouseWheel(ev); }
    };

    for (var name in events) {
      window.addEventListener(name, events[name], false);
    }

    this.zoom = this.options.zoomStart;
    this.followEntityId = this.options.followEntityId;

    this.cursorRawX = 0;
    this.cursorRawY = 0;

    this.cursorX = 0;
    this.cursorY = 0;

    this.cameraX = 0;
    this.cameraY = 0;

    this.updateMetrics();
  }

  onMouseDown(ev) {
    this.setCursor(ev.x, ev.y);
  }

  onMouseMove(ev) {
    this.setCursor(ev.x, ev.y);
  }

  onMouseUp(ev) {
    this.setCursor(ev.x, ev.y);
  }

  setCursor(x, y) {
    var width = this.container.offsetWidth;
    var height = this.container.offsetHeight;

    this.cursorRawX = x;
    this.cursorRawY = y;
    this.cursorX = ((x - (width / 2)) / this.zoom) - this.cameraX;
    this.cursorY = ((y - (height / 2)) / this.zoom) - this.cameraY;
  }

  onMouseWheel(ev) {
    this.zoom += ev.wheelDelta * this.options.zoomWheelFactor;
    if (this.zoom < this.options.zoomMin) {
      this.zoom = this.options.zoomMin;
    }
    if (this.zoom > this.options.zoomMax) {
      this.zoom = this.options.zoomMax;
    }
  }

  draw(timeDelta) {
    this.ctx.save();
    this.clear();
    this.centerAndZoom();
    this.followEntity();
    this.drawBackdrop();
    this.drawScene(timeDelta);
    this.ctx.restore();
  }

  updateMetrics() {
    var width = this.container.offsetWidth;
    var height = this.container.offsetHeight;

    this.canvas.width = width;
    this.canvas.height = height;
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
    if (this.options.followName && !this.followEntityId) {
      // Look up named entity, if necessary.
      this.followEntityId = Core.getComponent('Name')
        .findEntityByName(this.world, this.options.followName);
    }
    if (this.followEntityId) {
      // Adjust the viewport center offset to the entity position
      var position = this.world.entities.get('Position', this.followEntityId);
      if (position) {
        this.cameraX = 0 - position.x;
        this.cameraY = 0 - position.y;
        this.setCursor(this.cursorRawX, this.cursorRawY);
        this.ctx.translate(this.cameraX, this.cameraY);
      }
    }
  }

  drawBackdrop() {
    var left = -200;
    var right = 200;
    var top = -200;
    var bottom = 200;
    var step = 25

    var ctx = this.ctx;
    ctx.strokeStyle = "#333";

    for (var x = left; x <= right; x += step) {
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
    }

    for (var y = top; y <= bottom; y += step) {
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
    }

    ctx.stroke();
  }

  drawScene(timeDelta) {
    var ctx = this.ctx;
    var positions = this.world.entities.get('Position');

    for (var entityId in positions) {
      var position = positions[entityId];
      ctx.save();

      ctx.translate(position.x, position.y);
      ctx.rotate(position.rotation + Math.PI/2)

      this.drawSprite(ctx, timeDelta, entityId, position);

      ctx.restore();
    }
  }

  drawSprite(ctx, timeDelta, entityId, position) {
    ctx.strokeStyle = "#fff"

    ctx.beginPath()
    ctx.moveTo(0, -50)
    ctx.lineTo(-45, 50)
    ctx.lineTo(-12.5, 12.5)
    ctx.lineTo(0, 25)
    ctx.lineTo(12.5, 12.5)
    ctx.lineTo(45, 50)
    ctx.lineTo(0, -50)
    ctx.moveTo(0, -50)
    ctx.stroke()
  }

}
Core.registerSystem('CanvasViewport', CanvasViewport);
