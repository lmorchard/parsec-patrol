import * as Entities from "./entities";
import * as Components from "./components";

export class System {

  constructor() {
  }

  setWorld(world) {
    this.world = world;
  }

  matchComponent() { return ''; }

  initialize() { }

  getMatchingComponents() {
    return this.world.entities.getComponents(this.matchComponent());
  }

  update(timeDelta) {
    var matches = this.getMatchingComponents();
    for (var entityId in matches) {
      var component = matches[entityId];
      this.updateComponent(timeDelta, entityId, component);
    }
  }

  updateComponent(timeDelta, entityId, component) { }

  draw(timeDelta) { }

}

export class MotionSystem extends System {
  matchComponent() {
    return Components.Motion.name;
  }
  updateComponent(timeDelta, entityId, motion) {
    var pos = this.world.entities.getComponent(entityId, Components.Position.name);
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
