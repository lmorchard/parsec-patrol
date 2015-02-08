import * as Entities from "../entities"
import * as Components from "../components";
import * as Systems from "../systems";

import "./position"

export class Motion extends Components.Component {
  static defaults() {
    return { dx: 0, dy: 0, drotation: 0 };
  }
}
Components.register('Motion', Motion);

export class MotionSystem extends Systems.System {
  matchComponent() {
    return 'Motion';
  }
  updateComponent(timeDelta, entityId, motion) {
    var pos = this.world.entities.getComponent(entityId, 'Position');
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
Systems.register('Motion', MotionSystem);
