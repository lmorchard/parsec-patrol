import * as Entities from "../entities"
import * as Components from "../components";
import * as Systems from "../systems";

export class CanvasViewport extends Systems.System {

  initialize() {
    this.container = document.querySelector(this.options.container);
    this.canvas = document.querySelector(this.options.canvas);
    this.ctx = this.canvas.getContext('2d');

    window.addEventListener('resize',
        () => { this.updateMetrics() }, false);

    window.addEventListener('orientationchange',
        () => { this.updateMetrics() }, false);

    this.updateMetrics();
  }

  draw(timeDelta) {

    var width = this.canvas.width;
    var height = this.canvas.height;

    var ctx = this.ctx;
    ctx.save();

    ctx.translate(width / 2, height / 2);

    this.clear()
    this.drawGrid();
    this.drawScene(timeDelta);

    ctx.restore();
  }

  updateMetrics() {
    var width = this.container.offsetWidth;
    var height = this.container.offsetHeight;

    this.canvas.width = width;
    this.canvas.height = height;
  }

  clear() {
    var width = this.canvas.width;
    var height = this.canvas.height;
    var ctx = this.ctx;
    ctx.fillStyle = "rgba(0, 0, 0, 1.0)"
    ctx.fillRect(-width/2, -height/2, width, height)
  }

  drawGrid() {
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
    var positions = this.world.entities.getComponents('Position');

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

    /*
    ctx.beginPath()
    ctx.moveTo(0, -50)
    ctx.lineTo(-50, 50)
    ctx.lineTo(50, 50)
    ctx.lineTo(0, -50)
    ctx.stroke()
    */

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

    /*
    ctx.arc(0, 0, 10, 0, Math.PI*2, true)
    ctx.fill()
    */

  }

}
Systems.register('CanvasViewport', CanvasViewport);
