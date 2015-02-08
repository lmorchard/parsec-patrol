import * as World from "../../world"
import * as Systems from "../../systems"
import * as Components from "../../components"
import * as Entities from "../../entities"

import "../../plugins/position"
import "../../plugins/motion"
import "../../plugins/health"
import "../../plugins/canvasViewport"
import "../../plugins/drawStats"

var world = new World.World({
  systems: {
    CanvasViewport: {
      container: '#game',
      canvas: '#viewport'
    },
    DrawStats: { },
    Motion: { }
  }
});

var rot = (Math.PI / 2) / 1000;

world.entities.insert({
  Name: { name: 'alpha'},
  Position: {},
  Motion: { dx: 0.1, dy: 0.1, drotation: rot}
});

world.entities.insert({
  Name: { name: 'beta'},
  Position: {},
  Motion: { dx: -0.1, dy: -0.1, drotation: -rot}
});

world.entities.insert({
  Name: { name: 'delta'},
  Position: {},
  Motion: { dx: 0.1, dy: -0.1, drotation: rot}
});

world.entities.insert({
  Name: { name: 'gamma'},
  Position: {},
  Motion: { dx: -0.1, dy: 0.1, drotation: -rot}
});

world.start();
