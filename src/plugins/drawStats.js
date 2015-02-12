import * as Core from "../core";

import Stats from "stats-js";

export class DrawStats extends Core.System {

  initialize() {
    this.stats = new Stats();
    this.stats.setMode(0);
    document.body.appendChild(this.stats.domElement);
  }

  drawStart(timeDelta) { this.stats.begin(); }

  drawEnd(timeDelta) { this.stats.end(); }

}
Core.registerSystem('DrawStats', DrawStats);
