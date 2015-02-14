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
    this.updateMetrics();
  }

  onMouseDown(ev) {
    console.log("DOWN", ev);
  }

  onMouseMove(ev) {
  }

  onMouseUp(ev) {
    console.log("UP", ev);
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

    // Look up the orbited entity ID, if only name given.
    if (this.options.followName && !this.options.followEntityId) {
      this.options.followEntityId = Core.getComponent('Name')
        .findEntityByName(this.world, this.options.followName);
    }

    var width = this.canvas.width;
    var height = this.canvas.height;

    this.ctx.save();
    this.clear();

    // Move origin point to canvas center
    this.ctx.translate(width / 2, height / 2);

    this.ctx.scale(this.zoom, this.zoom);

    if (this.options.followEntityId) {
      var position = this.world.entities.get('Position', this.options.followEntityId);
      if (position) {
        this.ctx.translate(0 - position.x, 0 - position.y);
      }
    }

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
    this.ctx.fillStyle = "rgba(0, 0, 0, 1.0)"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
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
