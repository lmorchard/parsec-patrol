require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"core":[function(require,module,exports){
// require("babel/polyfill");
//import assign from "lodash.assign";
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.registerComponent = registerComponent;
exports.getComponent = getComponent;
exports.registerSystem = registerSystem;
exports.getSystem = getSystem;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashDefaults = require("lodash.defaults");

var _lodashDefaults2 = _interopRequireDefault(_lodashDefaults);

var TARGET_FPS = 60;
var TARGET_DURATION = 1000 / TARGET_FPS;

var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (fn) {
  setTimeout(fn, 1000 / 60);
};

// Commonly used temp variables, pre-declared early.
var entityId, system, systemName, systemAttrs, systemCls, componentName, timeNow, timeDelta, component, componentAttrs, matches, idx, item, handler;

var Messages = {
  ENTITY_INSERT: 'entity_insert',
  ENTITY_DESTROY: 'entity_destroy'
};

exports.Messages = Messages;

var World = (function () {
  function World(options) {
    var _this = this;

    _classCallCheck(this, World);

    options = options || {};

    this.isRunning = false;
    this.isPaused = false;
    this.debug = false;

    // TODO: This circular reference thing might be a mistake.
    // TODO: Maybe merge entity manager with world?
    this.entities = new EntityManager(this);

    this.systems = {};
    if (options.systems) {
      this.addSystems(options.systems);
    }

    this.subscribers = {};

    this.tickDuration = TARGET_DURATION;
    this.maxTickDelta = TARGET_DURATION * 5;
    this.tickAccumulator = 0;

    this.lastTickTime = 0;
    this.lastDrawTime = 0;

    this.boundTickLoop = function () {
      return _this.tickLoop();
    };
    this.boundDrawLoop = function (timestamp) {
      return _this.drawLoop(timestamp);
    };
  }

  // TODO: Use a better pubsub library here. But, pubsub-js seemed to perform
  // badly in a game loop.

  _createClass(World, [{
    key: 'subscribe',
    value: function subscribe(msg, handler) {
      if (!this.subscribers[msg]) {
        this.subscribers[msg] = [];
      }
      this.subscribers[msg].push(handler);
      return this;
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(msg, handler) {
      // TODO
      return this;
    }
  }, {
    key: 'publish',
    value: function publish(msg, data) {
      if (!this.subscribers[msg]) {
        return;
      }
      for (idx = 0, handler; handler = this.subscribers[msg][idx]; idx++) {
        handler(msg, data);
      }
      return this;
    }
  }, {
    key: 'addSystems',
    value: function addSystems(systemsData) {
      for (systemName in systemsData) {
        systemAttrs = systemsData[systemName];
        systemCls = getSystem(systemName);
        system = new systemCls(systemAttrs);
        system.setWorld(this);
        this.systems[systemName] = system;
      }
    }
  }, {
    key: 'getSystem',
    value: function getSystem(systemName) {
      return this.systems[systemName];
    }
  }, {
    key: 'start',
    value: function start() {
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;

      for (systemName in this.systems) {
        this.systems[systemName].initialize();
      }

      // Game logic separated from display rendering
      // See also: http://www.chandlerprall.com/2012/06/requestanimationframe-is-not-your-logics-friend/
      this.lastTickTime = Date.now();
      this.lastDrawTime = 0;

      setTimeout(this.boundTickLoop, this.tickDuration);
      requestAnimationFrame(this.boundDrawLoop);

      return this;
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.isRunning = false;
      return this;
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.isPaused = true;
    }
  }, {
    key: 'resume',
    value: function resume() {
      this.isPaused = false;
    }
  }, {
    key: 'tick',
    value: function tick(timeDeltaMS) {
      timeDelta = timeDeltaMS / 1000;
      for (systemName in this.systems) {
        this.systems[systemName].updateStart(timeDelta);
      }
      for (systemName in this.systems) {
        this.systems[systemName].update(timeDelta);
      }
      for (systemName in this.systems) {
        this.systems[systemName].updateEnd(timeDelta);
      }
    }
  }, {
    key: 'tickLoop',
    value: function tickLoop() {
      timeNow = Date.now();
      timeDelta = Math.min(timeNow - this.lastTickTime, this.maxTickDelta);
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
        setTimeout(this.boundTickLoop, this.tickDuration);
      }
    }
  }, {
    key: 'draw',
    value: function draw(timeDeltaMS) {
      timeDelta = timeDeltaMS / 1000;
      for (systemName in this.systems) {
        this.systems[systemName].drawStart(timeDelta);
      }
      for (systemName in this.systems) {
        this.systems[systemName].draw(timeDelta);
      }
      for (systemName in this.systems) {
        this.systems[systemName].drawEnd(timeDelta);
      }
    }
  }, {
    key: 'drawLoop',
    value: function drawLoop(timestamp) {
      if (!this.lastDrawTime) {
        this.lastDrawTime = timestamp;
      }
      timeDelta = timestamp - this.lastDrawTime;
      this.lastDrawTime = timestamp;

      if (!this.isPaused) {
        this.draw(timeDelta);
      }

      if (this.isRunning) {
        requestAnimationFrame(this.boundDrawLoop);
      }
    }
  }]);

  return World;
})();

exports.World = World;

var EntityManager = (function () {
  function EntityManager(world) {
    _classCallCheck(this, EntityManager);

    this.world = world;
    this.reset();
  }

  _createClass(EntityManager, [{
    key: 'reset',
    value: function reset() {
      this.store = {};
      this.lastEntityId = 0;
    }
  }, {
    key: 'generateEntityId',
    value: function generateEntityId() {
      return ++this.lastEntityId;
    }
  }, {
    key: 'insert',
    value: function insert() {
      var out = [];

      for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
        items[_key] = arguments[_key];
      }

      for (idx = 0; item = items[idx]; idx++) {
        entityId = this.generateEntityId();
        for (componentName in item) {
          componentAttrs = item[componentName];
          this.addComponent(entityId, componentName, componentAttrs);
        }
        this.world.publish(Messages.ENTITY_INSERT, entityId);
        out.push(entityId);
      }
      return out.length > 1 ? out : out[0];
    }
  }, {
    key: 'destroy',
    value: function destroy(entityId) {
      this.world.publish(Messages.ENTITY_DESTROY, entityId);
      for (componentName in this.store) {
        this.removeComponent(entityId, componentName);
      }
    }
  }, {
    key: 'addComponent',
    value: function addComponent(entityId, componentName, componentAttrs) {
      var componentManager = getComponent(componentName);
      var component = componentManager.create(componentAttrs);
      if (!this.store[componentName]) {
        this.store[componentName] = {};
      }
      this.store[componentName][entityId] = component;
    }
  }, {
    key: 'removeComponent',
    value: function removeComponent(entityId, componentName) {
      if (entityId in this.store[componentName]) {
        delete this.store[componentName][entityId];
      }
    }
  }, {
    key: 'hasComponent',
    value: function hasComponent(entityId, componentName) {
      return componentName in this.store && entityId in this.store[componentName];
    }
  }, {
    key: 'get',
    value: function get(componentName, entityId) {
      if (!this.store[componentName]) {
        return null;
      } else if (!entityId) {
        return this.store[componentName];
      } else {
        return this.store[componentName][entityId];
      }
    }
  }]);

  return EntityManager;
})();

exports.EntityManager = EntityManager;

var Component = (function () {
  function Component() {
    _classCallCheck(this, Component);
  }

  _createClass(Component, null, [{
    key: 'defaults',
    value: function defaults() {
      return {};
    }
  }, {
    key: 'create',
    value: function create(attrs) {
      return (0, _lodashDefaults2['default'])(attrs || {}, this.defaults());
    }
  }]);

  return Component;
})();

exports.Component = Component;

var System = (function () {
  function System(options) {
    _classCallCheck(this, System);

    this.options = (0, _lodashDefaults2['default'])(options, this.defaultOptions());
    this.debug = this.options.debug || false;
  }

  _createClass(System, [{
    key: 'defaultOptions',
    value: function defaultOptions() {
      return {};
    }
  }, {
    key: 'setWorld',
    value: function setWorld(world) {
      this.world = world;
    }
  }, {
    key: 'matchComponent',
    value: function matchComponent() {
      return '';
    }
  }, {
    key: 'initialize',
    value: function initialize() {}
  }, {
    key: 'getMatchingComponents',
    value: function getMatchingComponents() {
      return this.world.entities.get(this.matchComponent());
    }
  }, {
    key: 'updateStart',
    value: function updateStart(timeDelta) {}
  }, {
    key: 'update',
    value: function update(timeDelta) {
      matches = this.getMatchingComponents();
      for (entityId in matches) {
        this.updateComponent(timeDelta, entityId, matches[entityId]);
      }
    }
  }, {
    key: 'updateComponent',
    value: function updateComponent(timeDelta, entityId, component) {}
  }, {
    key: 'updateEnd',
    value: function updateEnd(timeDelta) {}
  }, {
    key: 'drawStart',
    value: function drawStart(timeDelta) {}
  }, {
    key: 'draw',
    value: function draw(timeDelta) {}
  }, {
    key: 'drawEnd',
    value: function drawEnd(timeDelta) {}
  }]);

  return System;
})();

exports.System = System;

var componentRegistry = {};

function registerComponent(componentName, componentManager) {
  componentRegistry[componentName] = componentManager;
}

function getComponent(componentName) {
  return componentRegistry[componentName];
}

var systemRegistry = {};

function registerSystem(systemName, system) {
  systemRegistry[systemName] = system;
}

function getSystem(systemName) {
  return systemRegistry[systemName];
}

},{"lodash.defaults":"lodash.defaults"}],"plugins/bounce":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/position");

