(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/lmorchard/devel/other/parsec-patrol/src/sketches/seeker/index.js":[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _core = require("core");

var Core = _interopRequireWildcard(_core);

require("plugins/name");

require("plugins/position");

require("plugins/motion");

require("plugins/thruster");

require("plugins/orbiter");

require("plugins/seeker");

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
      followName: 'orbiter1',
      zoom: 0.5
    },
    DrawStats: {},
    MemoryStats: {},
    DatGui: {},
    Motion: {},
    Orbiter: {},
    Thruster: {},
    Seeker: {}
  }
});

world.entities.insert({
  Name: { name: 'sun' },
  Sprite: { name: 'asteroid', size: 300 },
  Position: {},
  Motion: { dx: 0, dy: 0, drotation: Math.PI / 6 }
}, {
  Name: { name: 'orbiter1' },
  Sprite: { name: 'hero', color: '#00f' },
  Position: { x: 250, y: 250 },
  Orbiter: { name: 'sun' }
}, {
  Name: { name: 'chaser1' },
  Sprite: { name: 'enemyscout', color: '#f00' },
  Position: {},
  Motion: {},
  Thruster: { deltaV: 400, maxV: 175 },
  Seeker: { targetName: 'orbiter1', radPerSec: 0.9 }
}, {
  Name: { name: 'chaser2' },
  Sprite: { name: 'enemyscout', color: '#0f0' },
  Position: {},
  Motion: {},
  Thruster: { deltaV: 600, maxV: 400 },
  Seeker: { targetName: 'orbiter1', radPerSec: 2 }
});

world.start();

var vpSystem = world.getSystem('CanvasViewport');
var guiSystem = world.getSystem('DatGui');
var gui = guiSystem.gui;

gui.add(vpSystem, 'zoom', vpSystem.options.zoomMin, vpSystem.options.zoomMax).listen();

