import * as Core from "core";

import Vector2D from "Vector2D";

import "plugins/drawStats";
import "plugins/memoryStats";
import "plugins/datGui";
import "plugins/canvasViewport";
import "plugins/name";
import "plugins/health";
import "plugins/position";
import "plugins/motion";
import "plugins/thruster";
import "plugins/seeker";
import "plugins/clickCourse";
import "plugins/collision";
import "plugins/bounce";

var debug = true;
var move = 0.07;
var rot = (Math.PI / 2);

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
  Name: { name: 'hero1'},
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
    Sprite: { name: 'asteroid', size: width},
    Health: { max: health },
    Collidable: {},
    Bounce: { mass: mass },
    Position: { x: x, y: y },
    Motion: { dx: dx, dy: dy, drotation: dr }
  });
}

function spawnField(centerX, centerY, radius=300,
    MAX_ASTEROIDS=50, MAX_TRIES=5, MIN_SIZE=20, MAX_SIZE=200, MAX_GRAV=10) {

  var vCenter = new Vector2D(centerY, centerX);
  var vSpawn = new Vector2D(0, 0);
  var vGrav = new Vector2D(0, 0);
  var inField = [];

  for (var idx = 0; idx < MAX_ASTEROIDS; idx++) {
    for (var c = 0; c < MAX_TRIES; c++) {

      var size = ((MAX_SIZE - MIN_SIZE) * Math.random()) + MIN_SIZE;
      var rot = (Math.PI*4) * Math.random();
      vSpawn.setValues(vCenter.x, vCenter.y - (((radius - 1) * Math.random()) + 1));
      vSpawn.rotateAround(vCenter, rot);

      var isClear = true;
      for (var fldIdx = 0; fldIdx < inField.length; fldIdx++) {
        var item = inField[fldIdx];
        if (Math.abs(vSpawn.x - item.x) * 2 >= (size + item.width) * 1.025) { continue; }
        if (Math.abs(vSpawn.y - item.y) * 2 >= (size + item.height) * 1.025) { continue; }
        isClear = false;
        break;
      }
      if (!isClear) { continue; }

      inField.push({ x: vSpawn.x, y: vSpawn.y, width: size, height: size });

      vGrav.setValues(0, Math.random() * MAX_GRAV);
      vGrav.rotate(rot);

      spawnAsteroid(
        vSpawn.x, vSpawn.y,
        size, size,
        vGrav.x, vGrav.y,
        (Math.PI * 0.25) * Math.random(),
        4 * size * size,
        4 * size * size
      );

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

var names = [ 'gridEnabled', 'followEnabled', 'cameraX', 'cameraY' ];
names.forEach(function (name) {
  gui.add(vpSystem, name).listen();
});

var cp = vpSystem.cursorPosition;
gui.add(cp, 'x').listen();
gui.add(cp, 'y').listen();
