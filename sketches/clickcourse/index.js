(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/lmorchard/devel/other/parsec-patrol/src/sketches/clickcourse/index.js":[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/name");

require("plugins/position");

require("plugins/motion");

require("plugins/thruster");

require("plugins/seeker");

require("plugins/clickCourse");

require("plugins/canvasViewport");

require("plugins/drawStats");

require("plugins/memoryStats");

require("plugins/datGui");

var debug = true;
var move = 0.07;
var rot = Math.PI / 2;

var world = new Core.World({
  systems: {
    CanvasViewport: {
      debug: debug,
      container: '#game',
      canvas: '#viewport',
      followName: 'hero1',
      zoom: 0.5
    },
    DrawStats: {},
    MemoryStats: {},
    DatGui: {},
    Motion: {},
    ClickCourse: {},
    Thruster: {},
    Seeker: {}
  }
});

world.entities.insert({
  Name: { name: 'hero1' },
  Sprite: { name: 'hero', color: '#00f' },
  Position: { x: 250, y: 250 },
  Thruster: { deltaV: 1200, maxV: 500, active: false },
  Seeker: { radPerSec: Math.PI },
  Motion: {},
  ClickCourse: { stopOnArrival: true, active: false }
}, {
  Name: { name: 'sun' },
  Sprite: { name: 'asteroid', size: 300 },
  Position: {},
  Motion: { dx: 0, dy: 0, drotation: Math.PI / 6 }
}, {
  Name: { name: 'chaser1' },
  Sprite: { name: 'enemyscout', color: '#f00' },
  Position: {},
  Motion: {},
  Thruster: { deltaV: 400, maxV: 175 },
  Seeker: { targetName: 'hero1', radPerSec: 0.9 }
}, {
  Name: { name: 'chaser2' },
  Sprite: { name: 'enemyscout', color: '#0f0' },
  Position: {},
  Motion: {},
  Thruster: { deltaV: 600, maxV: 400 },
  Seeker: { targetName: 'hero1', radPerSec: 2 }
});

world.start();

var vpSystem = world.getSystem('CanvasViewport');
var guiSystem = world.getSystem('DatGui');
var gui = guiSystem.gui;

gui.add(vpSystem, 'zoom', vpSystem.options.zoomMin, vpSystem.options.zoomMax).listen();
gui.add(vpSystem, 'lineWidth', 1.0, 4.0).step(0.5).listen();

var names = ['debug', 'gridEnabled', 'followEnabled', 'cameraX', 'cameraY'];
names.forEach(function (name) {
  gui.add(vpSystem, name).listen();
});

