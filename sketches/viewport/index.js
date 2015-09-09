(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/lmorchard/devel/other/parsec-patrol/src/sketches/viewport/index.js":[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/name");

require("plugins/position");

require("plugins/orbiter");

require("plugins/motion");

require("plugins/health");

require("plugins/canvasViewport");

require("plugins/drawStats");

require("plugins/memoryStats");

require("plugins/datGui");

var move = 70;
var rot = Math.PI / 2;

var world = new Core.World({
  systems: {
    CanvasViewport: {
      container: '#game',
      canvas: '#viewport'
    },
    DrawStats: {},
    MemoryStats: {},
    DatGui: {},
    Motion: {},
    Orbiter: {}
  }
});

world.entities.insert({
  Name: { name: 'sun' },
  Position: {}
}, {
  Name: { name: 'alpha' },
  Position: { x: 250, y: 250 },
  Orbiter: { name: 'sun' }
}, {
  Name: { name: 'beta' },
  Position: { x: -250, y: -250 },
  Orbiter: { name: 'sun' }
}, {
  Name: { name: 'theta' },
  Position: { x: -250, y: 250 },
  Orbiter: { name: 'sun' }
}, {
  Name: { name: 'whatever' },
  Position: { x: 250, y: -250 },
  Orbiter: { name: 'sun' }
} /*, {
   Name: { name: 'delta'},
   Position: {},
   Motion: { dx: move, dy: -move, drotation: -rot}
  }, {
   Name: { name: 'gamma'},
   Position: {},
   Motion: { dx: -move, dy: move, drotation: -rot}
  }*/);

