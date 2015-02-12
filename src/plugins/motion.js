import * as Core from "../core";

import "./position"

export class Motion extends Core.Component {
  static defaults() {
    return { dx: 0, dy: 0, drotation: 0 };
  }
}
Core.registerComponent('Motion', Motion);

export class MotionSystem extends Core.System {
  matchComponent() {
    return 'Motion';
  }
  updateComponent(timeDelta, entityId, motion) {
    var pos = this.world.entities.get('Position', entityId);
    pos.x += motion.dx * timeDelta
    pos.y += motion.dy * timeDelta

    // Update the rotation, ensuring a 0..2*Math.PI range.
    var PI2 = Math.PI * 2;
    pos.rotation = (pos.rotation + (motion.drotation * timeDelta)) % PI2;
    if (pos.rotation < 0) {
      pos.rotation += PI2;
    }
  }
}
Core.registerSystem('Motion', MotionSystem);
