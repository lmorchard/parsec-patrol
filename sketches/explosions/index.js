(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/lmorchard/devel/other/parsec-patrol/src/sketches/explosions/index.js":[function(require,module,exports){
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

var _Vector2D = require("Vector2D");

var _Vector2D2 = _interopRequireDefault(_Vector2D);

require("plugins/drawStats");

require("plugins/memoryStats");

require("plugins/datGui");

require("plugins/canvasViewport");

require("plugins/name");

require("plugins/position");

require("plugins/expiration");

var debug = true;
var move = 0.07;
var rot = Math.PI / 2;

var world = window.world = new Core.World({
  systems: {
    CanvasViewport: {
      debug: debug,
      container: '#game',
      canvas: '#viewport',
      zoom: 0.5
    },
    Expiration: {},
    DrawStats: {},
    MemoryStats: {},
    DatGui: {}
  }
});

var ttl = 0.75;
var dist = 1750;
var splosions = 50;

var colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];

function spawnExplosion() {
  setTimeout(function () {
    var x = Math.random() * dist - dist / 2;
    var y = Math.random() * dist - dist / 2;
    var color = colors[Math.floor(Math.random() * colors.length)];

    var eid = world.entities.insert({
      Sprite: {
        name: 'explosion',
        color: color,
        radius: 200,
        ttl: ttl
      },
      Position: { x: x, y: y },
      Expiration: { ttl: ttl }
    });
  }, 1000 * Math.random());
}

for (var idx = 0; idx < splosions; idx++) {
  spawnExplosion();
}

world.subscribe(Core.Messages.ENTITY_DESTROY, function (msg, data) {
  spawnExplosion();
});

world.start();

var vpSystem = world.getSystem('CanvasViewport');
var guiSystem = world.getSystem('DatGui');
var gui = guiSystem.gui;

gui.add(world, 'isPaused');
gui.add(world, 'debug');
gui.add(vpSystem, 'zoom', vpSystem.options.zoomMin, vpSystem.options.zoomMax).listen();
gui.add(vpSystem, 'lineWidth', 1.0, 4.0).step(0.5).listen();

var names = ['gridEnabled', 'followEnabled', 'cameraX', 'cameraY'];
names.forEach(function (name) {
  gui.add(vpSystem, name).listen();
});

