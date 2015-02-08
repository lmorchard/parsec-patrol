import * as Systems from "./systems";
import * as Entities from "./entities"

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

    this.entities = new Entities.EntityManager();

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
      var systemCls = Systems.get(systemName);
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

    this.lastTickTime = Date.now();
    this.tickLoop();

    this.lastDrawTime = 0;
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
