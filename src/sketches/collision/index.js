import * as Core from "../../core";

import "../../plugins/drawStats";
import "../../plugins/memoryStats";
import "../../plugins/datGui";
import "../../plugins/canvasViewport";
import "../../plugins/name";
import "../../plugins/position";
import "../../plugins/motion";
import "../../plugins/thruster";
import "../../plugins/seeker";
import "../../plugins/clickCourse";
import "../../plugins/collision";

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
    Collision: {},
    Motion: {},
    ClickCourse: {},
    Thruster: {},
    Seeker: {}
  }
});

world.entities.insert({
  Name: { name: 'hero1'},
  Sprite: { name: 'hero', color: '#00f' },
  Collidable: {},
  Position: { x: 250, y: 250 },
  Thruster: { deltaV: 1200, maxV: 500, active: false },
  Seeker: { radPerSec: Math.PI },
  Motion: {},
  ClickCourse: { stopOnArrival: true, active: false }
});

for (var idx = 0; idx < 200; idx++) {
  world.entities.insert({
    Name: { name: 'rock' + idx},
    Sprite: { name: 'asteroid', size: 100 },
    Collidable: {},
    Position: {
      x: (Math.random() * 4000) - 2000,
      y: (Math.random() * 4000) - 2000
    },
    Motion: {
      dx: 0, dy: 0,
      drotation: Math.random() * (Math.PI * 2)
    }
  });
}

world.start();

var vpSystem = world.getSystem('CanvasViewport');
var guiSystem = world.getSystem('DatGui');
var gui = guiSystem.gui;

gui.add(world, 'isPaused');
gui.add(vpSystem, 'zoom', vpSystem.options.zoomMin, vpSystem.options.zoomMax).listen();
gui.add(vpSystem, 'lineWidth', 1.0, 4.0).step(0.5).listen();

var names = [
  'debug', 'gridEnabled', 'followEnabled',
  'cameraX', 'cameraY',
  'cursorX', 'cursorY'
];
names.forEach(function (name) {
  gui.add(vpSystem, name).listen();
});
