import * as Core from "core";
import * as util from "util";

export class Pathfinder extends Core.Component {
  static defaults() {
    return {
      width: 5000,
      height: 5000
    }
  }
}

Core.registerComponent('Pathfinder', Pathfinder);

export class SpaceTree {

  constructor(quadtree, x, y, width, height, level, maxLevel=4) {
    let bounds = quadtree.bounds;

    this.x = x || bounds.x;
    this.y = y || bounds.y;
    this.width = width || bounds.width;
    this.height = height || bounds.height;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
    this.level = level || 0;
    this.empty = true;
    this.full = false;
    this.children = [];

    var ct = 0;

    var results = quadtree.iterate({
      x: this.x, y: this.y, right: this.right, bottom: this.bottom
    }, (obj) => {

      var dx = Math.abs(obj.x - this.x) * 2;
      var dy = Math.abs(obj.y - this.y) * 2;
      var dwidth = (obj.right - obj.x) + this.width;
      var dheight = (obj.bottom - obj.y) + this.height;

      console.log("ITERATE", obj, dx, dy, dwidth, dheight);

      if (dx < dwidth && dy < dheight) {
        ct++;
        if (obj.x <= this.x && obj.y <= this.y &&
            obj.right >= this.right && obj.bottom >= this.bottom) {
          this.full = true;
        }
      }
    });

    if (ct == 0) {
      this.empty = true;
      return;
    }

    this.empty = false;
    if (!this.full && this.level < maxLevel) {
      this.split(quadtree);
    }

  }

  split(quadtree) {
    var splitWidth = this.width / 2;
    var splitHeight = this.height / 2;

    this.children[0] = new SpaceTree(quadtree,
        this.x, this.y,
        splitWidth, splitHeight, this.level + 1);

    this.children[1] = new SpaceTree(quadtree,
        this.x + splitWidth, this.y,
        splitWidth, splitHeight, this.level + 1);

    this.children[2] = new SpaceTree(quadtree,
        this.x, this.y + splitHeight,
        splitWidth, splitHeight, this.level + 1);

    this.children[3] = new SpaceTree(quadtree,
        this.x + splitWidth, this.y + splitHeight,
        splitWidth, splitHeight, this.level + 1);
  }

}

export class PathfindingSystem extends Core.System {

  matchComponent() { return 'Pathfinder'; }

  initialize() {
  }

  update(timeDelta) {
    var collisionSystem = this.world.getSystem('Collision');
    var quadtree = collisionSystem.quadtree;


  }

  draw(timeDelta) {
    if (!this.debug) { return; }

    var vpSystem = this.world.getSystem('CanvasViewport');

    var ctx = vpSystem.ctx;
    ctx.save();

    vpSystem.centerAndZoom(timeDelta);
    vpSystem.followEntity(timeDelta);

    // draw

    ctx.restore();
  }

}

Core.registerSystem('Pathfinding', PathfindingSystem);
