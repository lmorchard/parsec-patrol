(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/lmorchard/devel/other/parsec-patrol/src/sketches/collision/index.js":[function(require,module,exports){
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

require("plugins/health");

require("plugins/position");

require("plugins/motion");

require("plugins/thruster");

require("plugins/seeker");

require("plugins/clickCourse");

require("plugins/collision");

require("plugins/bounce");

var debug = true;
var move = 0.07;
var rot = Math.PI / 2;

var world = window.world = new Core.World({
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
    Thruster: {},
    Seeker: {},
    ClickCourse: {},
    Collision: {},
    Bounce: {}
  }
});

world.entities.insert({
  Name: { name: 'hero1' },
  Sprite: { name: 'hero', color: '#00f' },
  Collidable: {},
  Bounce: { mass: 7000 },
  Position: { x: 0, y: 0 },
  Thruster: { deltaV: 1200, maxV: 500, active: false },
  Seeker: { radPerSec: Math.PI },
  Motion: {},
  ClickCourse: { stopOnArrival: true, active: false }
});

function spawnAsteroid(x, y, width, height, dx, dy, dr, mass, health) {
  world.entities.insert({
    Sprite: { name: 'asteroid', size: width },
    Health: { max: health },
    Collidable: {},
    Bounce: { mass: mass },
    Position: { x: x, y: y },
    Motion: { dx: dx, dy: dy, drotation: dr }
  });
}

function spawnField(centerX, centerY) {
  var radius = arguments.length <= 2 || arguments[2] === undefined ? 300 : arguments[2];
  var MAX_ASTEROIDS = arguments.length <= 3 || arguments[3] === undefined ? 50 : arguments[3];
  var MAX_TRIES = arguments.length <= 4 || arguments[4] === undefined ? 5 : arguments[4];
  var MIN_SIZE = arguments.length <= 5 || arguments[5] === undefined ? 20 : arguments[5];
  var MAX_SIZE = arguments.length <= 6 || arguments[6] === undefined ? 200 : arguments[6];
  var MAX_GRAV = arguments.length <= 7 || arguments[7] === undefined ? 10 : arguments[7];

  var vCenter = new _Vector2D2["default"](centerY, centerX);
  var vSpawn = new _Vector2D2["default"](0, 0);
  var vGrav = new _Vector2D2["default"](0, 0);
  var inField = [];

  for (var idx = 0; idx < MAX_ASTEROIDS; idx++) {
    for (var c = 0; c < MAX_TRIES; c++) {

      var size = (MAX_SIZE - MIN_SIZE) * Math.random() + MIN_SIZE;
      var rot = Math.PI * 4 * Math.random();
      vSpawn.setValues(vCenter.x, vCenter.y - ((radius - 1) * Math.random() + 1));
      vSpawn.rotateAround(vCenter, rot);

      var isClear = true;
      for (var fldIdx = 0; fldIdx < inField.length; fldIdx++) {
        var item = inField[fldIdx];
        if (Math.abs(vSpawn.x - item.x) * 2 >= (size + item.width) * 1.025) {
          continue;
        }
        if (Math.abs(vSpawn.y - item.y) * 2 >= (size + item.height) * 1.025) {
          continue;
        }
        isClear = false;
        break;
      }
      if (!isClear) {
        continue;
      }

      inField.push({ x: vSpawn.x, y: vSpawn.y, width: size, height: size });

      vGrav.setValues(0, Math.random() * MAX_GRAV);
      vGrav.rotate(rot);

      spawnAsteroid(vSpawn.x, vSpawn.y, size, size, vGrav.x, vGrav.y, Math.PI * 0.25 * Math.random(), 4 * size * size, 4 * size * size);
    }
  }
}

var pos = 470;
var size = 440;
var num = 200;