var cp = vpSystem.cursorPosition;
gui.add(cp, 'x').listen();
gui.add(cp, 'y').listen();

},{"core":"core","plugins/canvasViewport":"plugins/canvasViewport","plugins/clickCourse":"plugins/clickCourse","plugins/datGui":"plugins/datGui","plugins/drawStats":"plugins/drawStats","plugins/memoryStats":"plugins/memoryStats","plugins/motion":"plugins/motion","plugins/name":"plugins/name","plugins/position":"plugins/position","plugins/seeker":"plugins/seeker","plugins/thruster":"plugins/thruster"}]},{},["/Users/lmorchard/devel/other/parsec-patrol/src/sketches/clickcourse/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbG1vcmNoYXJkL2RldmVsL290aGVyL3BhcnNlYy1wYXRyb2wvc3JjL3NrZXRjaGVzL2NsaWNrY291cnNlL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztvQkNBc0IsTUFBTTs7SUFBaEIsSUFBSTs7UUFFVCxjQUFjOztRQUNkLGtCQUFrQjs7UUFDbEIsZ0JBQWdCOztRQUNoQixrQkFBa0I7O1FBQ2xCLGdCQUFnQjs7UUFDaEIscUJBQXFCOztRQUNyQix3QkFBd0I7O1FBQ3hCLG1CQUFtQjs7UUFDbkIscUJBQXFCOztRQUNyQixnQkFBZ0I7O0FBRXZCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsSUFBSSxHQUFHLEdBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEFBQUMsQ0FBQzs7QUFFeEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3pCLFNBQU8sRUFBRTtBQUNQLGtCQUFjLEVBQUU7QUFDZCxXQUFLLEVBQUUsS0FBSztBQUNaLGVBQVMsRUFBRSxPQUFPO0FBQ2xCLFlBQU0sRUFBRSxXQUFXO0FBQ25CLGdCQUFVLEVBQUUsT0FBTztBQUNuQixVQUFJLEVBQUUsR0FBRztLQUNWO0FBQ0QsYUFBUyxFQUFFLEVBQUU7QUFDYixlQUFXLEVBQUUsRUFBRTtBQUNmLFVBQU0sRUFBRSxFQUFFO0FBQ1YsVUFBTSxFQUFFLEVBQUU7QUFDVixlQUFXLEVBQUUsRUFBRTtBQUNmLFlBQVEsRUFBRSxFQUFFO0FBQ1osVUFBTSxFQUFFLEVBQUU7R0FDWDtDQUNGLENBQUMsQ0FBQzs7QUFFSCxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUNwQixNQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxF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LENBQUM7QUFDakMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgQ29yZSBmcm9tIFwiY29yZVwiO1xuXG5pbXBvcnQgXCJwbHVnaW5zL25hbWVcIjtcbmltcG9ydCBcInBsdWdpbnMvcG9zaXRpb25cIjtcbmltcG9ydCBcInBsdWdpbnMvbW90aW9uXCI7XG5pbXBvcnQgXCJwbHVnaW5zL3RocnVzdGVyXCI7XG5pbXBvcnQgXCJwbHVnaW5zL3NlZWtlclwiO1xuaW1wb3J0IFwicGx1Z2lucy9jbGlja0NvdXJzZVwiO1xuaW1wb3J0IFwicGx1Z2lucy9jYW52YXNWaWV3cG9ydFwiO1xuaW1wb3J0IFwicGx1Z2lucy9kcmF3U3RhdHNcIjtcbmltcG9ydCBcInBsdWdpbnMvbWVtb3J5U3RhdHNcIjtcbmltcG9ydCBcInBsdWdpbnMvZGF0R3VpXCI7XG5cbnZhciBkZWJ1ZyA9IHRydWU7XG52YXIgbW92ZSA9IDAuMDc7XG52YXIgcm90ID0gKE1hdGguUEkgLyAyKTtcblxudmFyIHdvcmxkID0gbmV3IENvcmUuV29ybGQoe1xuICBzeXN0ZW1zOiB7XG4gICAgQ2FudmFzVmlld3BvcnQ6IHtcbiAgICAgIGRlYnVnOiBkZWJ1ZyxcbiAgICAgIGNvbnRhaW5lcjogJyNnYW1lJyxcbiAgICAgIGNhbnZhczogJyN2aWV3cG9ydCcsXG4gICAgICBmb2xsb3dOYW1lOiAnaGVybzEnLFxuICAgICAgem9vbTogMC41XG4gICAgfSxcbiAgICBEcmF3U3RhdHM6IHt9LFxuICAgIE1lbW9yeVN0YXRzOiB7fSxcbiAgICBEYXRHdWk6IHt9LFxuICAgIE1vdGlvbjoge30sXG4gICAgQ2xpY2tDb3Vyc2U6IHt9LFxuICAgIFRocnVzdGVyOiB7fSxcbiAgICBTZWVrZXI6IHt9XG4gIH1cbn0pO1xuXG53b3JsZC5lbnRpdGllcy5pbnNlcnQoe1xuICBOYW1lOiB7IG5hbWU6ICdoZXJvMSd9LFxuICBTcHJpdGU6IHsgbmFtZTogJ2hlcm8nLCBjb2xvcjogJyMwMGYnIH0sXG4gIFBvc2l0aW9uOiB7IHg6IDI1MCwgeTogMjUwIH0sXG4gIFRocnVzdGVyOiB7IGRlbHRhVjogMTIwMCwgbWF4VjogNTAwLCBhY3RpdmU6IGZhbHNlIH0sXG4gIFNlZWtlcjogeyByYWRQZXJTZWM6IE1hdGguUEkgfSxcbiAgTW90aW9uOiB7fSxcbiAgQ2xpY2tDb3Vyc2U6IHsgc3RvcE9uQXJyaXZhbDogdHJ1ZSwgYWN0aXZlOiBmYWxzZSB9XG59LCB7XG4gIE5hbWU6IHsgbmFtZTogJ3N1bid9LFxuICBTcHJpdGU6IHsgbmFtZTogJ2FzdGVyb2lkJywgc2l6ZTogMzAwIH0sXG4gIFBvc2l0aW9uOiB7fSxcbiAgTW90aW9uOiB7IGR4OiAwLCBkeTogMCwgZHJvdGF0aW9uOiBNYXRoLlBJIC8gNiB9XG59LCB7XG4gIE5hbWU6IHsgbmFtZTogJ2NoYXNlcjEnfSxcbiAgU3ByaXRlOiB7IG5hbWU6ICdlbmVteXNjb3V0JywgY29sb3I6ICcjZjAwJyB9LFxuICBQb3NpdGlvbjoge30sXG4gIE1vdGlvbjoge30sXG4gIFRocnVzdGVyOiB7IGRlbHRhVjogNDAwLCBtYXhWOiAxNzUgfSxcbiAgU2Vla2VyOiB7IHRhcmdldE5hbWU6ICdoZXJvMScsIHJhZFBlclNlYzogMC45IH1cbn0sIHtcbiAgTmFtZTogeyBuYW1lOiAnY2hhc2VyMid9LFxuICBTcHJpdGU6IHsgbmFtZTogJ2VuZW15c2NvdXQnLCBjb2xvcjogJyMwZjAnIH0sXG4gIFBvc2l0aW9uOiB7fSxcbiAgTW90aW9uOiB7fSxcbiAgVGhydXN0ZXI6IHsgZGVsdGFWOiA2MDAsIG1heFY6IDQwMCB9LFxuICBTZWVrZXI6IHsgdGFyZ2V0TmFtZTogJ2hlcm8xJywgcmFkUGVyU2VjOiAyIH1cbn0pO1xuXG53b3JsZC5zdGFydCgpO1xuXG52YXIgdnBTeXN0ZW0gPSB3b3JsZC5nZXRTeXN0ZW0oJ0NhbnZhc1ZpZXdwb3J0Jyk7XG52YXIgZ3VpU3lzdGVtID0gd29ybGQuZ2V0U3lzdGVtKCdEYXRHdWknKTtcbnZhciBndWkgPSBndWlTeXN0ZW0uZ3VpO1xuXG5ndWkuYWRkKHZwU3lzdGVtLCAnem9vbScsIHZwU3lzdGVtLm9wdGlvbnMuem9vbU1pbiwgdnBTeXN0ZW0ub3B0aW9ucy56b29tTWF4KS5saXN0ZW4oKTtcbmd1aS5hZGQodnBTeXN0ZW0sICdsaW5lV2lkdGgnLCAxLjAsIDQuMCkuc3RlcCgwLjUpLmxpc3RlbigpO1xuXG52YXIgbmFtZXMgPSBbICdkZWJ1ZycsICdncmlkRW5hYmxlZCcsICdmb2xsb3dFbmFibGVkJywgJ2NhbWVyYVgnLCAnY2FtZXJhWScgXTtcbm5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgZ3VpLmFkZCh2cFN5c3RlbSwgbmFtZSkubGlzdGVuKCk7XG59KTtcblxudmFyIGNwID0gdnBTeXN0ZW0uY3Vyc29yUG9zaXRpb247XG5ndWkuYWRkKGNwLCAneCcpLmxpc3RlbigpO1xuZ3VpLmFkZChjcCwgJ3knKS5saXN0ZW4oKTtcbiJdfQ==