var cp = vpSystem.cursorPosition;
gui.add(cp, 'x').listen();
gui.add(cp, 'y').listen();

},{"Vector2D":"Vector2D","core":"core","plugins/canvasViewport":"plugins/canvasViewport","plugins/datGui":"plugins/datGui","plugins/drawStats":"plugins/drawStats","plugins/expiration":"plugins/expiration","plugins/memoryStats":"plugins/memoryStats","plugins/name":"plugins/name","plugins/position":"plugins/position"}]},{},["/Users/lmorchard/devel/other/parsec-patrol/src/sketches/explosions/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbG1vcmNoYXJkL2RldmVsL290aGVyL3BhcnNlYy1wYXRyb2wvc3JjL3NrZXRjaGVzL2V4cGxvc2lvbnMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7b0JDQXNCLE1BQU07O0lBQWhCLElBQUk7O3dCQUVLLFVBQVU7Ozs7UUFFeEIsbUJBQW1COztRQUNuQixxQkFBcUI7O1FBQ3JCLGdCQUFnQjs7UUFDaEIsd0JBQXdCOztRQUN4QixjQUFjOztRQUNkLGtCQUFrQjs7UUFDbEIsb0JBQW9COztBQUUzQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLElBQUksR0FBRyxHQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxBQUFDLENBQUM7O0FBRXhCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3hDLFNBQU8sRUFBRTtBQUNQLGtCQUFjLEVBQUU7QUFDZCxXQUFLLEVBQUUsS0FBSztBQUNaLGVBQVMsRUFBRSxPQUFPO0FBQ2xCLFlBQU0sRUFBRSxXQUFXO0FBQ25CLFVBQUksRUFBRSxHQUFHO0tBQ1Y7QUFDRCxjQUFVLEVBQUUsRUFBRTtBQUNkLGFBQVMsRUFBRSxFQUFFO0FBQ2IsZUFBVyxFQUFFLEVBQUU7QUFDZixVQUFNLEVBQUUsRUFBRTtHQUNYO0NBQ0YsQ0FBQyxDQUFDOztBQUVILElBQUksR0FBRyxHQUFHLElBQUksQ0FBQztBQUNmLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRW5CLElBQUksTUFBTSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1B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ZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIENvcmUgZnJvbSBcImNvcmVcIjtcblxuaW1wb3J0IFZlY3RvcjJEIGZyb20gXCJWZWN0b3IyRFwiO1xuXG5pbXBvcnQgXCJwbHVnaW5zL2RyYXdTdGF0c1wiO1xuaW1wb3J0IFwicGx1Z2lucy9tZW1vcnlTdGF0c1wiO1xuaW1wb3J0IFwicGx1Z2lucy9kYXRHdWlcIjtcbmltcG9ydCBcInBsdWdpbnMvY2FudmFzVmlld3BvcnRcIjtcbmltcG9ydCBcInBsdWdpbnMvbmFtZVwiO1xuaW1wb3J0IFwicGx1Z2lucy9wb3NpdGlvblwiO1xuaW1wb3J0IFwicGx1Z2lucy9leHBpcmF0aW9uXCI7XG5cbnZhciBkZWJ1ZyA9IHRydWU7XG52YXIgbW92ZSA9IDAuMDc7XG52YXIgcm90ID0gKE1hdGguUEkgLyAyKTtcblxudmFyIHdvcmxkID0gd2luZG93LndvcmxkID0gbmV3IENvcmUuV29ybGQoe1xuICBzeXN0ZW1zOiB7XG4gICAgQ2FudmFzVmlld3BvcnQ6IHtcbiAgICAgIGRlYnVnOiBkZWJ1ZyxcbiAgICAgIGNvbnRhaW5lcjogJyNnYW1lJyxcbiAgICAgIGNhbnZhczogJyN2aWV3cG9ydCcsXG4gICAgICB6b29tOiAwLjVcbiAgICB9LFxuICAgIEV4cGlyYXRpb246IHt9LFxuICAgIERyYXdTdGF0czoge30sXG4gICAgTWVtb3J5U3RhdHM6IHt9LFxuICAgIERhdEd1aToge30sXG4gIH1cbn0pO1xuXG52YXIgdHRsID0gMC43NTtcbnZhciBkaXN0ID0gMTc1MDtcbnZhciBzcGxvc2lvbnMgPSA1MDtcblxudmFyIGNvbG9ycyA9IFsnI2YwMCcsICcjMGYwJywgJyMwMGYnLCAnI2ZmMCcsICcjMGZmJywgJyNmMGYnXTtcblxuZnVuY3Rpb24gc3Bhd25FeHBsb3Npb24gKCkge1xuICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICB2YXIgeCA9ICggTWF0aC5yYW5kb20oKSAqIGRpc3QgKSAtIChkaXN0IC8gMik7XG4gICAgdmFyIHkgPSAoIE1hdGgucmFuZG9tKCkgKiBkaXN0ICkgLSAoZGlzdCAvIDIpO1xuICAgIHZhciBjb2xvciA9IGNvbG9yc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvcnMubGVuZ3RoKV07XG5cbiAgICB2YXIgZWlkID0gd29ybGQuZW50aXRpZXMuaW5zZXJ0KHtcbiAgICAgIFNwcml0ZToge1xuICAgICAgICBuYW1lOiAnZXhwbG9zaW9uJyxcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICByYWRpdXM6IDIwMCxcbiAgICAgICAgdHRsOiB0dGxcbiAgICAgIH0sXG4gICAgICBQb3NpdGlvbjogeyB4OiB4LCB5OiB5IH0sXG4gICAgICBFeHBpcmF0aW9uOiB7IHR0bDogdHRsIH1cbiAgICB9KTtcbiAgfSwgMTAwMCAqIE1hdGgucmFuZG9tKCkpO1xufVxuXG5mb3IgKHZhciBpZHggPSAwOyBpZHggPCBzcGxvc2lvbnM7IGlkeCsrKSB7XG4gIHNwYXduRXhwbG9zaW9uKCk7XG59XG5cbndvcmxkLnN1YnNjcmliZShDb3JlLk1lc3NhZ2VzLkVOVElUWV9ERVNUUk9ZLCBmdW5jdGlvbiAobXNnLCBkYXRhKSB7XG4gIHNwYXduRXhwbG9zaW9uKCk7XG59KTtcblxud29ybGQuc3RhcnQoKTtcblxudmFyIHZwU3lzdGVtID0gd29ybGQuZ2V0U3lzdGVtKCdDYW52YXNWaWV3cG9ydCcpO1xudmFyIGd1aVN5c3RlbSA9IHdvcmxkLmdldFN5c3RlbSgnRGF0R3VpJyk7XG52YXIgZ3VpID0gZ3VpU3lzdGVtLmd1aTtcblxuZ3VpLmFkZCh3b3JsZCwgJ2lzUGF1c2VkJyk7XG5ndWkuYWRkKHdvcmxkLCAnZGVidWcnKTtcbmd1aS5hZGQodnBTeXN0ZW0sICd6b29tJywgdnBTeXN0ZW0ub3B0aW9ucy56b29tTWluLCB2cFN5c3RlbS5vcHRpb25zLnpvb21NYXgpLmxpc3RlbigpO1xuZ3VpLmFkZCh2cFN5c3RlbSwgJ2xpbmVXaWR0aCcsIDEuMCwgNC4wKS5zdGVwKDAuNSkubGlzdGVuKCk7XG5cbnZhciBuYW1lcyA9IFsgJ2dyaWRFbmFibGVkJywgJ2ZvbGxvd0VuYWJsZWQnLCAnY2FtZXJhWCcsICdjYW1lcmFZJyBdO1xubmFtZXMuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICBndWkuYWRkKHZwU3lzdGVtLCBuYW1lKS5saXN0ZW4oKTtcbn0pO1xuXG52YXIgY3AgPSB2cFN5c3RlbS5jdXJzb3JQb3NpdGlvbjtcbmd1aS5hZGQoY3AsICd4JykubGlzdGVuKCk7XG5ndWkuYWRkKGNwLCAneScpLmxpc3RlbigpO1xuIl19
