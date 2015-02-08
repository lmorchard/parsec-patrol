import * as Components from "./components";

export class EntityManager {

  constructor() {
    this.reset();
  }

  reset() {
    this.store = {};
    this.lastEntityId = 0;
  }

  generateEntityId() {
    return ++(this.lastEntityId);
  }

  insert(...items) {
    var out = [];
    for (var idx=0, item; item=items[idx]; idx++) {
      var entityId = this.generateEntityId();
      for (var componentName in item) {
        var componentAttrs = item[componentName];
        this.addComponent(entityId, componentName, componentAttrs);
      }
      out.push(entityId);
    }
    return out.length > 1 ? out : out[0];
  }

  destroy(entityId) {
    for (var componentName in this.store) {
      this.removeComponent(entityId, componentName);
    }
  }

  addComponent(entityId, componentName, componentAttrs) {
    var componentManager = Components.get(componentName);
    var component = componentManager.create(componentAttrs);
    if (!this.store[componentName]) {
      this.store[componentName] = {};
    }
    this.store[componentName][entityId] = component;
  }

  removeComponent(entityId, componentName) {
    if (entityId in this.store[componentName]) {
      delete this.store[componentName][entityId];
    }
  }

  hasComponent(entityId, componentName) {
    return (componentName in this.store) &&
           (entityId in this.store[componentName]);
  }

  getComponent(entityId, componentName) {
    return this.store[componentName][entityId];
  }

  getComponents(componentName) {
    if (!this.store[componentName]) { return {}; }
    return this.store[componentName];
  }

  get(entityId, componentName) {
    return this.store[componentName][entityId];
  }

}
