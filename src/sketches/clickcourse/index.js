import * as Core from "core";

import "plugins/name";
import "plugins/position";
import "plugins/motion";
import "plugins/thruster";
import "plugins/seeker";
import "plugins/clickCourse";
import "plugins/canvasViewport";
import "plugins/drawStats";
import "plugins/memoryStats";
import "plugins/datGui";

var debug = true;
var move = 0.07;
var rot = (Math.PI / 2);

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
  Name: { name: 'hero1'},
  Sprite: { name: 'hero', color: '#00f' },
  Position: { x: 250, y: 250 },
  Thruster: { deltaV: 1200, maxV: 500, active: false },
  Seeker: { radPerSec: Math.PI },
  Motion: {},
  ClickCourse: { stopOnArrival: true, active: false }
}, {
  Name: { name: 'sun'},
  Sprite: { name: 'asteroid', size: 300 },
  Position: {},
  Motion: { dx: 0, dy: 0, drotation: Math.PI / 6 }
}, {
  Name: { name: 'chaser1'},
  Sprite: { name: 'enemyscout', color: '#f00' },
  Position: {},
  Motion: {},
  Thruster: { deltaV: 400, maxV: 175 },
  Seeker: { targetName: 'hero1', radPerSec: 0.9 }
}, {
  Name: { name: 'chaser2'},
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

var names = [ 'debug', 'gridEnabled', 'followEnabled', 'cameraX', 'cameraY' ];
names.forEach(function (name) {
  gui.add(vpSystem, name).listen();
});

var cp = vpSystem.cursorPosition;
gui.add(cp, 'x').listen();
gui.add(cp, 'y').listen();
