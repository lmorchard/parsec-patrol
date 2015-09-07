import * as Core from "core";

import "plugins/position";
import "plugins/motion";

import Vector2D from "Vector2D";

export class Seeker extends Core.Component {
  static defaults() {
    return {
      targetName: null,
      targetEntityId: null,
      targetPosition: null,
      acquisitionDelay: 0,
      radPerSec: Math.PI
    };
  }
}

Core.registerComponent('Seeker', Seeker);

export class SeekerSystem extends Core.System {

  matchComponent() { return 'Seeker'; }

  initialize() {
    this.vSeeker = new Vector2D();
    this.vTarget = new Vector2D();
  }

  updateComponent(timeDelta, entityId, seeker) {

    // Look up the orbited entity ID, if only name given.
    if (seeker.targetName && !seeker.targetEntityId) {
      seeker.targetEntityId = Core.getComponent('Name')
        .findEntityByName(this.world, seeker.targetName);
    }

    // Process a delay before the seeker "acquires" the target and
    // starts steering. Makes missiles look interesting.
    if (seeker.acquisitionDelay > 0) {
      seeker.acquisitionDelay -= timeDelta;
      return;
    }

    var position = this.world.entities.get('Position', entityId);
    var motion = this.world.entities.get('Motion', entityId);
    if (!position || !motion) { return; }

    // Accept either a raw x/y coord or entity ID as target
    var targetPosition = seeker.targetPosition;
    if (!targetPosition) {
      targetPosition = this.world.entities.get('Position', seeker.targetEntityId);
    }
    if (!targetPosition || !(targetPosition.x && targetPosition.y)) { return; }

    // Set up the vectors for angle math...
    this.vSeeker.setValues(position.x, position.y);
    this.vTarget.setValues(targetPosition.x, targetPosition.y);

    // Get the target angle, ensuring a 0..2*Math.PI range.
    var targetAngle = this.vSeeker.angleTo(this.vTarget)
    if (targetAngle < 0) {
      targetAngle += (2 * Math.PI);
    }

    // Pick the direction from current to target angle
    var direction = (targetAngle < position.rotation) ? -1 : 1;

    // If the offset between the angles is more than half a circle, go
    // the other way because it'll be shorter.
    var offset = Math.abs(targetAngle - position.rotation);
    if (offset > Math.PI) {
      direction = 0 - direction;
    }

    // Work out the desired delta-rotation to steer toward target
    var targetDr = direction * Math.min(seeker.radPerSec, offset / timeDelta);

    // Calculate the delta-rotation impulse required to meet the goal,
    // but constrain to the capability of the steering thrusters
    var impulseDr = (targetDr - motion.drotation);
    if (Math.abs(impulseDr) > seeker.radPerSec) {
      if (impulseDr > 0) {
        impulseDr = seeker.radPerSec;
      } else if (impulseDr < 0) {
        impulseDr = 0 - seeker.radPerSec;
      }
    }
    motion.drotation += impulseDr;

  }

}

Core.registerSystem('Seeker', SeekerSystem);
