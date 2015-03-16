import * as Core from "../core";

import "./position";
import "./motion";

import Vector2D from "../lib/Vector2D";

var PI2 = Math.PI * 2;

export class Steering extends Core.Component {
  static defaults() {
    return {

    };
  }
}

Core.registerComponent('Steering', Steering);

export class SteeringSystem extends Core.System {

  matchComponent() { return 'Steering'; }

  initialize() {

    this.seekFactor = 1;

    this.avoidFactor = 10;
    this.avoidSeeAhead = 300;
    this.avoidRayWidthFactor = 1.25;

    this.vTarget = new Vector2D();

    this.vectors = {
      avoid: new Vector2D(),
      seek: new Vector2D(),
      flee: new Vector2D(),
      wander: new Vector2D(),
      evade: new Vector2D(),
      pursue: new Vector2D()
    };

  }

  updateComponent(timeDelta, entityId, steering) {

    this.vTarget.setValues(0, 0);

    for (var key in this.vectors) {
      this.vectors[key].setValues(0, 0);
      this[key](this.vectors[key], timeDelta, entityId, steering);
      this.vTarget.add(this.vectors[key]);
    }

    this.applySteering(timeDelta, entityId, steering);

  }

  avoid(vector, timeDelta, entityId, steering) {

    var sprite = this.world.entities.get('Sprite', entityId);
    var position = this.world.entities.get('Position', entityId);

    // Scan ahead for an obstacle, bail if none found.
    var obstacle = this.lookForObstacle(entityId, position, sprite, steering);
    if (!obstacle) { return; }

    // Opposite right triangle leg is distance from obstacle to avoid collision.
    var oppositeLen = obstacle.sprite.size / 2 +
      sprite.size * this.avoidRayWidthFactor;

    // Hypotenuse length is distance from obstacle.
    var hypotenuseLen = Math.sqrt(
      Math.pow(obstacle.position.x - position.x, 2) +
      Math.pow(obstacle.position.y - position.y, 2)
    );

    // Adjacent length would be avoid tangent, but no need to calculate.

    // Find angle from direct collision to avoidance
    var theta = Math.asin(oppositeLen / hypotenuseLen);

    // HACK: Too close, panic and steer hard away
    if (isNaN(theta)) { theta = Math.PI * 0.66; }

    // Find the absolute angle to the obstacle from entity.
    var obstacleAngle = Math.atan2(
      obstacle.position.y - position.y,
      obstacle.position.x - position.x
    );

    // Calculate nearest target angle for avoidance...
    // Try turning clockwise from obstacle.
    var avoidAngle = (obstacleAngle + theta);
    // Calculate the "travel" needed from current rotation.
    var travel = Math.min(PI2 - Math.abs(position.rotation - avoidAngle),
                          Math.abs(position.rotation - avoidAngle));
    if (travel > theta) {
      // Clockwise travel exceeds theta, so counterclockwise is shorter.
      avoidAngle = obstacleAngle - theta;
    }

    // Set up the avoidance vector.
    vector.setValues(this.avoidFactor, 0);
    vector.rotate(avoidAngle);

  }

  lookForObstacle(entityId, position, sprite, steering) {
    var rayWidth = sprite.size * this.avoidRayWidthFactor;

    var vRayUnit = new Vector2D();
    vRayUnit.setValues(rayWidth, 0);
    vRayUnit.rotate(position.rotation);

    if (this.world.debug) { steering.hitCircles = []; }

    var obstacle;
    var steps = this.avoidSeeAhead / rayWidth;
    for (var step = 0; step < steps; step++) {
      obstacle = this.searchCircleForObstacle(
        steering, entityId,
        position.x + vRayUnit.x * step,
        position.y + vRayUnit.y * step,
        rayWidth
      );
      if (obstacle) { break; }
    }

    return obstacle;
  }

  searchCircleForObstacle(steering, entityId, x, y, size) {

    if (this.world.debug) {
      steering.hitCircles.push([x, y, size]);
    }

    var hits = [];

    this.world.getSystem('Collision').quadtree.iterate({
      x: x - (size / 2),
      y: y - (size / 2),
      width: size,
      height: size
    }, (item) => {

      if (entityId == item.entityId) { return; }
      var dx = item.position.x - x;
      var dy = item.position.y - y;
      var range = dx*dx + dy*dy;
      var radii = (size + item.sprite.size) / 2;
      if (range < radii*radii) {
        hits.push([range, item]);
      }

    });

    hits.sort(function (a, b) { return b[0] - a[0]; });
    return hits.length ? hits[0][1] : null;
  }

