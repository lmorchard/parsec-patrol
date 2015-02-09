import * as Entities from "./entities";
import * as Components from "./components";

var systemRegistry = {};

export function register(systemName, system) {
  systemRegistry[systemName] = system;
}

export function get(systemName) {
  return systemRegistry[systemName];
}

export class System {

  constructor(options) {
    this.options = options || {};
  }

  setWorld(world) {
    this.world = world;
  }

  matchComponent() { return ''; }

  initialize() { }

  getMatchingComponents() {
    return this.world.entities.get(this.matchComponent());
  }

  update(timeDelta) {
    var matches = this.getMatchingComponents();
    for (var entityId in matches) {
      var component = matches[entityId];
      this.updateComponent(timeDelta, entityId, component);
    }
  }

  updateComponent(timeDelta, entityId, component) { }

  drawStart(timeDelta) { }

  draw(timeDelta) { }

  drawEnd(timeDelta) { }

}
