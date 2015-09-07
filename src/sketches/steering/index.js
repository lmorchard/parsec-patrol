import * as Core from "../../core";

import _ from "lodash";
import Vector2D from "../../lib/Vector2D";

import "../../plugins/drawStats";
import "../../plugins/memoryStats";
import "../../plugins/datGui";
import "../../plugins/expiration";
import "../../plugins/canvasViewport";
import "../../plugins/name";
import "../../plugins/health";
import "../../plugins/position";
import "../../plugins/motion";
import "../../plugins/thruster";
import "../../plugins/seeker";
import "../../plugins/steering";
import "../../plugins/clickCourse";
import "../../plugins/collision";
import "../../plugins/bounce";

var debug = true;
var move = 0.07;
var rot = (Math.PI / 2);

var world = window.world = new Core.World({
  systems: {
    CanvasViewport: {
      debug: debug,
      container: '#game',
      canvas: '#viewport',
      // followName: 'hero1',
      zoom: 0.5
    },
    Expiration: {},
    DrawStats: {},
    MemoryStats: {},
    DatGui: {},
    Motion: {},
    Thruster: {},
    Seeker: {},
    Steering: {
      debug: true
    },
    ClickCourse: {},
    Collision: {},
    Bounce: {}
  }
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
    MAX_ASTEROIDS=50, MAX_TRIES=5, MIN_SIZE=40, MAX_SIZE=200, MAX_GRAV=10) {

  var vCenter = new Vector2D(centerY, centerX);
  var vSpawn = new Vector2D(0, 0);
  var vGrav = new Vector2D(0, 0);
  var inField = [];

  for (var idx = 0; idx < MAX_ASTEROIDS; idx++) {
    for (var c = 0; c < MAX_TRIES; c++) {

      var size = _.random(MIN_SIZE, MAX_SIZE);
      var rot = (Math.PI*4) * Math.random();
      vSpawn.setValues(vCenter.x, vCenter.y - _.random(1, radius));
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
      break;

    }
  }
}

spawnField(-450, -450, 200, 25);
spawnField(-450,  450, 200, 25);
spawnField(0, 0, 200, 25);
spawnField(450, -450, 200, 25);
spawnField(450,  450, 200, 25);

var maxEnemies = 7;
var ttl = 20;

function spawnEnemy() {
  setTimeout(() => {
    var x = -1400;
    var y = 1500 * Math.random() - 750;
    world.entities.insert({
      Sprite: { name: 'enemyscout', color: '#f00', size: 40 },
      Collidable: {},
      Bounce: { mass: 2500 },
      Position: { x: x, y: y },
      Thruster: { deltaV: 1200, maxV: 500, active: true },
      // Seeker: { radPerSec: Math.PI, targetName: 'hero1' },
      Steering: { radPerSec: Math.PI * 1, seekTargetName: 'hero1' },
      Motion: {},
      Expiration: { ttl: ttl }
    });
  }, ttl * 1000 * Math.random());
}

for (var idx = 0; idx < maxEnemies; idx++) {
  spawnEnemy();
}

world.subscribe(Core.Messages.ENTITY_DESTROY, function (msg, data) {
  spawnEnemy();
});

world.entities.insert({
  Name: { name: 'hero1'},
  Sprite: { name: 'hero', color: '#0f0' },
  Collidable: {},
  Bounce: { mass: 700000 },
  Position: { x: 1100, y: 0 },
  Thruster: { deltaV: 1200, maxV: 500, active: false },
  Seeker: { radPerSec: Math.PI },
  Motion: {},
  ClickCourse: { stopOnArrival: true, active: false }
});

world.start();

var guiSystem = world.getSystem('DatGui');
var gui = guiSystem.gui;

var guiWorld = gui.addFolder('World');
guiWorld.open();
guiWorld.add(world, 'isPaused');
guiWorld.add(world, 'debug');

var vpSystem = world.getSystem('CanvasViewport');
var guiViewport = gui.addFolder('Viewport');
guiViewport.open();
guiViewport.add(vpSystem, 'zoom', vpSystem.options.zoomMin, vpSystem.options.zoomMax).listen();
guiViewport.add(vpSystem, 'lineWidth', 1.0, 4.0).step(0.5).listen();

var names = [ 'gridEnabled', 'followEnabled', 'cameraX', 'cameraY' ];
names.forEach(function (name) {
  guiViewport.add(vpSystem, name).listen();
});

var collisionSystem = world.getSystem('Collision');
var guiCollision = gui.addFolder('Collision');
guiCollision.open();
guiCollision.add(collisionSystem, 'debug');

var steeringSystem = world.getSystem('Steering');
var guiSteering = gui.addFolder('Steering');
guiSteering.open();
guiSteering.add(steeringSystem, 'debug');