world.start();

},{"core":"core","plugins/canvasViewport":"plugins/canvasViewport","plugins/datGui":"plugins/datGui","plugins/drawStats":"plugins/drawStats","plugins/health":"plugins/health","plugins/memoryStats":"plugins/memoryStats","plugins/motion":"plugins/motion","plugins/name":"plugins/name","plugins/orbiter":"plugins/orbiter","plugins/position":"plugins/position"}]},{},["/Users/lmorchard/devel/other/parsec-patrol/src/sketches/viewport/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbG1vcmNoYXJkL2RldmVsL290aGVyL3BhcnNlYy1wYXRyb2wvc3JjL3NrZXRjaGVzL3ZpZXdwb3J0L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztvQkNBc0IsTUFBTTs7SUFBaEIsSUFBSTs7UUFFVCxjQUFjOztRQUNkLGtCQUFrQjs7UUFDbEIsaUJBQWlCOztRQUNqQixnQkFBZ0I7O1FBQ2hCLGdCQUFnQjs7UUFDaEIsd0JBQXdCOztRQUN4QixtQkFBbUI7O1FBQ25CLHFCQUFxQjs7UUFDckIsZ0JBQWdCOztBQUV2QixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZCxJQUFJLEdBQUcsR0FBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQUFBQyxDQUFDOztBQUV4QixJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekIsU0FBTyxFQUFFO0FBQ1Asa0JBQWMsRUFBRTtBQUNkLGVBQVMsRUFBRSxPQUFPO0FBQ2xCLFlBQU0sRUFBRSxXQUFXO0tBQ3BCO0FBQ0QsYUFBUyxFQUFFLEVBQUU7QUFDYixlQUFXLEVBQUUsRUFBRTtBQUNmLFVBQU0sRUFBRSxFQUFFO0FBQ1YsVUFBTSxFQUFFLEVBQUU7QUFDVixXQUFPLEVBQUUsRUFBRTtHQUNaO0NBQ0YsQ0FBQyxDQUFDOztBQUVILEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQ3BCLE1BQUksRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7QUFDcEIsVUFBUSxFQUFFLEVBQUU7Q0FDYixFQUFFO0FBQ0QsTUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQztBQUN0QixVQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7QUFDNUIsU0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtDQUN6QixFQUFFO0FBQ0QsTUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBQztBQUNyQixVQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFO0FBQzlCLFNBQU8sRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7Q0FDekIsRUFBRTtBQUNELE1BQUksRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUM7QUFDdEIsVUFBUSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7QUFDN0IsU0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtDQUN6QixFQUFFO0FBQ0QsTUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQztBQUN6QixVQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRTtBQUM3QixTQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFO0NBQ3pCOzs7Ozs7OztNQVFHLENBQUM7O0FBRUwsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIENvcmUgZnJvbSBcImNvcmVcIjtcblxuaW1wb3J0IFwicGx1Z2lucy9uYW1lXCI7XG5pbXBvcnQgXCJwbHVnaW5zL3Bvc2l0aW9uXCI7XG5pbXBvcnQgXCJwbHVnaW5zL29yYml0ZXJcIjtcbmltcG9ydCBcInBsdWdpbnMvbW90aW9uXCI7XG5pbXBvcnQgXCJwbHVnaW5zL2hlYWx0aFwiO1xuaW1wb3J0IFwicGx1Z2lucy9jYW52YXNWaWV3cG9ydFwiO1xuaW1wb3J0IFwicGx1Z2lucy9kcmF3U3RhdHNcIjtcbmltcG9ydCBcInBsdWdpbnMvbWVtb3J5U3RhdHNcIjtcbmltcG9ydCBcInBsdWdpbnMvZGF0R3VpXCI7XG5cbnZhciBtb3ZlID0gNzA7XG52YXIgcm90ID0gKE1hdGguUEkgLyAyKTtcblxudmFyIHdvcmxkID0gbmV3IENvcmUuV29ybGQoe1xuICBzeXN0ZW1zOiB7XG4gICAgQ2FudmFzVmlld3BvcnQ6IHtcbiAgICAgIGNvbnRhaW5lcjogJyNnYW1lJyxcbiAgICAgIGNhbnZhczogJyN2aWV3cG9ydCdcbiAgICB9LFxuICAgIERyYXdTdGF0czoge30sXG4gICAgTWVtb3J5U3RhdHM6IHt9LFxuICAgIERhdEd1aToge30sXG4gICAgTW90aW9uOiB7fSxcbiAgICBPcmJpdGVyOiB7fVxuICB9XG59KTtcblxud29ybGQuZW50aXRpZXMuaW5zZXJ0KHtcbiAgTmFtZTogeyBuYW1lOiAnc3VuJ30sXG4gIFBvc2l0aW9uOiB7fVxufSwge1xuICBOYW1lOiB7IG5hbWU6ICdhbHBoYSd9LFxuICBQb3NpdGlvbjogeyB4OiAyNTAsIHk6IDI1MCB9LFxuICBPcmJpdGVyOiB7IG5hbWU6ICdzdW4nIH1cbn0sIHtcbiAgTmFtZTogeyBuYW1lOiAnYmV0YSd9LFxuICBQb3NpdGlvbjogeyB4OiAtMjUwLCB5OiAtMjUwIH0sXG4gIE9yYml0ZXI6IHsgbmFtZTogJ3N1bicgfVxufSwge1xuICBOYW1lOiB7IG5hbWU6ICd0aGV0YSd9LFxuICBQb3NpdGlvbjogeyB4OiAtMjUwLCB5OiAyNTAgfSxcbiAgT3JiaXRlcjogeyBuYW1lOiAnc3VuJyB9XG59LCB7XG4gIE5hbWU6IHsgbmFtZTogJ3doYXRldmVyJ30sXG4gIFBvc2l0aW9uOiB7IHg6IDI1MCwgeTogLTI1MCB9LFxuICBPcmJpdGVyOiB7IG5hbWU6ICdzdW4nIH1cbn0vKiwge1xuICBOYW1lOiB7IG5hbWU6ICdkZWx0YSd9LFxuICBQb3NpdGlvbjoge30sXG4gIE1vdGlvbjogeyBkeDogbW92ZSwgZHk6IC1tb3ZlLCBkcm90YXRpb246IC1yb3R9XG59LCB7XG4gIE5hbWU6IHsgbmFtZTogJ2dhbW1hJ30sXG4gIFBvc2l0aW9uOiB7fSxcbiAgTW90aW9uOiB7IGR4OiAtbW92ZSwgZHk6IG1vdmUsIGRyb3RhdGlvbjogLXJvdH1cbn0qLyk7XG5cbndvcmxkLnN0YXJ0KCk7XG4iXX0=
