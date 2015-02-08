import _ from 'lodash';

var componentRegistry = {};

export function register(componentName, componentManager) {
  componentRegistry[componentName] = componentManager;
}

export function get(componentName) {
  return componentRegistry[componentName];
}

export class Component {
  static defaults() {
    return {};
  }
  static create(attrs) {
    return _.extend(this.defaults(), attrs || {}, { manager: this })
  }
}

export class Name extends Component {
  static defaults() {
    return { name: "unnamed" };
  }
}
register('Name', Name);
