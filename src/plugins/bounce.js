import * as Core from "../core";

import "./position";
import "./motion";

import Vector2D from "../lib/Vector2D";

export class BounceComponent extends Core.Component {
  static defaults() {
    return {
      mass: 1000.0
    }
  }
}

Core.registerComponent('Bounce', BounceComponent);

export class BounceSystem extends Core.System {

  matchComponent() { return 'Bounce'; }

  initialize() {
    this.dn = new Vector2D();
    this.dt = new Vector2D();
    this.mt = new Vector2D();
    this.v1 = new Vector2D();
    this.v2 = new Vector2D();
    this.v1n = new Vector2D();
    this.v1t = new Vector2D();
    this.v2n = new Vector2D();
    this.v2t = new Vector2D();
    this.vaMotion = new Vector2D();
    this.vbMotion = new Vector2D();
  }

  update(timeDelta) {
    var entities = this.world.entities;
    var matches = this.getMatchingComponents();

    var pairs = {};
    for (var aEntityId in matches) {

      var bounce = matches[aEntityId];
      var aCollidable = entities.get('Collidable', aEntityId);

      for (var bEntityId in aCollidable.inCollisionWith) {
        var pair = [aEntityId, bEntityId];
        pair.sort();
        pairs[pair.join(':')] = pair;
      }

      // TODO: Process world boundary edge bounce?

    }

    for (var key in pairs) {
      var aEntityId = pairs[key][0];
      var bEntityId = pairs[key][1];

      var aBouncer = entities.get('Bounce', aEntityId);
      if (!aBouncer) { continue; }

      var bBouncer = entities.get('Bounce', bEntityId);
      if (!bBouncer) { continue; }

      var aPosition = entities.get('Position', aEntityId);
      var aSprite = entities.get('Sprite', aEntityId);
      var aMotion = entities.get('Motion', aEntityId);

      var bPosition = entities.get('Position', bEntityId);
      var bSprite = entities.get('Sprite', bEntityId);
      var bMotion = entities.get('Motion', bEntityId);

      this.resolveElasticCollision(timeDelta,
        aEntityId, aBouncer, aPosition, aSprite, aMotion,
        bEntityId, bBouncer, bPosition, bSprite, bMotion);
    }

  }

  resolveElasticCollision(timeDelta,
      aEntityId, aBouncer, aPosition, aSprite, aMotion,
      bEntityId, bBouncer, bPosition, bSprite, bMotion) {

    // Vector between entities
    this.dn.x = aPosition.x - bPosition.x;
    this.dn.y = aPosition.y - bPosition.y;

    // Distance between entities
    var delta = this.dn.magnitude();

    // Normal vector of the collision plane
    this.dn.normalize();

    // Tangential vector of the collision plane
    this.dt.x = this.dn.y;
    this.dt.y = -this.dn.x;

    // HACK: avoid divide by zero
    if (delta === 0) { bPosition.x += 0.01; }

    // Get total mass for entities
    var m1 = aBouncer.mass;
    var m2 = bBouncer.mass;
    var M = m1 + m2;

    // Minimum translation vector to push entities apart
    this.mt.x = this.dn.x * (aSprite.width + bSprite.width - delta);
    this.mt.y = this.dn.y * (aSprite.height + bSprite.height - delta);

    // Velocity vectors of entities before collision
    this.v1.x = (aMotion) ? aMotion.dx : 0;
    this.v1.y = (aMotion) ? aMotion.dy : 0;
    this.v2.x = (bMotion) ? bMotion.dx : 0;
    this.v2.y = (bMotion) ? bMotion.dy : 0;

    // split the velocity vector of the first entity into a normal
    // and a tangential component in respect of the collision plane
    this.v1n.x = this.dn.x * this.v1.dot(this.dn);
    this.v1n.y = this.dn.y * this.v1.dot(this.dn);
    this.v1t.x = this.dt.x * this.v1.dot(this.dt);
    this.v1t.y = this.dt.y * this.v1.dot(this.dt);

    // split the velocity vector of the second entity into a normal
    // and a tangential component in respect of the collision plane
    this.v2n.x = this.dn.x * this.v2.dot(this.dn);
    this.v2n.y = this.dn.y * this.v2.dot(this.dn);
    this.v2t.x = this.dt.x * this.v2.dot(this.dt);
    this.v2t.y = this.dt.y * this.v2.dot(this.dt);

    // calculate new velocity vectors of the entities, the tangential
    // component stays the same, the normal component changes analog to
    // the 1-Dimensional case

    // TODO: refactor below

    if (aMotion) {
      this.vaMotion.x = this.v1t.x +
          this.dn.x * ((m1 - m2) / M * this.v1n.magnitude() +
          2 * m2 / M * this.v2n.magnitude());
      this.vaMotion.y = this.v1t.y +
          this.dn.y * ((m1 - m2) / M * this.v1n.magnitude() +
          2 * m2 / M * this.v2n.magnitude());
      // @processDamage(eid, bEntityId, v_motion, bouncer, m1)
      aMotion.dx = this.vaMotion.x;
      aMotion.dy = this.vaMotion.y;
    }

    if (bMotion) {
      this.vbMotion.x = this.v2t.x -
          this.dn.x * ((m2 - m1) / M * this.v2n.magnitude() +
          2 * m1 / M * this.v1n.magnitude());
      this.vbMotion.y = this.v2t.y -
          this.dn.y * ((m2 - m1) / M * this.v2n.magnitude() +
          2 * m1 / M * this.v1n.magnitude());
      // @processDamage(eid, bEntityId, v_bMotion, c_bouncer, m2)
      bMotion.dx = this.vbMotion.x
      bMotion.dy = this.vbMotion.y
    }

  }

}

Core.registerSystem('Bounce', BounceSystem);
