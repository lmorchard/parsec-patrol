import _ from 'lodash';

const TARGET_FPS = 60;
const TARGET_DURATION = 1000 / TARGET_FPS;

var requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  (fn) => setTimeout(fn, (1000/60));

export class World {

  constructor(options) {
    options = options || {};

    this.isRunning = false;
    this.isPaused = false;

    this.entities = new EntityManager();

    this.systems = {};
    if (options.systems) {
      this.addSystems(options.systems);
    }

    this.tickDuration = TARGET_DURATION;
    this.maxTickDelta = TARGET_DURATION * 5;
    this.tickAccumulator = 0;

    this.lastTickTime = 0;
    this.lastDrawTime = 0;
  }

  addSystems(systemsData) {
    for (var systemName in systemsData) {
      var systemAttrs = systemsData[systemName];
      var systemCls = getSystem(systemName);
      var system = new systemCls(systemAttrs);
      system.setWorld(this);
      this.systems[systemName] = system;
    }
  }

  getSystem(systemName) {
    return this.systems[systemName];
  }

  start() {
    if (this.isRunning) { return; }
    this.isRunning = true;

    for (var systemName in this.systems) {
      this.systems[systemName].initialize();
    }

    // Game logic separated from display rendering
    // See also: http://www.chandlerprall.com/2012/06/requestanimationframe-is-not-your-logics-friend/
    this.lastTickTime = Date.now();
    this.lastDrawTime = 0;
    setTimeout(() => this.tickLoop(), this.tickDuration);
    requestAnimationFrame((timestamp) => this.drawLoop(timestamp));

    return this;
  }

  stop() {
    this.isRunning = false;
    return this;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  tick(timeDelta) {
    for (var systemName in this.systems) {
      this.systems[systemName].update(timeDelta);
    }
  }

  tickLoop() {
    var timeNow = Date.now();
    var timeDelta = Math.min(timeNow - this.lastTickTime, this.maxTickDelta);
    this.lastTickTime = timeNow;

    if (!this.isPaused) {
      // Fixed-step game logic loop
      // see: http://gafferongames.com/game-physics/fix-your-timestep/
      this.tickAccumulator += timeDelta;
      while (this.tickAccumulator > this.tickDuration) {
        this.tick(this.tickDuration);
        this.tickAccumulator -= this.tickDuration;
      }
    }

    if (this.isRunning) {
      setTimeout(() => this.tickLoop(), this.tickDuration);
    }
  }

  draw(timeDelta) {
    for (var systemName in this.systems) {
      this.systems[systemName].drawStart(timeDelta);
    }
    for (var systemName in this.systems) {
      this.systems[systemName].draw(timeDelta);
    }
    for (var systemName in this.systems) {
      this.systems[systemName].drawEnd(timeDelta);
    }
  }

  drawLoop(timestamp) {
    if (!this.lastDrawTime) { this.lastDrawTime = timestamp; }
    var timeDelta = timestamp - this.lastDrawTime;
    this.lastDrawTime = timestamp;

    if (!this.isPaused) {
      this.draw(timeDelta);
    }

    if (this.isRunning) {
      requestAnimationFrame((timestamp) => this.drawLoop(timestamp));
    }
  }

}

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
    var componentManager = getComponent(componentName);
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

  get(componentName, entityId) {
    if (!this.store[componentName]) {
      return {};
    } else if (!entityId) {
      return this.store[componentName];
    } else {
      return this.store[componentName][entityId];
    }
  }

}

export class Component {

  static defaults() {
    return {};
  }

  static create(attrs) {
    return _.extend(this.defaults(), attrs || {}, { manager: this })
  }

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

var componentRegistry = {};

export function registerComponent(componentName, componentManager) {
  componentRegistry[componentName] = componentManager;
}

export function getComponent(componentName) {
  return componentRegistry[componentName];
}

var systemRegistry = {};

export function registerSystem(systemName, system) {
  systemRegistry[systemName] = system;
}

export function getSystem(systemName) {
  return systemRegistry[systemName];
}
