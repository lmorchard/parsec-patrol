import * as Core from "../../core";

import "../../plugins/name";
import "../../plugins/position";
import "../../plugins/motion";
import "../../plugins/thruster";
import "../../plugins/orbiter";
import "../../plugins/seeker";
import "../../plugins/canvasViewport";
import "../../plugins/drawStats";
import "../../plugins/memoryStats";

var move = 0.07;
var rot = (Math.PI / 2);

var world = new Core.World({
  systems: {
    CanvasViewport: { container: '#game', canvas: '#viewport' },
    DrawStats: {},
    MemoryStats: {},
    Motion: {},
    Orbiter: {},
    Thruster: {},
    Seeker: {}
  }
});

world.entities.insert({
  Name: { name: 'sun'},
  Position: {}
}, {
  Name: { name: 'alpha'},
  Position: { x: 250, y: 250 },
  Orbiter: { name: 'sun' }
}, {
  Name: { name: 'chaser1'},
  Position: {},
  Motion: {},
  Thruster: { deltaV: 400, maxV: 175 },
  Seeker: { targetName: 'alpha', radPerSec: 0.9 }
}, {
  Name: { name: 'chaser2'},
  Position: {},
  Motion: {},
  Thruster: { deltaV: 600, maxV: 400 },
  Seeker: { targetName: 'alpha', radPerSec: 2 }
});

world.start();
