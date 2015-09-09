(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/lmorchard/devel/other/parsec-patrol/src/app.js":[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _core = require("./core");

var Core = _interopRequireWildcard(_core);

},{"./core":"/Users/lmorchard/devel/other/parsec-patrol/src/core.js"}],"/Users/lmorchard/devel/other/parsec-patrol/src/core.js":[function(require,module,exports){
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

},{"lodash.defaults":"lodash.defaults"}]},{},["/Users/lmorchard/devel/other/parsec-patrol/src/app.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbG1vcmNoYXJkL2RldmVsL290aGVyL3BhcnNlYy1wYXRyb2wvc3JjL2FwcC5qcyIsIi9Vc2Vycy9sbW9yY2hhcmQvZGV2ZWwvb3RoZXIvcGFyc2VjLXBhdHJvbC9zcmMvY29yZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7b0JDQXNCLFFBQVE7O0lBQWxCLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJDRUssaUJBQWlCOzs7O0FBRXRDLElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFNLGVBQWUsR0FBRyxJQUFJLEdBQUcsVUFBVSxDQUFDOztBQUUxQyxJQUFJLHFCQUFxQixHQUN2QixNQUFNLENBQUMscUJBQXFCLElBQzVCLE1BQU0sQ0FBQywyQkFBMkIsSUFDbEMsTUFBTSxDQUFDLHdCQUF3QixJQUMvQixNQUFNLENBQUMsc0JBQXNCLElBQzdCLE1BQU0sQ0FBQyx1QkFBdUIsSUFDOUIsVUFBVSxFQUFFLEVBQUU7QUFBRSxZQUFVLENBQUMsRUFBRSxFQUFHLElBQUksR0FBQyxFQUFFLENBQUUsQ0FBQTtDQUFFLENBQUM7OztBQUc5QyxJQUFJLFFBQVEsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUNuRSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDOztBQUV4RSxJQUFNLFFBQVEsR0FBRztBQUN0QixlQUFhLEVBQUUsZUFBZTtBQUM5QixnQkFBYyxFQUFFLGdCQUFnQjtDQUNqQyxDQUFDOzs7O0lBRVcsS0FBSztBQUVMLFdBRkEsS0FBSyxDQUVKLE9BQU8sRUFBRTs7OzBCQUZWLEtBQUs7O0FBR2QsV0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFF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OztBQUVNLFNBQVMsU0FBUyxDQUFDLFVBQVUsRUFBRTtBQUNwQyxTQUFPLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztDQUNuQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBDb3JlIGZyb20gXCIuL2NvcmVcIjtcbiIsIi8vIHJlcXVpcmUoXCJiYWJlbC9wb2x5ZmlsbFwiKTtcbi8vaW1wb3J0IGFzc2lnbiBmcm9tIFwibG9kYXNoLmFzc2lnblwiO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gXCJsb2Rhc2guZGVmYXVsdHNcIjtcblxuY29uc3QgVEFSR0VUX0ZQUyA9IDYwO1xuY29uc3QgVEFSR0VUX0RVUkFUSU9OID0gMTAwMCAvIFRBUkdFVF9GUFM7XG5cbnZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPVxuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICB3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgZnVuY3Rpb24gKGZuKSB7IHNldFRpbWVvdXQoZm4sICgxMDAwLzYwKSkgfTtcblxuLy8gQ29tbW9ubHkgdXNlZCB0ZW1wIHZhcmlhYmxlcywgcHJlLWRlY2xhcmVkIGVhcmx5LlxudmFyIGVudGl0eUlkLCBzeXN0ZW0sIHN5c3RlbU5hbWUsIHN5c3RlbUF0dHJzLCBzeXN0ZW1DbHMsIGNvbXBvbmVudE5hbWUsXG4gICAgdGltZU5vdywgdGltZURlbHRhLCBjb21wb25lbnQsIGNvbXBvbmVudEF0dHJzLCBtYXRjaGVzLCBpZHgsIGl0ZW0sIGhhbmRsZXI7XG5cbmV4cG9ydCBjb25zdCBNZXNzYWdlcyA9IHtcbiAgRU5USVRZX0lOU0VSVDogJ2VudGl0eV9pbnNlcnQnLFxuICBFTlRJVFlfREVTVFJPWTogJ2VudGl0eV9kZXN0cm95J1xufTtcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xuICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLmRlYnVnID0gZmFsc2U7XG5cbiAgICAvLyBUT0RPOiBUaGlzIGNpcmN1bGFyIHJlZmVyZW5jZSB0aGluZyBtaWdodCBiZSBhIG1pc3Rha2UuXG4gICAgLy8gVE9ETzogTWF5YmUgbWVyZ2UgZW50aXR5IG1hbmFnZXIgd2l0aCB3b3JsZD9cbiAgICB0aGlzLmVudGl0aWVzID0gbmV3IEVudGl0eU1hbmFnZXIodGhpcyk7XG5cbiAgICB0aGlzLnN5c3RlbXMgPSB7fTtcbiAgICBpZiAob3B0aW9ucy5zeXN0ZW1zKSB7XG4gICAgICB0aGlzLmFkZFN5c3RlbXMob3B0aW9ucy5zeXN0ZW1zKTtcbiAgICB9XG5cbiAgICB0aGlzLnN1YnNjcmliZXJzID0ge307XG5cbiAgICB0aGlzLnRpY2tEdXJhdGlvbiA9IFRBUkdFVF9EVVJBVElPTjtcbiAgICB0aGlzLm1heFRpY2tEZWx0YSA9IFRBUkdFVF9EVVJBVElPTiAqIDU7XG4gICAgdGhpcy50aWNrQWNjdW11bGF0b3IgPSAwO1xuXG4gICAgdGhpcy5sYXN0VGlja1RpbWUgPSAwO1xuICAgIHRoaXMubGFzdERyYXdUaW1lID0gMDtcblxuICAgIHRoaXMuYm91bmRUaWNrTG9vcCA9ICgpID0+IHRoaXMudGlja0xvb3AoKTtcbiAgICB0aGlzLmJvdW5kRHJhd0xvb3AgPSAodGltZXN0YW1wKSA9PiB0aGlzLmRyYXdMb29wKHRpbWVzdGFtcCk7XG4gIH1cblxuICAvLyBUT0RPOiBVc2UgYSBiZXR0ZXIgcHVic3ViIGxpYnJhcnkgaGVyZS4gQnV0LCBwdWJzdWItanMgc2VlbWVkIHRvIHBlcmZvcm1cbiAgLy8gYmFkbHkgaW4gYSBnYW1lIGxvb3AuXG5cbiAgc3Vic2NyaWJlKG1zZywgaGFuZGxlcikge1xuICAgIGlmICghdGhpcy5zdWJzY3JpYmVyc1ttc2ddKSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJzW21zZ10gPSBbXTtcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpYmVyc1ttc2ddLnB1c2goaGFuZGxlcik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bnN1YnNjcmliZShtc2csIGhhbmRsZXIpIHtcbiAgICAvLyBUT0RPXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaXNoKG1zZywgZGF0YSkge1xuICAgIGlmICghdGhpcy5zdWJzY3JpYmVyc1ttc2ddKSB7IHJldHVybjsgfVxuICAgIGZvciAoaWR4ID0gMCwgaGFuZGxlcjsgaGFuZGxlciA9IHRoaXMuc3Vic2NyaWJlcnNbbXNnXVtpZHhdOyBpZHgrKykge1xuICAgICAgaGFuZGxlcihtc2csIGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGFkZFN5c3RlbXMoc3lzdGVtc0RhdGEpIHtcbiAgICBmb3IgKHN5c3RlbU5hbWUgaW4gc3lzdGVtc0RhdGEpIHtcbiAgICAgIHN5c3RlbUF0dHJzID0gc3lzdGVtc0RhdGFbc3lzdGVtTmFtZV07XG4gICAgICBzeXN0ZW1DbHMgPSBnZXRTeXN0ZW0oc3lzdGVtTmFtZSk7XG4gICAgICBzeXN0ZW0gPSBuZXcgc3lzdGVtQ2xzKHN5c3RlbUF0dHJzKTtcbiAgICAgIHN5c3RlbS5zZXRXb3JsZCh0aGlzKTtcbiAgICAgIHRoaXMuc3lzdGVtc1tzeXN0ZW1OYW1lXSA9IHN5c3RlbTtcbiAgICB9XG4gIH1cblxuICBnZXRTeXN0ZW0oc3lzdGVtTmFtZSkge1xuICAgIHJldHVybiB0aGlzLnN5c3RlbXNbc3lzdGVtTmFtZV07XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAodGhpcy5pc1J1bm5pbmcpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5pc1J1bm5pbmcgPSB0cnVlO1xuXG4gICAgZm9yIChzeXN0ZW1OYW1lIGluIHRoaXMuc3lzdGVtcykge1xuICAgICAgdGhpcy5zeXN0ZW1zW3N5c3RlbU5hbWVdLmluaXRpYWxpemUoKTtcbiAgICB9XG5cbiAgICAvLyBHYW1lIGxvZ2ljIHNlcGFyYXRlZCBmcm9tIGRpc3BsYXkgcmVuZGVyaW5nXG4gICAgLy8gU2VlIGFsc286IGh0dHA6Ly93d3cuY2hhbmRsZXJwcmFsbC5jb20vMjAxMi8wNi9yZXF1ZXN0YW5pbWF0aW9uZnJhbWUtaXMtbm90LXlvdXItbG9naWNzLWZyaWVuZC9cbiAgICB0aGlzLmxhc3RUaWNrVGltZSA9IERhdGUubm93KCk7XG4gICAgdGhpcy5sYXN0RHJhd1RpbWUgPSAwO1xuXG4gICAgc2V0VGltZW91dCh0aGlzLmJvdW5kVGlja0xvb3AsIHRoaXMudGlja0R1cmF0aW9uKTtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5ib3VuZERyYXdMb29wKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmlzUnVubmluZyA9IGZhbHNlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgdGhpcy5pc1BhdXNlZCA9IHRydWU7XG4gIH1cblxuICByZXN1bWUoKSB7XG4gICAgdGhpcy5pc1BhdXNlZCA9IGZhbHNlO1xuICB9XG5cbiAgdGljayh0aW1lRGVsdGFNUykge1xuICAgIHRpbWVEZWx0YSA9IHRpbWVEZWx0YU1TIC8gMTAwMDtcbiAgICBmb3IgKHN5c3RlbU5hbWUgaW4gdGhpcy5zeXN0ZW1zKSB7XG4gICAgICB0aGlzLnN5c3RlbXNbc3lzdGVtTmFtZV0udXBkYXRlU3RhcnQodGltZURlbHRhKTtcbiAgICB9XG4gICAgZm9yIChzeXN0ZW1OYW1lIGluIHRoaXMuc3lzdGVtcykge1xuICAgICAgdGhpcy5zeXN0ZW1zW3N5c3RlbU5hbWVdLnVwZGF0ZSh0aW1lRGVsdGEpO1xuICAgIH1cbiAgICBmb3IgKHN5c3RlbU5hbWUgaW4gdGhpcy5zeXN0ZW1zKSB7XG4gICAgICB0aGlzLnN5c3RlbXNbc3lzdGVtTmFtZV0udXBkYXRlRW5kKHRpbWVEZWx0YSk7XG4gICAgfVxuICB9XG5cbiAgdGlja0xvb3AoKSB7XG4gICAgdGltZU5vdyA9IERhdGUubm93KCk7XG4gICAgdGltZURlbHRhID0gTWF0aC5taW4odGltZU5vdyAtIHRoaXMubGFzdFRpY2tUaW1lLCB0aGlzLm1heFRpY2tEZWx0YSk7XG4gICAgdGhpcy5sYXN0VGlja1RpbWUgPSB0aW1lTm93O1xuXG4gICAgaWYgKCF0aGlzLmlzUGF1c2VkKSB7XG4gICAgICAvLyBGaXhlZC1zdGVwIGdhbWUgbG9naWMgbG9vcFxuICAgICAgLy8gc2VlOiBodHRwOi8vZ2FmZmVyb25nYW1lcy5jb20vZ2FtZS1waHlzaWNzL2ZpeC15b3VyLXRpbWVzdGVwL1xuICAgICAgdGhpcy50aWNrQWNjdW11bGF0b3IgKz0gdGltZURlbHRhO1xuICAgICAgd2hpbGUgKHRoaXMudGlja0FjY3VtdWxhdG9yID4gdGhpcy50aWNrRHVyYXRpb24pIHtcbiAgICAgICAgdGhpcy50aWNrKHRoaXMudGlja0R1cmF0aW9uKTtcbiAgICAgICAgdGhpcy50aWNrQWNjdW11bGF0b3IgLT0gdGhpcy50aWNrRHVyYXRpb247XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICBzZXRUaW1lb3V0KHRoaXMuYm91bmRUaWNrTG9vcCwgdGhpcy50aWNrRHVyYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcodGltZURlbHRhTVMpIHtcbiAgICB0aW1lRGVsdGEgPSB0aW1lRGVsdGFNUyAvIDEwMDA7XG4gICAgZm9yIChzeXN0ZW1OYW1lIGluIHRoaXMuc3lzdGVtcykge1xuICAgICAgdGhpcy5zeXN0ZW1zW3N5c3RlbU5hbWVdLmRyYXdTdGFydCh0aW1lRGVsdGEpO1xuICAgIH1cbiAgICBmb3IgKHN5c3RlbU5hbWUgaW4gdGhpcy5zeXN0ZW1zKSB7XG4gICAgICB0aGlzLnN5c3RlbXNbc3lzdGVtTmFtZV0uZHJhdyh0aW1lRGVsdGEpO1xuICAgIH1cbiAgICBmb3IgKHN5c3RlbU5hbWUgaW4gdGhpcy5zeXN0ZW1zKSB7XG4gICAgICB0aGlzLnN5c3RlbXNbc3lzdGVtTmFtZV0uZHJhd0VuZCh0aW1lRGVsdGEpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXdMb29wKHRpbWVzdGFtcCkge1xuICAgIGlmICghdGhpcy5sYXN0RHJhd1RpbWUpIHsgdGhpcy5sYXN0RHJhd1RpbWUgPSB0aW1lc3RhbXA7IH1cbiAgICB0aW1lRGVsdGEgPSB0aW1lc3RhbXAgLSB0aGlzLmxhc3REcmF3VGltZTtcbiAgICB0aGlzLmxhc3REcmF3VGltZSA9IHRpbWVzdGFtcDtcblxuICAgIGlmICghdGhpcy5pc1BhdXNlZCkge1xuICAgICAgdGhpcy5kcmF3KHRpbWVEZWx0YSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNSdW5uaW5nKSB7XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5ib3VuZERyYXdMb29wKTtcbiAgICB9XG4gIH1cblxufVxuXG5leHBvcnQgY2xhc3MgRW50aXR5TWFuYWdlciB7XG5cbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIHRoaXMubGFzdEVudGl0eUlkID0gMDtcbiAgfVxuXG4gIGdlbmVyYXRlRW50aXR5SWQoKSB7XG4gICAgcmV0dXJuICsrKHRoaXMubGFzdEVudGl0eUlkKTtcbiAgfVxuXG4gIGluc2VydCguLi5pdGVtcykge1xuICAgIHZhciBvdXQgPSBbXTtcbiAgICBmb3IgKGlkeCA9IDA7IGl0ZW0gPSBpdGVtc1tpZHhdOyBpZHgrKykge1xuICAgICAgZW50aXR5SWQgPSB0aGlzLmdlbmVyYXRlRW50aXR5SWQoKTtcbiAgICAgIGZvciAoY29tcG9uZW50TmFtZSBpbiBpdGVtKSB7XG4gICAgICAgIGNvbXBvbmVudEF0dHJzID0gaXRlbVtjb21wb25lbnROYW1lXTtcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoZW50aXR5SWQsIGNvbXBvbmVudE5hbWUsIGNvbXBvbmVudEF0dHJzKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud29ybGQucHVibGlzaChNZXNzYWdlcy5FTlRJVFlfSU5TRVJULCBlbnRpdHlJZCk7XG4gICAgICBvdXQucHVzaChlbnRpdHlJZCk7XG4gICAgfVxuICAgIHJldHVybiBvdXQubGVuZ3RoID4gMSA/IG91dCA6IG91dFswXTtcbiAgfVxuXG4gIGRlc3Ryb3koZW50aXR5SWQpIHtcbiAgICB0aGlzLndvcmxkLnB1Ymxpc2goTWVzc2FnZXMuRU5USVRZX0RFU1RST1ksIGVudGl0eUlkKTtcbiAgICBmb3IgKGNvbXBvbmVudE5hbWUgaW4gdGhpcy5zdG9yZSkge1xuICAgICAgdGhpcy5yZW1vdmVDb21wb25lbnQoZW50aXR5SWQsIGNvbXBvbmVudE5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIGFkZENvbXBvbmVudChlbnRpdHlJZCwgY29tcG9uZW50TmFtZSwgY29tcG9uZW50QXR0cnMpIHtcbiAgICB2YXIgY29tcG9uZW50TWFuYWdlciA9IGdldENvbXBvbmVudChjb21wb25lbnROYW1lKTtcbiAgICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50TWFuYWdlci5jcmVhdGUoY29tcG9uZW50QXR0cnMpO1xuICAgIGlmICghdGhpcy5zdG9yZVtjb21wb25lbnROYW1lXSkge1xuICAgICAgdGhpcy5zdG9yZVtjb21wb25lbnROYW1lXSA9IHt9O1xuICAgIH1cbiAgICB0aGlzLnN0b3JlW2NvbXBvbmVudE5hbWVdW2VudGl0eUlkXSA9IGNvbXBvbmVudDtcbiAgfVxuXG4gIHJlbW92ZUNvbXBvbmVudChlbnRpdHlJZCwgY29tcG9uZW50TmFtZSkge1xuICAgIGlmIChlbnRpdHlJZCBpbiB0aGlzLnN0b3JlW2NvbXBvbmVudE5hbWVdKSB7XG4gICAgICBkZWxldGUgdGhpcy5zdG9yZVtjb21wb25lbnROYW1lXVtlbnRpdHlJZF07XG4gICAgfVxuICB9XG5cbiAgaGFzQ29tcG9uZW50KGVudGl0eUlkLCBjb21wb25lbnROYW1lKSB7XG4gICAgcmV0dXJuIChjb21wb25lbnROYW1lIGluIHRoaXMuc3RvcmUpICYmXG4gICAgICAgICAgIChlbnRpdHlJZCBpbiB0aGlzLnN0b3JlW2NvbXBvbmVudE5hbWVdKTtcbiAgfVxuXG4gIGdldChjb21wb25lbnROYW1lLCBlbnRpdHlJZCkge1xuICAgIGlmICghdGhpcy5zdG9yZVtjb21wb25lbnROYW1lXSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIGlmICghZW50aXR5SWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0b3JlW2NvbXBvbmVudE5hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zdG9yZVtjb21wb25lbnROYW1lXVtlbnRpdHlJZF07XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG5cbiAgc3RhdGljIGRlZmF1bHRzKCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUoYXR0cnMpIHtcbiAgICByZXR1cm4gZGVmYXVsdHMoYXR0cnMgfHwge30sIHRoaXMuZGVmYXVsdHMoKSk7XG4gIH1cblxufVxuXG5leHBvcnQgY2xhc3MgU3lzdGVtIHtcblxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHMob3B0aW9ucywgdGhpcy5kZWZhdWx0T3B0aW9ucygpKTtcbiAgICB0aGlzLmRlYnVnID0gdGhpcy5vcHRpb25zLmRlYnVnIHx8IGZhbHNlO1xuICB9XG5cbiAgZGVmYXVsdE9wdGlvbnMoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9O1xuXG4gIHNldFdvcmxkKHdvcmxkKSB7XG4gICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuICB9XG5cbiAgbWF0Y2hDb21wb25lbnQoKSB7IHJldHVybiAnJzsgfVxuXG4gIGluaXRpYWxpemUoKSB7IH1cblxuICBnZXRNYXRjaGluZ0NvbXBvbmVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMud29ybGQuZW50aXRpZXMuZ2V0KHRoaXMubWF0Y2hDb21wb25lbnQoKSk7XG4gIH1cblxuICB1cGRhdGVTdGFydCh0aW1lRGVsdGEpIHsgfVxuXG4gIHVwZGF0ZSh0aW1lRGVsdGEpIHtcbiAgICBtYXRjaGVzID0gdGhpcy5nZXRNYXRjaGluZ0NvbXBvbmVudHMoKTtcbiAgICBmb3IgKGVudGl0eUlkIGluIG1hdGNoZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlQ29tcG9uZW50KHRpbWVEZWx0YSwgZW50aXR5SWQsIG1hdGNoZXNbZW50aXR5SWRdKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVDb21wb25lbnQodGltZURlbHRhLCBlbnRpdHlJZCwgY29tcG9uZW50KSB7IH1cblxuICB1cGRhdGVFbmQodGltZURlbHRhKSB7IH1cblxuICBkcmF3U3RhcnQodGltZURlbHRhKSB7IH1cblxuICBkcmF3KHRpbWVEZWx0YSkgeyB9XG5cbiAgZHJhd0VuZCh0aW1lRGVsdGEpIHsgfVxuXG59XG5cbnZhciBjb21wb25lbnRSZWdpc3RyeSA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50TmFtZSwgY29tcG9uZW50TWFuYWdlcikge1xuICBjb21wb25lbnRSZWdpc3RyeVtjb21wb25lbnROYW1lXSA9IGNvbXBvbmVudE1hbmFnZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wb25lbnQoY29tcG9uZW50TmFtZSkge1xuICByZXR1cm4gY29tcG9uZW50UmVnaXN0cnlbY29tcG9uZW50TmFtZV07XG59XG5cbnZhciBzeXN0ZW1SZWdpc3RyeSA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJTeXN0ZW0oc3lzdGVtTmFtZSwgc3lzdGVtKSB7XG4gIHN5c3RlbVJlZ2lzdHJ5W3N5c3RlbU5hbWVdID0gc3lzdGVtO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3lzdGVtKHN5c3RlbU5hbWUpIHtcbiAgcmV0dXJuIHN5c3RlbVJlZ2lzdHJ5W3N5c3RlbU5hbWVdO1xufVxuIl19
