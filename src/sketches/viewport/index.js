import * as World from "../../world"
import * as Systems from "../../systems"
import * as Components from "../../components"
import * as Entities from "../../entities"

import "../../plugins/position"
import "../../plugins/orbiter"
import "../../plugins/motion"
import "../../plugins/health"
import "../../plugins/canvasViewport"
import "../../plugins/drawStats"
import "../../plugins/datGui"

var world = new World.World({
  systems: {
    CanvasViewport: {
      container: '#game',
      canvas: '#viewport'
    },
    DatGui: {},
    DrawStats: {},
    Motion: {},
    Orbiter: {}
  }
});

var move = 0.07;
var rot = (Math.PI / 2) / 1000;

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
}, {
  Name: { name: 'delta'},
  Position: {},
  Motion: { dx: move, dy: -move, drotation: -rot}
}, {
  Name: { name: 'gamma'},
  Position: {},
  Motion: { dx: -move, dy: move, drotation: -rot}
});

world.start();
