import * as Entities from "../entities"
import * as Components from "../components";
import * as Systems from "../systems";

import Stats from "stats-js";

export class DrawStats extends Systems.System {

  initialize() {
    this.stats = new Stats();
    this.stats.setMode(0);
    document.body.appendChild(this.stats.domElement);
  }

  drawStart(timeDelta) { this.stats.begin(); }

  drawEnd(timeDelta) { this.stats.end(); }

}
Systems.register('DrawStats', DrawStats);
