import * as Core from "core";

import Stats from "stats-js";

export class DrawStats extends Core.System {

  initialize() {

    this.drawStats = new Stats();
    this.drawStats.setMode(0);
    this.drawStats.domElement.style.position = 'absolute';
    this.drawStats.domElement.style.left = '0px';
    this.drawStats.domElement.style.top = '0px';
    document.body.appendChild(this.drawStats.domElement);

    this.tickStats = new Stats();
    this.tickStats.setMode(0);
    this.tickStats.domElement.style.position = 'absolute';
    this.tickStats.domElement.style.left = '0px';
    this.tickStats.domElement.style.top = '55px';
    document.body.appendChild(this.tickStats.domElement);

  }

  updateStart(timeDelta) { this.tickStats.begin(); }

  updateEnd(timeDelta) { this.tickStats.end(); }

  drawStart(timeDelta) { this.drawStats.begin(); }

  drawEnd(timeDelta) { this.drawStats.end(); }

}
Core.registerSystem('DrawStats', DrawStats);
