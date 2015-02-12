import * as Core from "../../core"

import "../../plugins/position"
import "../../plugins/thruster"
import "../../plugins/orbiter"
import "../../plugins/motion"
import "../../plugins/canvasViewport"
import "../../plugins/drawStats"

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
var rot = (Math.PI / 1) / 1000;

world.entities.insert({
  Name: { name: 'sun'},
  Position: {},
  Motion: { dx: 0, dy: 0, drotation: rot },
  Thruster: { deltaV: 0.1 / 1000, maxV: 1 }
});

world.start();
