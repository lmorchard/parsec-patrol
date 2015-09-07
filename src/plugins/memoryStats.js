import * as Core from "core";

import MemoryStats from "memory-stats";

export class MemoryStatsSystem extends Core.System {

  initialize() {
    this.stats = new MemoryStats();
    this.stats.domElement.style.position = 'fixed';
    this.stats.domElement.style.left = '85px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild(this.stats.domElement);
  }

  draw(timeDelta) { this.stats.update(); }

}
Core.registerSystem('MemoryStats', MemoryStatsSystem);
