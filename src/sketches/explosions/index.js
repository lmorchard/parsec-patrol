import * as Core from "../../core";

import Vector2D from "../../lib/Vector2D";

import "../../plugins/drawStats";
import "../../plugins/memoryStats";
import "../../plugins/datGui";
import "../../plugins/canvasViewport";
import "../../plugins/name";
import "../../plugins/position";
import "../../plugins/expiration";

var debug = true;
var move = 0.07;
var rot = (Math.PI / 2);

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
    DatGui: {},
  }
});

var ttl = 0.75;
var dist = 1750;
var splosions = 50;

var colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];

function spawnExplosion () {
  setTimeout(() => {
    var x = ( Math.random() * dist ) - (dist / 2);
    var y = ( Math.random() * dist ) - (dist / 2);
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

var names = [ 'gridEnabled', 'followEnabled', 'cameraX', 'cameraY' ];
names.forEach(function (name) {
  gui.add(vpSystem, name).listen();
});

var cp = vpSystem.cursorPosition;
gui.add(cp, 'x').listen();
gui.add(cp, 'y').listen();
