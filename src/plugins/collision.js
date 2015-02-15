import * as Core from "../core";

import QuadTree from "../lib/QuadTree";

export class Collidable extends Core.Component {
  static defaults() {
    return {
      inCollision: false,
      inCollisionWith: {}
    }
  }
}

Core.registerComponent('Collidable', Collidable);

export class CollisionSystem extends Core.System {

  defaultOptions() {
    return {
      width: 5000,
      height: 5000,
      quadtreeObjectsPerNode: 10
    };
  };

  matchComponent() { return 'Collidable'; }

  initialize() {
    this.width = this.options.width;
    this.height = this.options.height;

    this.quadtree = new QuadTree(
      0 - this.width/2,
      0 - this.height/2,
      this.width,
      this.height,
      this.options.quadtreeObjectsPerNode
    );

    this.retrieveBounds = {};
  }

  update(timeDelta) {

    var matches = this.getMatchingComponents();

    this.quadtree.clear();

    for (var entityId in matches) {
      var component = matches[entityId];
      this.updateQuadtreeWithComponent(entityId, component);
    }

    for (var entityId in matches) {
      var component = matches[entityId];
      this.updateComponent(timeDelta, entityId, component);
    }

  }

  updateQuadtreeWithComponent(entityId, collidable) {
    var entities = this.world.entities;

    var sprite = entities.get('Sprite', entityId);
    if (!sprite) { return; }

    var position = entities.get('Position', entityId);
    if (!position) { return; }

    collidable.entityId = entityId;
    collidable.x = position.x - sprite.width/2;
    collidable.y = position.y - sprite.height/2;
    collidable.width = sprite.width;
    collidable.height = sprite.height;
    collidable.right = collidable.x + collidable.width;
    collidable.bottom = collidable.y + collidable.height;
    collidable.position = position;
    collidable.sprite = sprite;
    collidable.inCollision = false;
    collidable.inCollisionWith = {};

    this.quadtree.insert(collidable);
  }

  updateComponent(timeDelta, entityId, component) {
    var entities = this.world.entities;

    var sprite = entities.get('Sprite', entityId);
    if (!sprite) { return; }

    var position = entities.get('Position', entityId);
    if (!position) { return; }

    this.retrieveBounds.x = position.x;
    this.retrieveBounds.y = position.y;
    this.retrieveBounds.right = position.x + sprite.width;
    this.retrieveBounds.bottom = position.y + sprite.height;

    this.quadtree.iterate(this.retrieveBounds,
        (neighbor) => this.checkCollision(component, neighbor));
  }

  checkCollision(aCollidable, bCollidable) {

    if (aCollidable.entityId === bCollidable.entityId) { return; }
    if (Math.abs(aCollidable.position.x - bCollidable.position.x) * 2 >
          (aCollidable.sprite.width + bCollidable.sprite.width)) { return; }
    if (Math.abs(aCollidable.position.y - bCollidable.position.y) * 2 >
          (aCollidable.sprite.height + bCollidable.sprite.height)) { return; }

    aCollidable.inCollision = true;
    aCollidable.inCollisionWith[bCollidable.entityId] = 1;

    bCollidable.inCollision = true;
    bCollidable.inCollisionWith[aCollidable.entityId] = 1;

  }

  draw(timeDelta) {
    var vpSystem = this.world.getSystem('CanvasViewport');
    if (!vpSystem) { return; }
    if (!vpSystem.debug) { return; }

    var ctx = vpSystem.ctx;
    ctx.save();

    vpSystem.centerAndZoom(timeDelta);
    vpSystem.followEntity(timeDelta);

    this.drawDebugQuadtree(timeDelta, ctx);
    this.drawDebugInCollision(timeDelta, ctx);

    ctx.restore();
  }

  drawDebugQuadtree(timeDelta, ctx) {
    ctx.save();
    ctx.strokeStyle = "#404";

    var drawNode = (root) => {
      if (!root) { return; }
      var b = root.bounds;
      ctx.strokeRect(b.x, b.y, b.width, b.height);
      for (var idx = 0, node; node = root.nodes[idx]; idx++) {
        drawNode(node);
      }
    };

    var qt = this.quadtree;
    if (qt) { drawNode(qt); }

    ctx.restore();
  }

  drawDebugInCollision(timeDelta, ctx) {
    ctx.strokeStyle = "#440";
    var matches = this.getMatchingComponents();

    for (var entityId in matches) {

      var collidable = matches[entityId];
      var position = this.world.entities.get('Position', entityId);
      var sprite = this.world.entities.get('Sprite', entityId);

      if (collidable.inCollision) {
        ctx.strokeRect(
            position.x - sprite.width/2, position.y - sprite.height/2,
            sprite.width, sprite.height);
      }

    }
  }

}

Core.registerSystem('Collision', CollisionSystem);