spawnField(-pos, -pos, size, num);
spawnField(pos, pos, size, num);
spawnField(pos, -pos, size, num);
spawnField(-pos, pos, size, num);

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

},{"Vector2D":"Vector2D","core":"core","plugins/bounce":"plugins/bounce","plugins/canvasViewport":"plugins/canvasViewport","plugins/clickCourse":"plugins/clickCourse","plugins/collision":"plugins/collision","plugins/datGui":"plugins/datGui","plugins/drawStats":"plugins/drawStats","plugins/health":"plugins/health","plugins/memoryStats":"plugins/memoryStats","plugins/motion":"plugins/motion","plugins/name":"plugins/name","plugins/position":"plugins/position","plugins/seeker":"plugins/seeker","plugins/thruster":"plugins/thruster"}]},{},["/Users/lmorchard/devel/other/parsec-patrol/src/sketches/collision/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbG1vcmNoYXJkL2RldmVsL290aGVyL3BhcnNlYy1wYXRyb2wvc3JjL3NrZXRjaGVzL2NvbGxpc2lvbi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztvQkNBc0IsTUFBTTs7SUFBaEIsSUFBSTs7d0JBRUssVUFBVTs7OztRQUV4QixtQkFBbUI7O1FBQ25CLHFCQUFxQjs7UUFDckIsZ0JBQWdCOztRQUNoQix3QkFBd0I7O1FBQ3hCLGNBQWM7O1FBQ2QsZ0JBQWdCOztRQUNoQixrQkFBa0I7O1FBQ2xCLGdCQUFnQjs7UUFDaEIsa0JBQWtCOztRQUNsQixnQkFBZ0I7O1FBQ2hCLHFCQUFxQjs7UUFDckIsbUJBQW1COztRQUNuQixnQkFBZ0I7O0FBRXZCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7QUFDaEIsSUFBSSxHQUFHLEdBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEFBQUMsQ0FBQzs7QUFFeEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDeEMsU0FBTyxFQUFFO0FBQ1Asa0JBQWMsRUFBRTtBQUNkLFdBQUssRUFBRSxLQUFLO0FBQ1osZUFBUyxFQUFFLE9BQU87QUFDbEIsWUFBTSxFQUFFLFdBQVc7QUFDbkIsZ0JBQVUsRUFBRSxPQUFPO0FBQ25CLFVBQUksRUFBRSxHQUFHO0tBQ1Y7QUFDRCxhQUFTLEVBQUUsRUFBRTtBQUNiLGVBQVcsRUFBRSxFQUFFO0FBQ2YsVUFBTSxFQUFFLEVBQUU7QUFDVixVQUFNLEVBQUUsRUFBRTtBQUNWLFlBQVEsRUFBRSxFQUFFO0FBQ1osVUFBTSxFQUFFLEVBQUU7QUFDVixlQUFXLEVBQUUsRUFBRTtBQUNmLGFBQVMsRUFBRSxF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LEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3ZGLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUU1RCxJQUFJLEtBQUssR0FBRyxDQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBRSxDQUFDO0FBQ3JFLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLEVBQUU7QUFDNUIsS0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7Q0FDbEMsQ0FBQyxDQUFDOztBQUVILElBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7QUFDakMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgQ29yZSBmcm9tIFwiY29yZVwiO1xuXG5pbXBvcnQgVmVjdG9yMkQgZnJvbSBcIlZlY3RvcjJEXCI7XG5cbmltcG9ydCBcInBsdWdpbnMvZHJhd1N0YXRzXCI7XG5pbXBvcnQgXCJwbHVnaW5zL21lbW9yeVN0YXRzXCI7XG5pbXBvcnQgXCJwbHVnaW5zL2RhdEd1aVwiO1xuaW1wb3J0IFwicGx1Z2lucy9jYW52YXNWaWV3cG9ydFwiO1xuaW1wb3J0IFwicGx1Z2lucy9uYW1lXCI7XG5pbXBvcnQgXCJwbHVnaW5zL2hlYWx0aFwiO1xuaW1wb3J0IFwicGx1Z2lucy9wb3NpdGlvblwiO1xuaW1wb3J0IFwicGx1Z2lucy9tb3Rpb25cIjtcbmltcG9ydCBcInBsdWdpbnMvdGhydXN0ZXJcIjtcbmltcG9ydCBcInBsdWdpbnMvc2Vla2VyXCI7XG5pbXBvcnQgXCJwbHVnaW5zL2NsaWNrQ291cnNlXCI7XG5pbXBvcnQgXCJwbHVnaW5zL2NvbGxpc2lvblwiO1xuaW1wb3J0IFwicGx1Z2lucy9ib3VuY2VcIjtcblxudmFyIGRlYnVnID0gdHJ1ZTtcbnZhciBtb3ZlID0gMC4wNztcbnZhciByb3QgPSAoTWF0aC5QSSAvIDIpO1xuXG52YXIgd29ybGQgPSB3aW5kb3cud29ybGQgPSBuZXcgQ29yZS5Xb3JsZCh7XG4gIHN5c3RlbXM6IHtcbiAgICBDYW52YXNWaWV3cG9ydDoge1xuICAgICAgZGVidWc6IGRlYnVnLFxuICAgICAgY29udGFpbmVyOiAnI2dhbWUnLFxuICAgICAgY2FudmFzOiAnI3ZpZXdwb3J0JyxcbiAgICAgIGZvbGxvd05hbWU6ICdoZXJvMScsXG4gICAgICB6b29tOiAwLjVcbiAgICB9LFxuICAgIERyYXdTdGF0czoge30sXG4gICAgTWVtb3J5U3RhdHM6IHt9LFxuICAgIERhdEd1aToge30sXG4gICAgTW90aW9uOiB7fSxcbiAgICBUaHJ1c3Rlcjoge30sXG4gICAgU2Vla2VyOiB7fSxcbiAgICBDbGlja0NvdXJzZToge30sXG4gICAgQ29sbGlzaW9uOiB7fSxcbiAgICBCb3VuY2U6IHt9XG4gIH1cbn0pO1xuXG53b3JsZC5lbnRpdGllcy5pbnNlcnQoe1xuICBOYW1lOiB7IG5hbWU6ICdoZXJvMSd9LFxuICBTcHJpdGU6IHsgbmFtZTogJ2hlcm8nLCBjb2xvcjogJyMwMGYnIH0sXG4gIENvbGxpZGFibGU6IHt9LFxuICBCb3VuY2U6IHsgbWFzczogNzAwMCB9LFxuICBQb3NpdGlvbjogeyB4OiAwLCB5OiAwIH0sXG4gIFRocnVzdGVyOiB7IGRlbHRhVjogMTIwMCwgbWF4VjogNTAwLCBhY3RpdmU6IGZhbHNlIH0sXG4gIFNlZWtlcjogeyByYWRQZXJTZWM6IE1hdGguUEkgfSxcbiAgTW90aW9uOiB7fSxcbiAgQ2xpY2tDb3Vyc2U6IHsgc3RvcE9uQXJyaXZhbDogdHJ1ZSwgYWN0aXZlOiBmYWxzZSB9XG59KTtcblxuZnVuY3Rpb24gc3Bhd25Bc3Rlcm9pZCh4LCB5LCB3aWR0aCwgaGVpZ2h0LCBkeCwgZHksIGRyLCBtYXNzLCBoZWFsdGgpIHtcbiAgd29ybGQuZW50aXRpZXMuaW5zZXJ0KHtcbiAgICBTcHJpdGU6IHsgbmFtZTogJ2FzdGVyb2lkJywgc2l6ZTogd2lkdGh9LFxuICAgIEhlYWx0aDogeyBtYXg6IGhlYWx0aCB9LFxuICAgIENvbGxpZGFibGU6IHt9LFxuICAgIEJvdW5jZTogeyBtYXNzOiBtYXNzIH0sXG4gICAgUG9zaXRpb246IHsgeDogeCwgeTogeSB9LFxuICAgIE1vdGlvbjogeyBkeDogZHgsIGR5OiBkeSwgZHJvdGF0aW9uOiBkciB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzcGF3bkZpZWxkKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cz0zMDAsXG4gICAgTUFYX0FTVEVST0lEUz01MCwgTUFYX1RSSUVTPTUsIE1JTl9TSVpFPTIwLCBNQVhfU0laRT0yMDAsIE1BWF9HUkFWPTEwKSB7XG5cbiAgdmFyIHZDZW50ZXIgPSBuZXcgVmVjdG9yMkQoY2VudGVyWSwgY2VudGVyWCk7XG4gIHZhciB2U3Bhd24gPSBuZXcgVmVjdG9yMkQoMCwgMCk7XG4gIHZhciB2R3JhdiA9IG5ldyBWZWN0b3IyRCgwLCAwKTtcbiAgdmFyIGluRmllbGQgPSBbXTtcblxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBNQVhfQVNURVJPSURTOyBpZHgrKykge1xuICAgIGZvciAodmFyIGMgPSAwOyBjIDwgTUFYX1RSSUVTOyBjKyspIHtcblxuICAgICAgdmFyIHNpemUgPSAoKE1BWF9TSVpFIC0gTUlOX1NJWkUpICogTWF0aC5yYW5kb20oKSkgKyBNSU5fU0laRTtcbiAgICAgIHZhciByb3QgPSAoTWF0aC5QSSo0KSAqIE1hdGgucmFuZG9tKCk7XG4gICAgICB2U3Bhd24uc2V0VmFsdWVzKHZDZW50ZXIueCwgdkNlbnRlci55IC0gKCgocmFkaXVzIC0gMSkgKiBNYXRoLnJhbmRvbSgpKSArIDEpKTtcbiAgICAgIHZTcGF3bi5yb3RhdGVBcm91bmQodkNlbnRlciwgcm90KTtcblxuICAgICAgdmFyIGlzQ2xlYXIgPSB0cnVlO1xuICAgICAgZm9yICh2YXIgZmxkSWR4ID0gMDsgZmxkSWR4IDwgaW5GaWVsZC5sZW5ndGg7IGZsZElkeCsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gaW5GaWVsZFtmbGRJZHhdO1xuICAgICAgICBpZiAoTWF0aC5hYnModlNwYXduLnggLSBpdGVtLngpICogMiA+PSAoc2l6ZSArIGl0ZW0ud2lkdGgpICogMS4wMjUpIHsgY29udGludWU7IH1cbiAgICAgICAgaWYgKE1hdGguYWJzKHZTcGF3bi55IC0gaXRlbS55KSAqIDIgPj0gKHNpemUgKyBpdGVtLmhlaWdodCkgKiAxLjAyNSkgeyBjb250aW51ZTsgfVxuICAgICAgICBpc0NsZWFyID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaWYgKCFpc0NsZWFyKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgIGluRmllbGQucHVzaCh7IHg6IHZTcGF3bi54LCB5OiB2U3Bhd24ueSwgd2lkdGg6IHNpemUsIGhlaWdodDogc2l6ZSB9KTtcblxuICAgICAgdkdyYXYuc2V0VmFsdWVzKDAsIE1hdGgucmFuZG9tKCkgKiBNQVhfR1JBVik7XG4gICAgICB2R3Jhdi5yb3RhdGUocm90KTtcblxuICAgICAgc3Bhd25Bc3Rlcm9pZChcbiAgICAgICAgdlNwYXduLngsIHZTcGF3bi55LFxuICAgICAgICBzaXplLCBzaXplLFxuICAgICAgICB2R3Jhdi54LCB2R3Jhdi55LFxuICAgICAgICAoTWF0aC5QSSAqIDAuMjUpICogTWF0aC5yYW5kb20oKSxcbiAgICAgICAgNCAqIHNpemUgKiBzaXplLFxuICAgICAgICA0ICogc2l6ZSAqIHNpemVcbiAgICAgICk7XG5cbiAgICB9XG4gIH1cbn1cblxudmFyIHBvcyA9IDQ3MDtcbnZhciBzaXplID0gNDQwO1xudmFyIG51bSA9IDIwMDtcblxuc3Bhd25GaWVsZCgtcG9zLCAtcG9zLCBzaXplLCBudW0pO1xuc3Bhd25GaWVsZChwb3MsIHBvcywgc2l6ZSwgbnVtKTtcbnNwYXduRmllbGQocG9zLCAtcG9zLCBzaXplLCBudW0pO1xuc3Bhd25GaWVsZCgtcG9zLCBwb3MsIHNpemUsIG51bSk7XG5cbndvcmxkLnN0YXJ0KCk7XG5cbnZhciB2cFN5c3RlbSA9IHdvcmxkLmdldFN5c3RlbSgnQ2FudmFzVmlld3BvcnQnKTtcbnZhciBndWlTeXN0ZW0gPSB3b3JsZC5nZXRTeXN0ZW0oJ0RhdEd1aScpO1xudmFyIGd1aSA9IGd1aVN5c3RlbS5ndWk7XG5cbmd1aS5hZGQod29ybGQsICdpc1BhdXNlZCcpO1xuZ3VpLmFkZCh3b3JsZCwgJ2RlYnVnJyk7XG5ndWkuYWRkKHZwU3lzdGVtLCAnem9vbScsIHZwU3lzdGVtLm9wdGlvbnMuem9vbU1pbiwgdnBTeXN0ZW0ub3B0aW9ucy56b29tTWF4KS5saXN0ZW4oKTtcbmd1aS5hZGQodnBTeXN0ZW0sICdsaW5lV2lkdGgnLCAxLjAsIDQuMCkuc3RlcCgwLjUpLmxpc3RlbigpO1xuXG52YXIgbmFtZXMgPSBbICdncmlkRW5hYmxlZCcsICdmb2xsb3dFbmFibGVkJywgJ2NhbWVyYVgnLCAnY2FtZXJhWScgXTtcbm5hbWVzLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgZ3VpLmFkZCh2cFN5c3RlbSwgbmFtZSkubGlzdGVuKCk7XG59KTtcblxudmFyIGNwID0gdnBTeXN0ZW0uY3Vyc29yUG9zaXRpb247XG5ndWkuYWRkKGNwLCAneCcpLmxpc3RlbigpO1xuZ3VpLmFkZChjcCwgJ3knKS5saXN0ZW4oKTtcbiJdfQ==