  seek(vector, timeDelta, entityId, steering) {

    // Look up the entity ID to seek, if only name given.
    if (steering.seekTargetName && !steering.seekTargetEntityId) {
      steering.seekTargetEntityId = Core.getComponent('Name')
        .findEntityByName(this.world, steering.seekTargetName);
    }

    if (!steering.seekTargetEntityId) { return; }

    var position = this.world.entities.get('Position', entityId);
    if (!position) { return; }

    // Accept either a raw x/y coord or entity ID as target
    var targetPosition = steering.targetPosition;
    if (!targetPosition) {
      targetPosition = this.world.entities.get('Position', steering.seekTargetEntityId);
    }
    if (!targetPosition) { return; }

    vector.setValues(targetPosition.x - position.x, targetPosition.y - position.y);
    vector.normalize();
    vector.multiplyScalar(this.seekFactor);

  }

  flee(vector, timeDelta, entityId, steering) {
  }

  wander(vector, timeDelta, entityId, steering) {
  }

  evade(vector, timeDelta, entityId, steering) {
  }

  pursue(vector, timeDelta, entityId, steering) {
  }

  applySteering(timeDelta, entityId, steering) {

    var motion = this.world.entities.get('Motion', entityId);

    var targetDr = 0;

    if (!this.vTarget.isZero()) {
      var position = this.world.entities.get('Position', entityId);

      // Get the target angle, ensuring a 0..2*Math.PI range.
      var targetAngle = this.vTarget.angle();
      if (targetAngle < 0) { targetAngle += (2 * Math.PI); }

      if (this.world.debug) { steering.targetAngle = targetAngle; }

      // Pick the direction from current to target angle
      var direction = (targetAngle < position.rotation) ? -1 : 1;

      // If the offset between the angles is more than half a circle, it's
      // shorter to go the other way.
      var offset = Math.abs(targetAngle - position.rotation);
      if (offset > Math.PI) { direction = 0 - direction; }

      // Work out the desired delta-rotation to steer toward target
      targetDr = direction * Math.min(steering.radPerSec, offset / timeDelta);
    }

    // Calculate the delta-rotation impulse required to meet the goal,
    // but constrain to the capability of the steering thrusters
    var impulseDr = (targetDr - motion.drotation);
    if (Math.abs(impulseDr) > steering.radPerSec) {
      if (impulseDr > 0) {
        impulseDr = steering.radPerSec;
      } else if (impulseDr < 0) {
        impulseDr = 0 - steering.radPerSec;
      }
    }

    motion.drotation += impulseDr;

  }

  draw(timeDelta) {
    if (!this.world.debug) { return; }

    var vpSystem = this.world.getSystem('CanvasViewport');
    var ctx = vpSystem.ctx;
    ctx.save();

    vpSystem.centerAndZoom(timeDelta);
    vpSystem.followEntity(timeDelta);

    var matches = this.getMatchingComponents();
    for (var entityId in matches) {
      ctx.save();

      var steering = matches[entityId];
      var position = this.world.entities.get('Position', entityId);

      this.drawSteeringVsPosition(ctx, steering, position);

      if (steering.hitCircles) {
        for (var [x, y, size] of steering.hitCircles) {
          ctx.strokeStyle = '#d00';
          ctx.beginPath();
          ctx.arc(x, y, size, 0, PI2, false);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    ctx.restore();
  }

  drawSteeringVsPosition(ctx, steering, position) {
    this.drawAngle(ctx, position, position.rotation, '#ddd');
    if (steering.targetAngle) {
      this.drawAngle(ctx, position, steering.targetAngle, '#dd0');
    }
  }

  drawAngle(ctx, position, angle, color) {
    var vec = new Vector2D();
    vec.setValues(this.avoidSeeAhead, 0);
    vec.rotate(angle);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(position.x + vec.x, position.y + vec.y);
    ctx.stroke();
  }

}

Core.registerSystem('Steering', SteeringSystem);

function normalizeAngle(angle) {
  angle = angle % PI2;
  return angle >= 0 ? angle : angle + PI2;
};
