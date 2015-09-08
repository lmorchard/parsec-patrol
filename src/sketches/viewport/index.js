import * as Core from "core";

import "plugins/name";
import "plugins/position";
import "plugins/orbiter";
import "plugins/motion";
import "plugins/health";
import "plugins/canvasViewport";
import "plugins/drawStats";
import "plugins/memoryStats";
import "plugins/datGui";

var move = 70;
var rot = (Math.PI / 2);

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
  Name: { name: 'sun'},
  Position: {}
}, {
  Name: { name: 'alpha'},
  Position: { x: 250, y: 250 },
  Orbiter: { name: 'sun' }
}, {
  Name: { name: 'beta'},
  Position: { x: -250, y: -250 },
  Orbiter: { name: 'sun' }
}, {
  Name: { name: 'theta'},
  Position: { x: -250, y: 250 },
  Orbiter: { name: 'sun' }
}, {
  Name: { name: 'whatever'},
  Position: { x: 250, y: -250 },
  Orbiter: { name: 'sun' }
}/*, {
  Name: { name: 'delta'},
  Position: {},
  Motion: { dx: move, dy: -move, drotation: -rot}
}, {
  Name: { name: 'gamma'},
  Position: {},
  Motion: { dx: -move, dy: move, drotation: -rot}
}*/);

world.start();
