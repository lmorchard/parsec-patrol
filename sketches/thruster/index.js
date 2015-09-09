(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/lmorchard/devel/other/parsec-patrol/src/sketches/thruster/index.js":[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/name");

require("plugins/position");

require("plugins/thruster");

require("plugins/orbiter");

require("plugins/motion");

require("plugins/canvasViewport");

require("plugins/drawStats");

var world = new Core.World({
  systems: {
    CanvasViewport: {
      container: '#game',
      canvas: '#viewport'
    },
    DrawStats: {},
    Motion: {},
    Orbiter: {},
    Thruster: {}
  }
});

var move = 0.07;
var rot = Math.PI / 1;

world.entities.insert({
  Name: { name: 'sun' },
  Position: {},
  Motion: { dx: 0, dy: 0, drotation: rot },
  Thruster: { deltaV: 0.1, maxV: 1 }
});

world.start();

},{"core":"core","plugins/canvasViewport":"plugins/canvasViewport","plugins/drawStats":"plugins/drawStats","plugins/motion":"plugins/motion","plugins/name":"plugins/name","plugins/orbiter":"plugins/orbiter","plugins/position":"plugins/position","plugins/thruster":"plugins/thruster"}]},{},["/Users/lmorchard/devel/other/parsec-patrol/src/sketches/thruster/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbG1vcmNoYXJkL2RldmVsL290aGVyL3BhcnNlYy1wYXRyb2wvc3JjL3NrZXRjaGVzL3RocnVzdGVyL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztvQkNBc0IsTUFBTTs7SUFBaEIsSUFBSTs7UUFFVCxjQUFjOztRQUNkLGtCQUFrQjs7UUFDbEIsa0JBQWtCOztRQUNsQixpQkFBaUI7O1FBQ2pCLGdCQUFnQjs7UUFDaEIsd0JBQXdCOztRQUN4QixtQkFBbUI7O0FBRTFCLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN6QixTQUFPLEVBQUU7QUFDUCxrQkFBYyxFQUFFO0FBQ2QsZUFBUyxFQUFFLE9BQU87QUFDbEIsWUFBTSxFQUFFLFdBQVc7S0FDcEI7QUFDRCxhQUFTLEVBQUUsRUFBRTtBQUNiLFVBQU0sRUFBRSxFQUFFO0FBQ1YsV0FBTyxFQUFFLEVBQUU7QUFDWCxZQUFRLEVBQUUsRUFBRTtHQUNiO0NBQ0YsQ0FBQyxDQUFDOztBQUVILElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixJQUFJLEdBQUcsR0FBSSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQUFBQyxDQUFDOztBQUV4QixLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUNwQixNQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0FBQ3BCLFVBQVEsRUFBRSxFQUFFO0FBQ1osUUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUU7QUFDeEMsVUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFO0NBQ25DLENBQUMsQ0FBQzs7QUFFSCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgQ29yZSBmcm9tIFwiY29yZVwiO1xuXG5pbXBvcnQgXCJwbHVnaW5zL25hbWVcIjtcbmltcG9ydCBcInBsdWdpbnMvcG9zaXRpb25cIjtcbmltcG9ydCBcInBsdWdpbnMvdGhydXN0ZXJcIjtcbmltcG9ydCBcInBsdWdpbnMvb3JiaXRlclwiO1xuaW1wb3J0IFwicGx1Z2lucy9tb3Rpb25cIjtcbmltcG9ydCBcInBsdWdpbnMvY2FudmFzVmlld3BvcnRcIjtcbmltcG9ydCBcInBsdWdpbnMvZHJhd1N0YXRzXCI7XG5cbnZhciB3b3JsZCA9IG5ldyBDb3JlLldvcmxkKHtcbiAgc3lzdGVtczoge1xuICAgIENhbnZhc1ZpZXdwb3J0OiB7XG4gICAgICBjb250YWluZXI6ICcjZ2FtZScsXG4gICAgICBjYW52YXM6ICcjdmlld3BvcnQnXG4gICAgfSxcbiAgICBEcmF3U3RhdHM6IHt9LFxuICAgIE1vdGlvbjoge30sXG4gICAgT3JiaXRlcjoge30sXG4gICAgVGhydXN0ZXI6IHt9XG4gIH1cbn0pO1xuXG52YXIgbW92ZSA9IDAuMDc7XG52YXIgcm90ID0gKE1hdGguUEkgLyAxKTtcblxud29ybGQuZW50aXRpZXMuaW5zZXJ0KHtcbiAgTmFtZTogeyBuYW1lOiAnc3VuJ30sXG4gIFBvc2l0aW9uOiB7fSxcbiAgTW90aW9uOiB7IGR4OiAwLCBkeTogMCwgZHJvdGF0aW9uOiByb3QgfSxcbiAgVGhydXN0ZXI6IHsgZGVsdGFWOiAwLjEsIG1heFY6IDEgfVxufSk7XG5cbndvcmxkLnN0YXJ0KCk7XG4iXX0=
