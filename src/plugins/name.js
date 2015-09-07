import * as Core from "core";

export class Name extends Core.Component {
  static defaults() {
    return { name: "unnamed" };
  }
  static findEntityByName(world, name) {
    var names = world.entities.get('Name');
    for (var nid in names) {
      var nameComponent = names[nid];
      if (nameComponent.name == name) {
        return nid;
      }
    }
  }
}

Core.registerComponent('Name', Name);