var names = ['debug', 'gridEnabled', 'cameraX', 'cameraY'];
names.forEach(function (name) {
  gui.add(vpSystem, name).listen();
});

},{"core":"core","plugins/canvasViewport":"plugins/canvasViewport","plugins/datGui":"plugins/datGui","plugins/drawStats":"plugins/drawStats","plugins/memoryStats":"plugins/memoryStats","plugins/motion":"plugins/motion","plugins/name":"plugins/name","plugins/orbiter":"plugins/orbiter","plugins/position":"plugins/position","plugins/seeker":"plugins/seeker","plugins/thruster":"plugins/thruster"}]},{},["/Users/lmorchard/devel/other/parsec-patrol/src/sketches/seeker/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbG1vcmNoYXJkL2RldmVsL290aGVyL3BhcnNlYy1wYXRyb2wvc3JjL3NrZXRjaGVzL3NlZWtlci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7b0JDQXNCLE1BQU07O0lBQWhCLElBQUk7O1FBRVQsY0FBYzs7UUFDZCxrQkFBa0I7O1FBQ2xCLGdCQUFnQjs7UUFDaEIsa0JBQWtCOztRQUNsQixpQkFBaUI7O1FBQ2pCLGdCQUFnQjs7UUFDaEIsd0JBQXdCOztRQUN4QixtQkFBbUI7O1FBQ25CLHFCQUFxQjs7UUFDckIsZ0JBQWdCOztBQUV2QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLElBQUksR0FBRyxHQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxBQUFDLENBQUM7O0FBRXhCLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztBQUN6QixTQUFPLEVBQUU7QUFDUCxrQkFBYyxFQUFFO0FBQ2QsV0FBSyxFQUFFLEtBQUs7QUFDWixlQUFTLEVBQUUsT0FBTztBQUNsQixZQUFNLEVBQUUsV0FBVztBQUNuQixnQkFBVSxFQUFFLFVBQVU7QUFDdEIsVUFBSSxFQUFFLEdBQUc7S0FDVjtBQUNELGFBQVMsRUFBRSxFQUFFO0FBQ2IsZUFBVyxFQUFFLEVBQUU7QUFDZixVQUFNLEVBQUUsRUFBRTtBQUNWLFVBQU0sRUFBRSxFQUFFO0FBQ1YsV0FBTyxFQUFFLEVBQUU7QUFDWCxZQUFRLEVBQUUsRUFBRTtBQUNaLFVBQU0sRUFBRSxFQUFFO0dBQ1g7Q0FDRixDQUFDLENBQUM7O0FBRUgsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDcEIsTUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztBQUNwQixRQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDdkMsVUFBUSxFQUFFLEVBQUU7QUFDWixRQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0NBQ2pELEVBQUU7QUFDRCxNQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDO0FBQ3pCLFFBQU0sRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUN2QyxVQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUU7QUFDNUIsU0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRTtDQUN6QixFQUFFO0FBQ0QsTUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBQztBQUN4QixRQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDN0MsVUFBUSxFQUFFLEVBQUU7QUFDWixRQUFNLEVBQUUsRUFBRTtBQUNWLFVBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRTtBQUNwQyxRQUFNLEVBQUUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUU7Q0FDbkQsRUFBRTtBQUNELE1BQUksRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUM7QUFDeEIsUUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQzdDLFVBQVEsRUFBRSxFQUFFO0FBQ1osUUFBTSxFQUFFLEVBQUU7QUFDVixVQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7QUFDcEMsUUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFO0NBQ2pELENBQUMsQ0FBQzs7QUFFSCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWQsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pELElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUMsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQzs7QUFFeEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7O0FBRXZGLElBQUksS0FBSyxHQUFHLENBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFFLENBQUM7QUFDN0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtBQUM1QixLQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztDQUNsQyxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgQ29yZSBmcm9tIFwiY29yZVwiO1xuXG5pbXBvcnQgXCJwbHVnaW5zL25hbWVcIjtcbmltcG9ydCBcInBsdWdpbnMvcG9zaXRpb25cIjtcbmltcG9ydCBcInBsdWdpbnMvbW90aW9uXCI7XG5pbXBvcnQgXCJwbHVnaW5zL3RocnVzdGVyXCI7XG5pbXBvcnQgXCJwbHVnaW5zL29yYml0ZXJcIjtcbmltcG9ydCBcInBsdWdpbnMvc2Vla2VyXCI7XG5pbXBvcnQgXCJwbHVnaW5zL2NhbnZhc1ZpZXdwb3J0XCI7XG5pbXBvcnQgXCJwbHVnaW5zL2RyYXdTdGF0c1wiO1xuaW1wb3J0IFwicGx1Z2lucy9tZW1vcnlTdGF0c1wiO1xuaW1wb3J0IFwicGx1Z2lucy9kYXRHdWlcIjtcblxudmFyIGRlYnVnID0gdHJ1ZTtcbnZhciBtb3ZlID0gMC4wNztcbnZhciByb3QgPSAoTWF0aC5QSSAvIDIpO1xuXG52YXIgd29ybGQgPSBuZXcgQ29yZS5Xb3JsZCh7XG4gIHN5c3RlbXM6IHtcbiAgICBDYW52YXNWaWV3cG9ydDoge1xuICAgICAgZGVidWc6IGRlYnVnLFxuICAgICAgY29udGFpbmVyOiAnI2dhbWUnLFxuICAgICAgY2FudmFzOiAnI3ZpZXdwb3J0JyxcbiAgICAgIGZvbGxvd05hbWU6ICdvcmJpdGVyMScsXG4gICAgICB6b29tOiAwLjVcbiAgICB9LFxuICAgIERyYXdTdGF0czoge30sXG4gICAgTWVtb3J5U3RhdHM6IHt9LFxuICAgIERhdEd1aToge30sXG4gICAgTW90aW9uOiB7fSxcbiAgICBPcmJpdGVyOiB7fSxcbiAgICBUaHJ1c3Rlcjoge30sXG4gICAgU2Vla2VyOiB7fVxuICB9XG59KTtcblxud29ybGQuZW50aXRpZXMuaW5zZXJ0KHtcbiAgTmFtZTogeyBuYW1lOiAnc3VuJ30sXG4gIFNwcml0ZTogeyBuYW1lOiAnYXN0ZXJvaWQnLCBzaXplOiAzMDAgfSxcbiAgUG9zaXRpb246IHt9LFxuICBNb3Rpb246IHsgZHg6IDAsIGR5OiAwLCBkcm90YXRpb246IE1hdGguUEkgLyA2IH1cbn0sIHtcbiAgTmFtZTogeyBuYW1lOiAnb3JiaXRlcjEnfSxcbiAgU3ByaXRlOiB7IG5hbWU6ICdoZXJvJywgY29sb3I6ICcjMDBmJyB9LFxuICBQb3NpdGlvbjogeyB4OiAyNTAsIHk6IDI1MCB9LFxuICBPcmJpdGVyOiB7IG5hbWU6ICdzdW4nIH1cbn0sIHtcbiAgTmFtZTogeyBuYW1lOiAnY2hhc2VyMSd9LFxuICBTcHJpdGU6IHsgbmFtZTogJ2VuZW15c2NvdXQnLCBjb2xvcjogJyNmMDAnIH0sXG4gIFBvc2l0aW9uOiB7fSxcbiAgTW90aW9uOiB7fSxcbiAgVGhydXN0ZXI6IHsgZGVsdGFWOiA0MDAsIG1heFY6IDE3NSB9LFxuICBTZWVrZXI6IHsgdGFyZ2V0TmFtZTogJ29yYml0ZXIxJywgcmFkUGVyU2VjOiAwLjkgfVxufSwge1xuICBOYW1lOiB7IG5hbWU6ICdjaGFzZXIyJ30sXG4gIFNwcml0ZTogeyBuYW1lOiAnZW5lbXlzY291dCcsIGNvbG9yOiAnIzBmMCcgfSxcbiAgUG9zaXRpb246IHt9LFxuICBNb3Rpb246IHt9LFxuICBUaHJ1c3RlcjogeyBkZWx0YVY6IDYwMCwgbWF4VjogNDAwIH0sXG4gIFNlZWtlcjogeyB0YXJnZXROYW1lOiAnb3JiaXRlcjEnLCByYWRQZXJTZWM6IDIgfVxufSk7XG5cbndvcmxkLnN0YXJ0KCk7XG5cbnZhciB2cFN5c3RlbSA9IHdvcmxkLmdldFN5c3RlbSgnQ2FudmFzVmlld3BvcnQnKTtcbnZhciBndWlTeXN0ZW0gPSB3b3JsZC5nZXRTeXN0ZW0oJ0RhdEd1aScpO1xudmFyIGd1aSA9IGd1aVN5c3RlbS5ndWk7XG5cbmd1aS5hZGQodnBTeXN0ZW0sICd6b29tJywgdnBTeXN0ZW0ub3B0aW9ucy56b29tTWluLCB2cFN5c3RlbS5vcHRpb25zLnpvb21NYXgpLmxpc3RlbigpO1xuXG52YXIgbmFtZXMgPSBbICdkZWJ1ZycsICdncmlkRW5hYmxlZCcsICdjYW1lcmFYJywgJ2NhbWVyYVknIF07XG5uYW1lcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gIGd1aS5hZGQodnBTeXN0ZW0sIG5hbWUpLmxpc3RlbigpO1xufSk7XG4iXX0=
