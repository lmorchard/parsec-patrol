import * as Core from "../core";

import "./position";
import "./motion";

import Vector2D from "../lib/Vector2D";

export class Thruster extends Core.Component {
  static defaults() {
    return {
      active: true,
      stop: false,
      useBrakes: true,
      deltaV: 0,
      maxV: 0
    };
  }
}
Core.registerComponent('Thruster', Thruster);

export class ThrusterSystem extends Core.System {

  matchComponent() { return 'Thruster'; }

  constructor() {
    this.vInertia = new Vector2D();
    this.vThrust = new Vector2D();
    this.vBrakes = new Vector2D();
  }

  updateComponent(timeDelta, entityId, thruster) {

    if (!thruster.active) { return; }

    var pos = this.world.entities.get('Position', entityId);
    var motion = this.world.entities.get('Motion', entityId);
    if (!pos || !motion) { return; }

    // Inertia is current motion
    this.vInertia.setValues(motion.dx, motion.dy);

    // delta-v available for the current tick
    var tickDeltaV = timeDelta * thruster.deltaV;

    if (!thruster.stop) {
      // Create thrust vector per rotation and add to inertia.
      this.vThrust.setValues(tickDeltaV, 0);
      this.vThrust.rotate(pos.rotation);
      this.vInertia.add(this.vThrust);
    }

    if (thruster.useBrakes) {
      // Try to enforce the max_v limit with braking thrust.
      var maxV = thruster.stop ? 0 : thruster.maxV;
      var currV = this.vInertia.magnitude();
      var overV = currV - maxV;
      if (overV > 0) {
        // Braking delta-v is max thruster output or remaining overage,
        // whichever is smallest. Braking vector opposes inertia.
        var brakingDv = Math.min(tickDeltaV, overV);
        this.vBrakes.setValues(this.vInertia.x, this.vInertia.y);
        this.vBrakes.normalize();
        this.vBrakes.multiplyScalar(0-brakingDv);
        this.vInertia.add(this.vBrakes);
      }
      if (thruster.stop && currV === 0) {
        thruster.active = false;
      }
    }

    // Update inertia. Note that we've been careful only to make changes
    // to inertia within the delta-v of the thruster. Other influences
    // on inertia should be preserved.
    motion.dx = this.vInertia.x;
    motion.dy = this.vInertia.y;
  }

}
Core.registerSystem('Thruster', ThrusterSystem);