require("plugins/motion");

var _Vector2D = require("Vector2D");

var _Vector2D2 = _interopRequireDefault(_Vector2D);

var BounceComponent = (function (_Core$Component) {
  _inherits(BounceComponent, _Core$Component);

  function BounceComponent() {
    _classCallCheck(this, BounceComponent);

    _get(Object.getPrototypeOf(BounceComponent.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(BounceComponent, null, [{
    key: "defaults",
    value: function defaults() {
      return {
        mass: 1000.0
      };
    }
  }]);

  return BounceComponent;
})(Core.Component);

exports.BounceComponent = BounceComponent;

Core.registerComponent('Bounce', BounceComponent);

var BounceSystem = (function (_Core$System) {
  _inherits(BounceSystem, _Core$System);

  function BounceSystem() {
    _classCallCheck(this, BounceSystem);

    _get(Object.getPrototypeOf(BounceSystem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(BounceSystem, [{
    key: "matchComponent",
    value: function matchComponent() {
      return 'Bounce';
    }
  }, {
    key: "initialize",
    value: function initialize() {
      this.dn = new _Vector2D2["default"]();
      this.dt = new _Vector2D2["default"]();
      this.mt = new _Vector2D2["default"]();
      this.v1 = new _Vector2D2["default"]();
      this.v2 = new _Vector2D2["default"]();
      this.v1n = new _Vector2D2["default"]();
      this.v1t = new _Vector2D2["default"]();
      this.v2n = new _Vector2D2["default"]();
      this.v2t = new _Vector2D2["default"]();
    }
  }, {
    key: "update",
    value: function update(timeDelta) {
      var entities = this.world.entities;
      var matches = this.getMatchingComponents();

      var pairs = {};
      for (var aEntityId in matches) {

        var bounce = matches[aEntityId];
        var aCollidable = entities.get('Collidable', aEntityId);

        for (var bEntityId in aCollidable.inCollisionWith) {
          var pair = [aEntityId, bEntityId];
          pair.sort();
          pairs[pair.join(':')] = pair;
        }

        // TODO: Process world boundary edge bounce?
      }

      for (var key in pairs) {
        var aEntityId = pairs[key][0];
        var aBouncer = entities.get('Bounce', aEntityId);
        if (!aBouncer) {
          continue;
        }

        var bEntityId = pairs[key][1];
        var bBouncer = entities.get('Bounce', bEntityId);
        if (!bBouncer) {
          continue;
        }

        this.resolveElasticCollision(timeDelta, aEntityId, aBouncer, bEntityId, bBouncer);
      }
    }

    // See also:
    // http://en.m.wikipedia.org/wiki/Elastic_collision
    // http://en.m.wikipedia.org/wiki/Dot_product
    // https://github.com/Edifear/volleyball/blob/master/collision.html
    // https://github.com/DominikWidomski/Processing/blob/master/sketch_canvas_red_particles/particles.pde#L47
  }, {
    key: "resolveElasticCollision",
    value: function resolveElasticCollision(timeDelta, aEntityId, aBouncer, bEntityId, bBouncer) {

      var entities = this.world.entities;

      var aPosition = entities.get('Position', aEntityId);
      var aSprite = entities.get('Sprite', aEntityId);
      var aMotion = entities.get('Motion', aEntityId);

      var bPosition = entities.get('Position', bEntityId);
      var bSprite = entities.get('Sprite', bEntityId);
      var bMotion = entities.get('Motion', bEntityId);

      // First, back both entities off to try to prevent sticking
      /*
      aPosition.x -= aMotion.dx * timeDelta;
      aPosition.y -= aMotion.dy * timeDelta;
      bPosition.x -= bMotion.dx * timeDelta;
      bPosition.y -= bMotion.dy * timeDelta;
      var radii, dx, dy;
      while (true) {
        aPosition.x -= aMotion.dx * timeDelta;
        aPosition.y -= aMotion.dy * timeDelta;
        bPosition.x -= bMotion.dx * timeDelta;
        bPosition.y -= bMotion.dy * timeDelta;
         radii = (aSprite.size + bSprite.size) / 2;
        dx = aPosition.x - bPosition.x;
        dy = aPosition.y - bPosition.y;
        if (dx*dx + dy*dy > radii*radii) { break; }
      }
      */

      // Vector between entities
      this.dn.setValues(aPosition.x - bPosition.x, aPosition.y - bPosition.y);

      // Distance between entities
      var delta = this.dn.magnitude();

      // Normal vector of the collision plane
      this.dn.normalize();

      // Tangential vector of the collision plane
      this.dt.setValues(this.dn.y, -this.dn.x);

      // HACK: avoid divide by zero
      if (delta === 0) {
        bPosition.x += 0.01;
      }

      // Get total mass for entities
      var m1 = aBouncer.mass;
      var m2 = bBouncer.mass;
      var M = m1 + m2;

      // Minimum translation vector to push entities apart
      this.mt.setValues(this.dn.x * (aSprite.width + bSprite.width - delta) * 1.1, this.dn.y * (aSprite.height + bSprite.height - delta) * 1.1);

      // Velocity vectors of entities before collision
      this.v1.setValues(aMotion ? aMotion.dx : 0, aMotion ? aMotion.dy : 0);
      this.v2.setValues(bMotion ? bMotion.dx : 0, bMotion ? bMotion.dy : 0);

      // split the velocity vector of the first entity into a normal
      // and a tangential component in respect of the collision plane
      this.v1n.setValues(this.dn.x * this.v1.dot(this.dn), this.dn.y * this.v1.dot(this.dn));
      this.v1t.setValues(this.dt.x * this.v1.dot(this.dt), this.dt.y * this.v1.dot(this.dt));

      // split the velocity vector of the second entity into a normal
      // and a tangential component in respect of the collision plane
      this.v2n.setValues(this.dn.x * this.v2.dot(this.dn), this.dn.y * this.v2.dot(this.dn));
      this.v2t.setValues(this.dt.x * this.v2.dot(this.dt), this.dt.y * this.v2.dot(this.dt));

      // calculate new velocity vectors of the entities, the tangential
      // component stays the same, the normal component changes analog to
      // the 1-Dimensional case

      if (aMotion) {
        var aFactor = (m1 - m2) / M * this.v1n.magnitude() + 2 * m2 / M * this.v2n.magnitude();
        aMotion.dx = this.v1t.x + this.dn.x * aFactor;
        aMotion.dy = this.v1t.y + this.dn.y * aFactor;
        // @processDamage(eid, bEntityId, v_motion, bouncer, m1)
      }

      if (bMotion) {
        var bFactor = (m2 - m1) / M * this.v2n.magnitude() + 2 * m1 / M * this.v1n.magnitude();
        bMotion.dx = this.v2t.x - this.dn.x * bFactor;
        bMotion.dy = this.v2t.y - this.dn.y * bFactor;
        // @processDamage(eid, bEntityId, v_bMotion, c_bouncer, m2)
      }
    }
  }]);

  return BounceSystem;
})(Core.System);

exports.BounceSystem = BounceSystem;

Core.registerSystem('Bounce', BounceSystem);

},{"Vector2D":"Vector2D","core":"core","plugins/motion":"plugins/motion","plugins/position":"plugins/position"}],"plugins/canvasViewport":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.registerSprite = registerSprite;
exports.getSprite = getSprite;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

var _lodashDefaults = require("lodash.defaults");

var _lodashDefaults2 = _interopRequireDefault(_lodashDefaults);

var CanvasSprite = (function (_Core$Component) {
  _inherits(CanvasSprite, _Core$Component);

  function CanvasSprite() {
    _classCallCheck(this, CanvasSprite);

    _get(Object.getPrototypeOf(CanvasSprite.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(CanvasSprite, null, [{
    key: "defaults",
    value: function defaults() {
      return {
        name: null,
        color: '#fff',
        size: 100,
        width: null,
        height: null
      };
    }
  }, {
    key: "create",
    value: function create(attrs) {
      var c = _get(Object.getPrototypeOf(CanvasSprite), "create", this).call(this, attrs);
      if (!c.width) {
        c.width = c.size;
      }
      if (!c.height) {
        c.height = c.size;
      }
      return c;
    }
  }]);

  return CanvasSprite;
})(Core.Component);

exports.CanvasSprite = CanvasSprite;

Core.registerComponent('Sprite', CanvasSprite);

// See also: http://phrogz.net/JS/wheeldelta.html
var wheelDistance = function wheelDistance(evt) {
  if (!evt) evt = event;
  var w = evt.wheelDelta,
      d = evt.detail;
  if (d) {
    if (w) return w / d / 40 * d > 0 ? 1 : -1; // Opera
    else return -d / 3; // Firefox;         TODO: do not /3 for OS X
  } else return w / 120; // IE/Safari/Chrome TODO: /3 for Chrome OS X
};

var CanvasViewport = (function (_Core$System) {
  _inherits(CanvasViewport, _Core$System);

  function CanvasViewport() {
    _classCallCheck(this, CanvasViewport);

    _get(Object.getPrototypeOf(CanvasViewport.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(CanvasViewport, [{
    key: "defaultOptions",
    value: function defaultOptions() {
      return {
        lineWidth: 1.5,
        zoom: 1.0,
        zoomMin: 0.1,
        zoomMax: 10.0,
        zoomWheelFactor: 0.025,
        gridEnabled: true,
        gridSize: 500,
        gridColor: "#111",
        followEnabled: true,
        followName: null,
        followEntityId: null
      };
    }
  }, {
    key: "initialize",
    value: function initialize() {
      var _this = this;

      this.container = document.querySelector(this.options.container);
      this.canvas = document.querySelector(this.options.canvas);
      this.ctx = this.canvas.getContext('2d');

      var events = {
        'resize': function resize(ev) {
          _this.updateMetrics(ev);
        },
        'orientationchange': function orientationchange(ev) {
          _this.updateMetrics(ev);
        },
        'mousedown': function mousedown(ev) {
          _this.onMouseDown(ev);
        },
        'mousemove': function mousemove(ev) {
          _this.onMouseMove(ev);
        },
        'mouseup': function mouseup(ev) {
          _this.onMouseUp(ev);
        }
      };

      //'wheel': (ev) => { this.onMouseWheel(ev); }
      for (var name in events) {
        this.canvas.addEventListener(name, events[name], false);
      }

      // See also: http://phrogz.net/JS/wheeldelta.html
      var boundOnMouseWheel = function boundOnMouseWheel(ev) {
        return _this.onMouseWheel(ev);
      };
      if (window.addEventListener) {
        window.addEventListener('mousewheel', boundOnMouseWheel, false); // Chrome/Safari/Opera
        window.addEventListener('DOMMouseScroll', boundOnMouseWheel, false); // Firefox
      } else if (window.attachEvent) {
          window.attachEvent('onmousewheel', boundOnMouseWheel); // IE
        }

      this.followEnabled = this.options.followEnabled;
      this.zoom = this.options.zoom;
      this.followEntityId = this.options.followEntityId;
      this.gridEnabled = this.options.gridEnabled;
      this.lineWidth = this.options.lineWidth;

      this.cursorRawX = 0;
      this.cursorRawY = 0;

      this.cursorChanged = false;
      this.cursorPosition = { x: 0, y: 0 };

      this.cameraX = 0;
      this.cameraY = 0;

      this.debugDummySprite = { size: 100 };
    }
  }, {
    key: "draw",
    value: function draw(timeDelta) {
      this.updateMetrics();
      this.ctx.save();

      this.clear();
      this.centerAndZoom(timeDelta);
      this.followEntity(timeDelta);

      if (this.gridEnabled) {
        this.drawBackdrop(timeDelta);
      }

      this.drawScene(timeDelta);

      if (this.world.debug) {
        this.drawDebugCursor();
      }

      this.ctx.restore();
    }
  }, {
    key: "onMouseWheel",
    value: function onMouseWheel(ev) {
      this.zoom += wheelDistance(ev) * this.options.zoomWheelFactor;
      if (this.zoom < this.options.zoomMin) {
        this.zoom = this.options.zoomMin;
      }
      if (this.zoom > this.options.zoomMax) {
        this.zoom = this.options.zoomMax;
      }
    }

    // TODO: Use a symbol for 'mouse{Down,Move,Up}' message?

  }, {
    key: "onMouseDown",
    value: function onMouseDown(ev) {
      this.setCursor(ev.clientX, ev.clientY);
      this.world.publish('mouseDown', this.cursorPosition);
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(ev) {
      this.setCursor(ev.clientX, ev.clientY);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp(ev) {
      this.setCursor(ev.clientX, ev.clientY);
      this.world.publish('mouseUp', this.cursorPosition);
    }
  }, {
    key: "update",
    value: function update(timeDelta) {
      // Use the cursorChanged flag set by setCursor to limit mouseMove messages
      // to one per game loop tick
      if (this.cursorChanged) {
        this.cursorChanged = false;
        this.world.publish('mouseMove', this.cursorPosition);
      }
    }
  }, {
    key: "setCursor",
    value: function setCursor(x, y) {
      var width = this.container.offsetWidth;
      var height = this.container.offsetHeight;

      this.cursorRawX = x;
      this.cursorRawY = y;

      var newX = (x - width / 2) / this.zoom + this.cameraX;
      var newY = (y - height / 2) / this.zoom + this.cameraY;

      if (newX !== this.cursorPosition.x || newY !== this.cursorPosition.y) {
        this.cursorChanged = true;
        this.cursorPosition.x = newX;
        this.cursorPosition.y = newY;
      }
    }
  }, {
    key: "updateMetrics",
    value: function updateMetrics() {
      var width = this.container.offsetWidth;
      var height = this.container.offsetHeight;

      this.canvas.width = width;
      this.canvas.height = height;

      this.visibleWidth = width / this.zoom;
      this.visibleHeight = height / this.zoom;

      this.visibleLeft = 0 - this.visibleWidth / 2 + this.cameraX;
      this.visibleTop = 0 - this.visibleHeight / 2 + this.cameraY;
      this.visibleRight = this.visibleLeft + this.visibleWidth;
      this.visibleBottom = this.visibleTop + this.visibleHeight;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "centerAndZoom",
    value: function centerAndZoom() {
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(this.zoom, this.zoom);
    }
  }, {
    key: "followEntity",
    value: function followEntity() {
      if (!this.followEnabled) {
        this.cameraX = this.cameraY = 0;
        return;
      }
      if (this.options.followName && !this.followEntityId) {
        // Look up named entity, if necessary.
        this.followEntityId = Core.getComponent('Name').findEntityByName(this.world, this.options.followName);
      }
      if (this.followEntityId) {
        // Adjust the viewport center offset to the entity position
        var position = this.world.entities.get('Position', this.followEntityId);
        if (position) {
          this.cameraX = position.x;
          this.cameraY = position.y;
          this.setCursor(this.cursorRawX, this.cursorRawY);
          this.ctx.translate(0 - this.cameraX, 0 - this.cameraY);
        }
      }
    }
  }, {
    key: "drawDebugCursor",
    value: function drawDebugCursor() {
      var ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = '#f0f';
      ctx.lineWidth = this.lineWidth / this.zoom;
      ctx.translate(this.cursorPosition.x, this.cursorPosition.y);
      ctx.beginPath();
      ctx.moveTo(-20, 0);
      ctx.lineTo(20, 0);
      ctx.moveTo(0, -20);
      ctx.lineTo(0, 20);
      ctx.strokeRect(-10, -10, 20, 20);
      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: "drawBackdrop",
    value: function drawBackdrop() {
      var gridSize = this.options.gridSize;
      var gridOffsetX = this.visibleLeft % gridSize;
      var gridOffsetY = this.visibleTop % gridSize;

      var ctx = this.ctx;

      ctx.save();
      ctx.beginPath();

      ctx.strokeStyle = this.options.gridColor;
      ctx.lineWidth = this.lineWidth / this.zoom;

      for (var x = this.visibleLeft - gridOffsetX; x < this.visibleRight; x += gridSize) {
        ctx.moveTo(x, this.visibleTop);
        ctx.lineTo(x, this.visibleBottom);
      }

      for (var y = this.visibleTop - gridOffsetY; y < this.visibleBottom; y += gridSize) {
        ctx.moveTo(this.visibleLeft, y);
        ctx.lineTo(this.visibleRight, y);
      }

      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: "drawScene",
    value: function drawScene(timeDelta) {
      var positions = this.world.entities.get('Position');
      for (var entityId in positions) {
        this.drawSprite(timeDelta, entityId, positions[entityId]);
      }
    }
  }, {
    key: "drawSprite",
    value: function drawSprite(timeDelta, entityId, position) {

      var sprite = this.world.entities.get('Sprite', entityId);
      if (!sprite) {
        sprite = CanvasSprite.defaults();
      }

      var spriteFn = getSprite(sprite.name);
      if (!spriteFn) {
        spriteFn = getSprite('default');
      }

      var ctx = this.ctx;

      ctx.save();

      ctx.translate(position.x, position.y);

      ctx.rotate(position.rotation + Math.PI / 2);
      ctx.scale(sprite.size / 100, sprite.size / 100);

      // HACK: Try to keep line width consistent regardless of zoom, to sort of
      // simulate a vector display
      ctx.lineWidth = this.lineWidth / this.zoom / (sprite.size / 100);

      ctx.strokeStyle = sprite.color;
      spriteFn(ctx, timeDelta, sprite, entityId);

      ctx.restore();
    }
  }]);

  return CanvasViewport;
})(Core.System);

exports.CanvasViewport = CanvasViewport;

Core.registerSystem('CanvasViewport', CanvasViewport);

var spriteRegistry = {};

function registerSprite(name, sprite) {
  spriteRegistry[name] = sprite;
}

function getSprite(name) {
  return spriteRegistry[name];
}

registerSprite('default', function (ctx, timeDelta, sprite, entityId) {
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2, true);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -50);
  ctx.moveTo(0, 0);
  ctx.stroke();
});

registerSprite('sun', function (ctx, timeDelta, sprite, entityId) {
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2, true);
  ctx.stroke();
});

registerSprite('enemyscout', function (ctx, timeDelta, sprite, entityId) {
  ctx.beginPath();
  ctx.moveTo(0, -50);
  ctx.lineTo(-45, 50);
  ctx.lineTo(-12.5, 12.5);
  ctx.lineTo(0, 25);
  ctx.lineTo(12.5, 12.5);
  ctx.lineTo(45, 50);
  ctx.lineTo(0, -50);
  ctx.moveTo(0, -50);
  ctx.stroke();
});

registerSprite('hero', function (ctx, timeDelta, sprite, entityId) {
  ctx.rotate(Math.PI);
  ctx.beginPath();
  ctx.moveTo(-12.5, -50);
  ctx.lineTo(-25, -50);
  ctx.lineTo(-50, 0);
  ctx.arc(0, 0, 50, Math.PI, 0, true);
  ctx.lineTo(25, -50);
  ctx.lineTo(12.5, -50);
  ctx.lineTo(25, 0);
  ctx.arc(0, 0, 25, 0, Math.PI, true);
  ctx.lineTo(-12.5, -50);
  ctx.stroke();
});

registerSprite('asteroid', function (ctx, timeDelta, sprite, entityId) {

  if (!sprite.points) {
    var NUM_POINTS = 7 + Math.floor(8 * Math.random());
    var MAX_RADIUS = 50;
    var MIN_RADIUS = 35;
    var ROTATION = Math.PI * 2 / NUM_POINTS;

    sprite.points = [];
    for (var idx = 0; idx < NUM_POINTS; idx++) {
      var rot = idx * ROTATION;
      var dist = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
      sprite.points.push([dist * Math.cos(rot), dist * Math.sin(rot)]);
    }
  }

  ctx.beginPath();
  ctx.moveTo(sprite.points[0][0], sprite.points[0][1]);
  for (var idx = 0; idx < sprite.points.length; idx++) {
    ctx.lineTo(sprite.points[idx][0], sprite.points[idx][1]);
  }
  ctx.lineTo(sprite.points[0][0], sprite.points[0][1]);
  ctx.stroke();
});

registerSprite('explosion', function (ctx, timeDelta, sprite, entityId) {
  var p, angle, dist, cos, sin, idx, alpha;

  if (!sprite.initialized) {

    sprite.initialized = true;

    (0, _lodashDefaults2["default"])(sprite, {
      ttl: 2.0,
      radius: 100,
      maxParticles: 25,
      maxParticleSize: 4,
      maxVelocity: 300,
      color: '#f00',
      age: 0,
      stop: false
    });

    sprite.particles = [];

    for (idx = 0; idx < sprite.maxParticles; idx++) {
      sprite.particles.push({ free: true });
    }
  }

  for (idx = 0; idx < sprite.particles.length; idx++) {
    p = sprite.particles[idx];

    if (!sprite.stop && p.free) {

      p.velocity = sprite.maxVelocity * Math.random();
      p.angle = Math.PI * 2 * Math.random();
      p.dx = 0 - p.velocity * Math.sin(p.angle);
      p.dy = p.velocity * Math.cos(p.angle);
      p.distance = p.x = p.y = 0;
      p.maxDistance = sprite.radius * Math.random();
      p.size = sprite.maxParticleSize;
      p.free = false;
    } else if (!p.free) {

      p.x += p.dx * timeDelta;
      p.y += p.dy * timeDelta;

      p.distance += p.velocity * timeDelta;
      if (p.distance >= p.maxDistance) {
        p.distance = p.maxDistance;
        p.free = true;
      }
    }
  }

  sprite.age += timeDelta;

  if (sprite.age >= sprite.ttl) {
    sprite.stop = true;
  }

  alpha = Math.max(0, 1 - sprite.age / sprite.ttl);

  ctx.save();
  ctx.strokeStyle = sprite.color;
  ctx.fillStyle = sprite.color;

  for (idx = 0; idx < sprite.particles.length; idx++) {
    p = sprite.particles[idx];
    if (p.free) {
      continue;
    }

    ctx.globalAlpha = (1 - p.distance / p.maxDistance) * alpha;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineWidth = p.size;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  ctx.restore();
});

},{"core":"core","lodash.defaults":"lodash.defaults"}],"plugins/clickCourse":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

var ClickCourse = (function (_Core$Component) {
  _inherits(ClickCourse, _Core$Component);

  function ClickCourse() {
    _classCallCheck(this, ClickCourse);

    _get(Object.getPrototypeOf(ClickCourse.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ClickCourse, null, [{
    key: 'defaults',
    value: function defaults() {
      return { x: 0, y: 0, stopOnArrival: false, active: true };
    }
  }]);

  return ClickCourse;
})(Core.Component);

exports.ClickCourse = ClickCourse;

Core.registerComponent('ClickCourse', ClickCourse);

var ClickCourseSystem = (function (_Core$System) {
  _inherits(ClickCourseSystem, _Core$System);

  function ClickCourseSystem() {
    _classCallCheck(this, ClickCourseSystem);

    _get(Object.getPrototypeOf(ClickCourseSystem.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ClickCourseSystem, [{
    key: 'matchComponent',
    value: function matchComponent() {
      return 'ClickCourse';
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      this.trackingCursor = false;
      this.world.subscribe('mouseDown', function (msg, cursorPosition) {
        _this.trackingCursor = true;
      }).subscribe('mouseUp', function (msg, cursorPosition) {
        _this.trackingCursor = false;
        _this.setCourse(cursorPosition);
      }).subscribe('mouseMove', function (msg, cursorPosition) {
        if (_this.trackingCursor) {
          _this.setCourse(cursorPosition);
        }
      });
    }
  }, {
    key: 'setCourse',
    value: function setCourse(cursorPosition) {
      var clickCourses = this.world.entities.get('ClickCourse');
      for (var entityId in clickCourses) {
        var clickCourse = clickCourses[entityId];
        clickCourse.active = true;
        clickCourse.x = cursorPosition.x;
        clickCourse.y = cursorPosition.y;
      }
    }
  }, {
    key: 'updateComponent',
    value: function updateComponent(timeDelta, entityId, clickCourse) {

      var entities = this.world.entities;
      var position = entities.get('Position', entityId);
      var seeker = entities.get('Seeker', entityId);
      var thruster = entities.get('Thruster', entityId);
      var sprite = entities.get('Sprite', entityId);

      if (clickCourse.active) {
        thruster.active = true;
        thruster.stop = false;
        seeker.targetPosition = { x: clickCourse.x, y: clickCourse.y };
      }

      var xOffset = Math.abs(position.x - clickCourse.x);
      var yOffset = Math.abs(position.y - clickCourse.y);
      if (xOffset < sprite.size && yOffset < sprite.size) {
        if (clickCourse.stopOnArrival) {
          thruster.stop = true;
        }
      }
    }
  }]);

  return ClickCourseSystem;
})(Core.System);

exports.ClickCourseSystem = ClickCourseSystem;

Core.registerSystem('ClickCourse', ClickCourseSystem);

},{"core":"core"}],"plugins/collision":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

var _QuadTree = require("QuadTree");

var _QuadTree2 = _interopRequireDefault(_QuadTree);

var Collidable = (function (_Core$Component) {
  _inherits(Collidable, _Core$Component);

  function Collidable() {
    _classCallCheck(this, Collidable);

    _get(Object.getPrototypeOf(Collidable.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Collidable, null, [{
    key: "defaults",
    value: function defaults() {
      return {
        inCollision: false,
        inCollisionWith: {}
      };
    }
  }]);

  return Collidable;
})(Core.Component);

exports.Collidable = Collidable;

Core.registerComponent('Collidable', Collidable);

var idx, entityId, matches, sprite, position;

var CollisionSystem = (function (_Core$System) {
  _inherits(CollisionSystem, _Core$System);

  function CollisionSystem() {
    _classCallCheck(this, CollisionSystem);

    _get(Object.getPrototypeOf(CollisionSystem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(CollisionSystem, [{
    key: "defaultOptions",
    value: function defaultOptions() {
      return {
        width: 10000,
        height: 10000,
        quadtreeMaxAge: 5,
        quadtreeObjectsPerNode: 10,
        quadtreeMaxLevels: 5
      };
    }
  }, {
    key: "matchComponent",
    value: function matchComponent() {
      return 'Collidable';
    }
  }, {
    key: "initialize",
    value: function initialize() {
      var _this = this;

      this.width = this.options.width;
      this.height = this.options.height;

      this.quadtree = new _QuadTree2["default"](0 - this.width / 2, 0 - this.height / 2, this.width, this.height, this.options.quadtreeObjectsPerNode, this.options.quadtreeMaxLevels);

      this.retrieveBounds = {};
      this.quadtreeAge = 0;

      this.checkCollisionBound = function (neighbor, component) {
        return _this.checkCollision(neighbor, component);
      };
    }
  }, {
    key: "update",
    value: function update(timeDelta) {

      this.quadtree.clear();

      /*
      // HACK: Track age of quadtree, clear it completely after an interval.
      // This is because the insert logic will move entities, but it will not
      // collapse subtrees when they are empty
      this.quadtreeAge += timeDelta;
      if (this.quadtreeAge >= this.options.quadtreeMaxAge) {
        this.quadtreeMaxAge = 0;
        this.quadtree.clear();
      }
      */

      matches = this.getMatchingComponents();
      // First, update the collidables and then the quadtree
      for (entityId in matches) {
        this.updateQuadtreeWithComponent(entityId, matches[entityId]);
      }
      // Second, process collidables for collisions with quadtree neighbors
      for (entityId in matches) {
        this.updateComponent(timeDelta, entityId, matches[entityId]);
      }
    }
  }, {
    key: "updateQuadtreeWithComponent",
    value: function updateQuadtreeWithComponent(entityId, collidable) {
      sprite = this.world.entities.get('Sprite', entityId);
      position = this.world.entities.get('Position', entityId);
      if (!sprite || !position) {
        return;
      }

      // This update is ugly, but is an attempt not to spawn temp objects.
      collidable.entityId = entityId;
      collidable.x = position.x - sprite.width / 2;
      collidable.y = position.y - sprite.height / 2;
      collidable.width = sprite.width;
      collidable.height = sprite.height;
      collidable.right = collidable.x + collidable.width;
      collidable.bottom = collidable.y + collidable.height;
      collidable.position = position;
      collidable.sprite = sprite;
      collidable.inCollision = false;

      // TODO: Is there a better way to empty out an object than replacing it?
      collidable.inCollisionWith = {};

      this.quadtree.insert(collidable);
    }
  }, {
    key: "updateComponent",
    value: function updateComponent(timeDelta, entityId, component) {
      sprite = this.world.entities.get('Sprite', entityId);
      position = this.world.entities.get('Position', entityId);
      if (!sprite || !position) {
        return;
      }

      this.retrieveBounds.x = position.x;
      this.retrieveBounds.y = position.y;
      this.retrieveBounds.right = position.x + sprite.width;
      this.retrieveBounds.bottom = position.y + sprite.height;

      this.quadtree.iterate(this.retrieveBounds, this.checkCollisionBound, component);
    }
  }, {
    key: "checkCollision",
    value: function checkCollision(bCollidable, aCollidable) {

      if (aCollidable.entityId === bCollidable.entityId) {
        return;
      }

      var dx = aCollidable.position.x - bCollidable.position.x;
      var dy = aCollidable.position.y - bCollidable.position.y;

      /*
      // Check horizontal proximity
      if (Math.abs(dx) * 2 > (aCollidable.sprite.width + bCollidable.sprite.width)) { return; }
       // Check vertical proximity
      if (Math.abs(dy) * 2 > (aCollidable.sprite.height + bCollidable.sprite.height)) { return; }
      */
      // TODO: Pluggable shape intersection detection here?

      // Check collision circle via distance
      var radii = (aCollidable.sprite.size + bCollidable.sprite.size) / 2;
      if (dx * dx + dy * dy > radii * radii) {
        return;
      }

      aCollidable.inCollision = true;
      aCollidable.inCollisionWith[bCollidable.entityId] = 1;

      bCollidable.inCollision = true;
      bCollidable.inCollisionWith[aCollidable.entityId] = 1;
    }
  }, {
    key: "draw",
    value: function draw(timeDelta) {
      if (!this.debug) {
        return;
      }

      var vpSystem = this.world.getSystem('CanvasViewport');

      var ctx = vpSystem.ctx;
      ctx.save();

      vpSystem.centerAndZoom(timeDelta);
      vpSystem.followEntity(timeDelta);

      this.drawDebugQuadtree(timeDelta, ctx);
      this.drawDebugInCollision(timeDelta, ctx);

      ctx.restore();
    }
  }, {
    key: "drawDebugQuadtree",
    value: function drawDebugQuadtree(timeDelta, ctx) {
      ctx.save();
      ctx.strokeStyle = "#707";
      this.drawDebugQuadtreeNode(ctx, this.quadtree);
      ctx.restore();
    }
  }, {
    key: "drawDebugQuadtreeNode",
    value: function drawDebugQuadtreeNode(ctx, root) {
      if (!root) {
        return;
      }
      ctx.strokeRect(root.bounds.x, root.bounds.y, root.bounds.width, root.bounds.height);
      this.drawDebugQuadtreeNode(ctx, root.nodes[0]);
      this.drawDebugQuadtreeNode(ctx, root.nodes[1]);
      this.drawDebugQuadtreeNode(ctx, root.nodes[2]);
      this.drawDebugQuadtreeNode(ctx, root.nodes[3]);
    }
  }, {
    key: "drawDebugInCollision",
    value: function drawDebugInCollision(timeDelta, ctx) {
      ctx.strokeStyle = "#440";
      var matches = this.getMatchingComponents();

      for (var entityId in matches) {

        var collidable = matches[entityId];
        var position = this.world.entities.get('Position', entityId);
        var sprite = this.world.entities.get('Sprite', entityId);

        if (collidable.inCollision) {
          var diameter = Math.max(sprite.width, sprite.height);
          ctx.beginPath();
          ctx.arc(position.x, position.y, 1 + diameter / 2, 0, Math.PI * 2, true);
          ctx.stroke();
        }
      }
    }
  }]);

  return CollisionSystem;
})(Core.System);

exports.CollisionSystem = CollisionSystem;

Core.registerSystem('Collision', CollisionSystem);

},{"QuadTree":"QuadTree","core":"core"}],"plugins/expiration":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

var Expiration = (function (_Core$Component) {
  _inherits(Expiration, _Core$Component);

  function Expiration() {
    _classCallCheck(this, Expiration);

    _get(Object.getPrototypeOf(Expiration.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Expiration, null, [{
    key: 'defaults',
    value: function defaults() {
      return { ttl: 0, age: 0 };
    }
  }]);

  return Expiration;
})(Core.Component);

exports.Expiration = Expiration;

Core.registerComponent('Expiration', Expiration);

var ExpirationSystem = (function (_Core$System) {
  _inherits(ExpirationSystem, _Core$System);

  function ExpirationSystem() {
    _classCallCheck(this, ExpirationSystem);

    _get(Object.getPrototypeOf(ExpirationSystem.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ExpirationSystem, [{
    key: 'matchComponent',
    value: function matchComponent() {
      return 'Expiration';
    }
  }, {
    key: 'updateComponent',
    value: function updateComponent(timeDelta, entityId, expiration) {
      expiration.age += timeDelta;
      if (expiration.age >= expiration.ttl) {
        this.world.entities.destroy(entityId);
      }
    }
  }]);

  return ExpirationSystem;
})(Core.System);

exports.ExpirationSystem = ExpirationSystem;

Core.registerSystem('Expiration', ExpirationSystem);

},{"core":"core"}],"plugins/health":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

var Health = (function (_Core$Component) {
  _inherits(Health, _Core$Component);

  function Health() {
    _classCallCheck(this, Health);

    _get(Object.getPrototypeOf(Health.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Health, null, [{
    key: "defaults",
    value: function defaults() {
      return { max: 1000, current: null, show_bar: true };
    }
  }, {
    key: "create",
    value: function create(attrs) {
      var c = _get(Object.getPrototypeOf(Health), "create", this).call(this, attrs);
      c.current = c.max;
      return c;
    }
  }]);

  return Health;
})(Core.Component);

exports.Health = Health;

Core.registerComponent('Health', Health);

},{"core":"core"}],"plugins/motion":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/position");

var Motion = (function (_Core$Component) {
  _inherits(Motion, _Core$Component);

  function Motion() {
    _classCallCheck(this, Motion);

    _get(Object.getPrototypeOf(Motion.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Motion, null, [{
    key: "defaults",
    value: function defaults() {
      return { dx: 0, dy: 0, drotation: 0 };
    }
  }]);

  return Motion;
})(Core.Component);

exports.Motion = Motion;

Core.registerComponent('Motion', Motion);

var MotionSystem = (function (_Core$System) {
  _inherits(MotionSystem, _Core$System);

  function MotionSystem() {
    _classCallCheck(this, MotionSystem);

    _get(Object.getPrototypeOf(MotionSystem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(MotionSystem, [{
    key: "matchComponent",
    value: function matchComponent() {
      return 'Motion';
    }
  }, {
    key: "updateComponent",
    value: function updateComponent(timeDelta, entityId, motion) {
      var pos = this.world.entities.get('Position', entityId);
      pos.x += motion.dx * timeDelta;
      pos.y += motion.dy * timeDelta;

      // Update the rotation, ensuring a 0..2*Math.PI range.
      var PI2 = Math.PI * 2;
      pos.rotation = (pos.rotation + motion.drotation * timeDelta) % PI2;
      if (pos.rotation < 0) {
        pos.rotation += PI2;
      }
    }
  }]);

  return MotionSystem;
})(Core.System);

exports.MotionSystem = MotionSystem;

Core.registerSystem('Motion', MotionSystem);

},{"core":"core","plugins/position":"plugins/position"}],"plugins/name":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

var Name = (function (_Core$Component) {
  _inherits(Name, _Core$Component);

  function Name() {
    _classCallCheck(this, Name);

    _get(Object.getPrototypeOf(Name.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Name, null, [{
    key: "defaults",
    value: function defaults() {
      return { name: "unnamed" };
    }
  }, {
    key: "findEntityByName",
    value: function findEntityByName(world, name) {
      var names = world.entities.get('Name');
      for (var nid in names) {
        var nameComponent = names[nid];
        if (nameComponent.name == name) {
          return nid;
        }
      }
    }
  }]);

  return Name;
})(Core.Component);

exports.Name = Name;

Core.registerComponent('Name', Name);

},{"core":"core"}],"plugins/orbiter":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/position");

var _Vector2D = require("Vector2D");

var _Vector2D2 = _interopRequireDefault(_Vector2D);

var Orbiter = (function (_Core$Component) {
  _inherits(Orbiter, _Core$Component);

  function Orbiter() {
    _classCallCheck(this, Orbiter);

    _get(Object.getPrototypeOf(Orbiter.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Orbiter, null, [{
    key: "defaults",
    value: function defaults() {
      return {
        name: null,
        entityId: null,
        angle: 0.0,
        rotate: true,
        radPerSec: Math.PI / 4
      };
    }
  }]);

  return Orbiter;
})(Core.Component);

exports.Orbiter = Orbiter;

Core.registerComponent('Orbiter', Orbiter);

var OrbiterSystem = (function (_Core$System) {
  _inherits(OrbiterSystem, _Core$System);

  function OrbiterSystem() {
    _classCallCheck(this, OrbiterSystem);

    _get(Object.getPrototypeOf(OrbiterSystem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(OrbiterSystem, [{
    key: "matchComponent",
    value: function matchComponent() {
      return 'Orbiter';
    }
  }, {
    key: "initialize",
    value: function initialize() {
      this.vOrbited = new _Vector2D2["default"]();
      this.vOrbiter = new _Vector2D2["default"]();
      this.vOld = new _Vector2D2["default"]();
    }
  }, {
    key: "updateComponent",
    value: function updateComponent(timeDelta, entityId, orbiter) {

      // Look up the orbited entity ID, if only name given.
      if (orbiter.name && !orbiter.entityId) {
        orbiter.entityId = Core.getComponent('Name').findEntityByName(this.world, orbiter.name);
      }

      var pos = this.world.entities.get('Position', entityId);
      var oPos = this.world.entities.get('Position', orbiter.entityId);

      this.vOrbited.setValues(oPos.x, oPos.y);
      this.vOrbiter.setValues(pos.x, pos.y);

      var angleDelta = timeDelta * orbiter.radPerSec;
      this.vOrbiter.rotateAround(this.vOrbited, angleDelta);

      this.vOld.setValues(pos.x, pos.y);
      pos.x = this.vOrbiter.x;
      pos.y = this.vOrbiter.y;
      if (orbiter.rotate) {
        pos.rotation = this.vOld.angleTo(this.vOrbiter);
      }
    }
  }]);

  return OrbiterSystem;
})(Core.System);

exports.OrbiterSystem = OrbiterSystem;

Core.registerSystem('Orbiter', OrbiterSystem);

},{"Vector2D":"Vector2D","core":"core","plugins/position":"plugins/position"}],"plugins/position":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

var Position = (function (_Core$Component) {
  _inherits(Position, _Core$Component);

  function Position() {
    _classCallCheck(this, Position);

    _get(Object.getPrototypeOf(Position.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Position, null, [{
    key: "defaults",
    value: function defaults() {
      return { x: 0, y: 0, rotation: 0 };
    }
  }]);

  return Position;
})(Core.Component);

exports.Position = Position;

Core.registerComponent('Position', Position);

},{"core":"core"}],"plugins/seeker":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/position");

require("plugins/motion");

var _Vector2D = require("Vector2D");

var _Vector2D2 = _interopRequireDefault(_Vector2D);

var Seeker = (function (_Core$Component) {
  _inherits(Seeker, _Core$Component);

  function Seeker() {
    _classCallCheck(this, Seeker);

    _get(Object.getPrototypeOf(Seeker.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Seeker, null, [{
    key: "defaults",
    value: function defaults() {
      return {
        targetName: null,
        targetEntityId: null,
        targetPosition: null,
        acquisitionDelay: 0,
        radPerSec: Math.PI
      };
    }
  }]);

  return Seeker;
})(Core.Component);

exports.Seeker = Seeker;

Core.registerComponent('Seeker', Seeker);

var SeekerSystem = (function (_Core$System) {
  _inherits(SeekerSystem, _Core$System);

  function SeekerSystem() {
    _classCallCheck(this, SeekerSystem);

    _get(Object.getPrototypeOf(SeekerSystem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(SeekerSystem, [{
    key: "matchComponent",
    value: function matchComponent() {
      return 'Seeker';
    }
  }, {
    key: "initialize",
    value: function initialize() {
      this.vSeeker = new _Vector2D2["default"]();
      this.vTarget = new _Vector2D2["default"]();
    }
  }, {
    key: "updateComponent",
    value: function updateComponent(timeDelta, entityId, seeker) {

      // Look up the orbited entity ID, if only name given.
      if (seeker.targetName && !seeker.targetEntityId) {
        seeker.targetEntityId = Core.getComponent('Name').findEntityByName(this.world, seeker.targetName);
      }

      // Process a delay before the seeker "acquires" the target and
      // starts steering. Makes missiles look interesting.
      if (seeker.acquisitionDelay > 0) {
        seeker.acquisitionDelay -= timeDelta;
        return;
      }

      var position = this.world.entities.get('Position', entityId);
      var motion = this.world.entities.get('Motion', entityId);
      if (!position || !motion) {
        return;
      }

      // Accept either a raw x/y coord or entity ID as target
      var targetPosition = seeker.targetPosition;
      if (!targetPosition) {
        targetPosition = this.world.entities.get('Position', seeker.targetEntityId);
      }
      if (!targetPosition || !(targetPosition.x && targetPosition.y)) {
        return;
      }

      // Set up the vectors for angle math...
      this.vSeeker.setValues(position.x, position.y);
      this.vTarget.setValues(targetPosition.x, targetPosition.y);

      // Get the target angle, ensuring a 0..2*Math.PI range.
      var targetAngle = this.vSeeker.angleTo(this.vTarget);
      if (targetAngle < 0) {
        targetAngle += 2 * Math.PI;
      }

      // Pick the direction from current to target angle
      var direction = targetAngle < position.rotation ? -1 : 1;

      // If the offset between the angles is more than half a circle, go
      // the other way because it'll be shorter.
      var offset = Math.abs(targetAngle - position.rotation);
      if (offset > Math.PI) {
        direction = 0 - direction;
      }

      // Work out the desired delta-rotation to steer toward target
      var targetDr = direction * Math.min(seeker.radPerSec, offset / timeDelta);

      // Calculate the delta-rotation impulse required to meet the goal,
      // but constrain to the capability of the steering thrusters
      var impulseDr = targetDr - motion.drotation;
      if (Math.abs(impulseDr) > seeker.radPerSec) {
        if (impulseDr > 0) {
          impulseDr = seeker.radPerSec;
        } else if (impulseDr < 0) {
          impulseDr = 0 - seeker.radPerSec;
        }
      }
      motion.drotation += impulseDr;
    }
  }]);

  return SeekerSystem;
})(Core.System);

exports.SeekerSystem = SeekerSystem;

Core.registerSystem('Seeker', SeekerSystem);

},{"Vector2D":"Vector2D","core":"core","plugins/motion":"plugins/motion","plugins/position":"plugins/position"}],"plugins/steering":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/position");

require("plugins/motion");

var _Vector2D = require("Vector2D");

var _Vector2D2 = _interopRequireDefault(_Vector2D);

var PI2 = Math.PI * 2;

var Steering = (function (_Core$Component) {
  _inherits(Steering, _Core$Component);

  function Steering() {
    _classCallCheck(this, Steering);

    _get(Object.getPrototypeOf(Steering.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Steering, null, [{
    key: "defaults",
    value: function defaults() {
      return {
        sensorRange: 350,
        obstacleRepel: [400, 2.1]
      };
    }
  }]);

  return Steering;
})(Core.Component);

exports.Steering = Steering;

Core.registerComponent('Steering', Steering);

var SteeringSystem = (function (_Core$System) {
  _inherits(SteeringSystem, _Core$System);

  function SteeringSystem() {
    _classCallCheck(this, SteeringSystem);

    _get(Object.getPrototypeOf(SteeringSystem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(SteeringSystem, [{
    key: "matchComponent",
    value: function matchComponent() {
      return 'Steering';
    }
  }, {
    key: "initialize",
    value: function initialize() {

      this.seekFactor = 1;

      this.pushFactor = 7;

      this.avoidFactor = 10;

      this.avoidSeeAhead = 500;
      this.avoidRayWidthFactor = 1.5;

      this.vTarget = new _Vector2D2["default"]();

      this.vectors = {
        avoid: new _Vector2D2["default"](),
        push: new _Vector2D2["default"](),
        seek: new _Vector2D2["default"](),
        flee: new _Vector2D2["default"](),
        wander: new _Vector2D2["default"](),
        evade: new _Vector2D2["default"](),
        pursue: new _Vector2D2["default"]()
      };
    }
  }, {
    key: "updateComponent",
    value: function updateComponent(timeDelta, entityId, steering) {

      this.vTarget.setValues(0, 0);

      for (var key in this.vectors) {
        this.vectors[key].setValues(0, 0);
        this[key](this.vectors[key], timeDelta, entityId, steering);
        this.vTarget.add(this.vectors[key]);
      }

      this.applySteering(timeDelta, entityId, steering);
    }
  }, {
    key: "avoid",
    value: function avoid(vector, timeDelta, entityId, steering) {
      var _this = this;

      if (this.debug) {
        steering.vectors = [];
      }

      var sprite = this.world.entities.get('Sprite', entityId);
      var position = this.world.entities.get('Position', entityId);

      var result = this.lookForObstacle(entityId, position, sprite, steering);
      if (!result) {
        return;
      }

      var range = steering.sensorRange;
      this.world.getSystem('Collision').quadtree.iterate({
        x: position.x - range / 2,
        y: position.y - range / 2,
        width: range,
        height: range
      }, function (item) {

        if (entityId == item.entityId) {
          return;
        }

        var targetPosition = _this.world.entities.get('Position', item.entityId);
        var targetSprite = _this.world.entities.get('Sprite', item.entityId);

        var A = 0;
        var B = steering.obstacleRepel[0];
        var n = 0;
        var m = steering.obstacleRepel[1];

        var dx = position.x - targetPosition.x;
        var dy = position.y - targetPosition.y;
        var edgeRange = sprite.size / 2 + targetSprite.size / 2;
        var distance = Math.sqrt(dx * dx + dy * dy) - edgeRange;
        if (distance <= 0) {
          distance = 0.01;
        }

        if (distance > steering.sensorRange) {
          return;
        }

        var U = -A / Math.pow(distance, n) + B / Math.pow(distance, m);

        vector.x += dx * U;
        vector.y += dy * U;

        if (_this.debug) {
          steering.vectors.push([targetPosition.x, targetPosition.y, U]);
        }
      });
    }
  }, {
    key: "push",
    value: function push(vector, timeDelta, entityId, steering) {}
  }, {
    key: "avoid_ray",
    value: function avoid_ray(vector, timeDelta, entityId, steering) {

      var sprite = this.world.entities.get('Sprite', entityId);
      var position = this.world.entities.get('Position', entityId);

      // Scan ahead for an obstacle, bail if none found.
      var result = this.lookForObstacle(entityId, position, sprite, steering);
      if (!result) {
        return;
      }

      var obstacle = result[0];
      var rayX = result[1];
      var rayY = result[2];

      // Opposite right triangle leg is distance from obstacle to avoid collision.
      var oppositeLen = obstacle.sprite.size / 2 + sprite.size * this.avoidRayWidthFactor;

      // Hypotenuse length is distance from obstacle.
      var hypotenuseLen = Math.sqrt(Math.pow(obstacle.position.x - rayX, 2) + Math.pow(obstacle.position.y - rayY, 2));

      // Adjacent length would be avoid tangent, but no need to calculate.

      // Find angle from direct collision to avoidance
      var theta = Math.asin(oppositeLen / hypotenuseLen);

      // HACK: Too close, panic and steer hard away
      if (isNaN(theta)) {
        theta = Math.PI * 0.66;
      }

      // Find the absolute angle to the obstacle from entity.
      var obstacleAngle = Math.atan2(obstacle.position.y - rayY, obstacle.position.x - rayX);

      // Calculate nearest target angle for avoidance...
      // Try turning clockwise from obstacle.
      var avoidAngle = obstacleAngle + theta;
      // Calculate the "travel" needed from current rotation.
      var travel = Math.min(PI2 - Math.abs(position.rotation - avoidAngle), Math.abs(position.rotation - avoidAngle));
      if (travel > theta) {
        // Clockwise travel exceeds theta, so counterclockwise is shorter.
        avoidAngle = obstacleAngle - theta;
      }

      // Set up the avoidance vector.
      vector.setValues(this.avoidFactor, 0);
      vector.rotate(avoidAngle);
    }
  }, {
    key: "lookForObstacle",
    value: function lookForObstacle(entityId, position, sprite, steering) {
      var rayWidth = sprite.size * this.avoidRayWidthFactor;

      var vRayUnit = new _Vector2D2["default"]();
      vRayUnit.setValues(rayWidth, 0);
      vRayUnit.rotate(position.rotation);

      if (this.debug) {
        steering.hitCircles = [];
      }

      var obstacle, rayX, rayY;
      var steps = this.avoidSeeAhead / rayWidth;
      for (var step = 0; step < steps; step++) {
        rayX = position.x + vRayUnit.x * step;
        rayY = position.y + vRayUnit.y * step;
        obstacle = this.searchCircleForObstacle(steering, entityId, rayX, rayY, rayWidth);
        if (obstacle) {
          return [obstacle, rayX, rayY];
        }
      }

      return null;
    }
  }, {
    key: "searchCircleForObstacle",
    value: function searchCircleForObstacle(steering, entityId, x, y, size) {

      if (this.debug) {
        steering.hitCircles.push([x, y, size]);
      }

      var hits = [];

      this.world.getSystem('Collision').quadtree.iterate({
        x: x - size / 2,
        y: y - size / 2,
        width: size,
        height: size
      }, function (item) {

        if (entityId == item.entityId) {
          return;
        }
        var dx = item.position.x - x;
        var dy = item.position.y - y;
        var range = dx * dx + dy * dy;
        var radii = (size + item.sprite.size) / 2;
        if (range < radii * radii) {
          hits.push([range, item]);
        }
      });

      hits.sort(function (a, b) {
        return b[0] - a[0];
      });
      return hits.length ? hits[0][1] : null;
    }
  }, {
    key: "seek",
    value: function seek(vector, timeDelta, entityId, steering) {

      // Look up the entity ID to seek, if only name given.
      if (steering.seekTargetName && !steering.seekTargetEntityId) {
        steering.seekTargetEntityId = Core.getComponent('Name').findEntityByName(this.world, steering.seekTargetName);
      }

      if (!steering.seekTargetEntityId) {
        return;
      }

      var position = this.world.entities.get('Position', entityId);
      if (!position) {
        return;
      }

      // Accept either a raw x/y coord or entity ID as target
      var targetPosition = steering.targetPosition;
      if (!targetPosition) {
        targetPosition = this.world.entities.get('Position', steering.seekTargetEntityId);
      }
      if (!targetPosition) {
        return;
      }

      vector.setValues(targetPosition.x - position.x, targetPosition.y - position.y);
      vector.normalize();
      vector.multiplyScalar(this.seekFactor);
    }
  }, {
    key: "flee",
    value: function flee(vector, timeDelta, entityId, steering) {}
  }, {
    key: "wander",
    value: function wander(vector, timeDelta, entityId, steering) {}
  }, {
    key: "evade",
    value: function evade(vector, timeDelta, entityId, steering) {}
  }, {
    key: "pursue",
    value: function pursue(vector, timeDelta, entityId, steering) {}
  }, {
    key: "applySteering",
    value: function applySteering(timeDelta, entityId, steering) {

      var motion = this.world.entities.get('Motion', entityId);

      var targetDr = 0;

      if (!this.vTarget.isZero()) {
        var position = this.world.entities.get('Position', entityId);

        // Get the target angle, ensuring a 0..2*Math.PI range.
        var targetAngle = this.vTarget.angle();
        if (targetAngle < 0) {
          targetAngle += 2 * Math.PI;
        }

        if (this.debug) {
          steering.targetAngle = targetAngle;
        }

        // Pick the direction from current to target angle
        var direction = targetAngle < position.rotation ? -1 : 1;

        // If the offset between the angles is more than half a circle, it's
        // shorter to go the other way.
        var offset = Math.abs(targetAngle - position.rotation);
        if (offset > Math.PI) {
          direction = 0 - direction;
        }

        // Work out the desired delta-rotation to steer toward target
        targetDr = direction * Math.min(steering.radPerSec, offset / timeDelta);
      }

      // Calculate the delta-rotation impulse required to meet the goal,
      // but constrain to the capability of the steering thrusters
      var impulseDr = targetDr - motion.drotation;
      if (Math.abs(impulseDr) > steering.radPerSec) {
        if (impulseDr > 0) {
          impulseDr = steering.radPerSec;
        } else if (impulseDr < 0) {
          impulseDr = 0 - steering.radPerSec;
        }
      }

      motion.drotation += impulseDr;
    }
  }, {
    key: "draw",
    value: function draw(timeDelta) {
      if (!this.debug) {
        return;
      }

      var vpSystem = this.world.getSystem('CanvasViewport');
      var ctx = vpSystem.ctx;
      ctx.save();

      vpSystem.centerAndZoom(timeDelta);
      vpSystem.followEntity(timeDelta);

      var matches = this.getMatchingComponents();
      for (var entityId in matches) {
        ctx.save();

        var steering = matches[entityId];
        var position = this.world.entities.get('Position', entityId);
        var sprite = this.world.entities.get('Sprite', entityId);

        this.drawSteeringVsPosition(ctx, steering, position);

        if (steering.hitCircles) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = steering.hitCircles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _step$value = _slicedToArray(_step.value, 3);

              var x = _step$value[0];
              var y = _step$value[1];
              var size = _step$value[2];

              ctx.strokeStyle = '#d00';
              ctx.beginPath();
              ctx.arc(x, y, size, 0, PI2, false);
              ctx.stroke();
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"]) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        if (steering.sensorRange) {
          ctx.strokeStyle = 'rgba(0, 64, 64, 0.75)';
          ctx.beginPath();
          ctx.arc(position.x, position.y, steering.sensorRange, 0, PI2, false);
          ctx.stroke();
        }

        if (steering.vectors) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = steering.vectors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _step2$value = _slicedToArray(_step2.value, 3);

              var x = _step2$value[0];
              var y = _step2$value[1];
              var U = _step2$value[2];

              ctx.strokeStyle = 'rgba(0, 64, 64, 0.75)';
              ctx.beginPath();
              ctx.moveTo(position.x, position.y);
              ctx.lineWidth = Math.max(1, Math.min(U, sprite.width));
              ctx.lineTo(x, y);
              ctx.stroke();
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        if (steering.pushing) {
          this.drawAngle(ctx, position, position.rotation, '#d0d');
        }

        ctx.restore();
      }

      ctx.restore();
    }
  }, {
    key: "drawSteeringVsPosition",
    value: function drawSteeringVsPosition(ctx, steering, position) {
      this.drawAngle(ctx, position, position.rotation, '#ddd');
      if (steering.targetAngle) {
        this.drawAngle(ctx, position, steering.targetAngle, '#dd0');
      }
    }
  }, {
    key: "drawAngle",
    value: function drawAngle(ctx, position, angle, color) {
      var vec = new _Vector2D2["default"]();
      vec.setValues(this.avoidSeeAhead, 0);
      vec.rotate(angle);
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(position.x + vec.x, position.y + vec.y);
      ctx.stroke();
    }
  }]);

  return SteeringSystem;
})(Core.System);

exports.SteeringSystem = SteeringSystem;

Core.registerSystem('Steering', SteeringSystem);

function normalizeAngle(angle) {
  angle = angle % PI2;
  return angle >= 0 ? angle : angle + PI2;
};

},{"Vector2D":"Vector2D","core":"core","plugins/motion":"plugins/motion","plugins/position":"plugins/position"}],"plugins/thruster":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/position");

require("plugins/motion");

var _Vector2D = require("Vector2D");

var _Vector2D2 = _interopRequireDefault(_Vector2D);

var Thruster = (function (_Core$Component) {
  _inherits(Thruster, _Core$Component);

  function Thruster() {
    _classCallCheck(this, Thruster);

    _get(Object.getPrototypeOf(Thruster.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Thruster, null, [{
    key: "defaults",
    value: function defaults() {
      return {
        active: true,
        stop: false,
        useBrakes: true,
        deltaV: 0,
        maxV: 0
      };
    }
  }]);

  return Thruster;
})(Core.Component);

exports.Thruster = Thruster;

Core.registerComponent('Thruster', Thruster);

var ThrusterSystem = (function (_Core$System) {
  _inherits(ThrusterSystem, _Core$System);

  function ThrusterSystem() {
    _classCallCheck(this, ThrusterSystem);

    _get(Object.getPrototypeOf(ThrusterSystem.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(ThrusterSystem, [{
    key: "matchComponent",
    value: function matchComponent() {
      return 'Thruster';
    }
  }, {
    key: "initialize",
    value: function initialize() {
      this.vInertia = new _Vector2D2["default"]();
      this.vThrust = new _Vector2D2["default"]();
      this.vBrakes = new _Vector2D2["default"]();
    }
  }, {
    key: "updateComponent",
    value: function updateComponent(timeDelta, entityId, thruster) {

      if (!thruster.active) {
        return;
      }

      var pos = this.world.entities.get('Position', entityId);
      var motion = this.world.entities.get('Motion', entityId);
      if (!pos || !motion) {
        return;
      }

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
          this.vBrakes.multiplyScalar(0 - brakingDv);
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
  }]);

  return ThrusterSystem;
})(Core.System);

exports.ThrusterSystem = ThrusterSystem;

Core.registerSystem('Thruster', ThrusterSystem);

},{"Vector2D":"Vector2D","core":"core","plugins/motion":"plugins/motion","plugins/position":"plugins/position"}]},{},[]);
