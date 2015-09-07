import * as Core from "core";

import dat from "dat-gui";

export class DatGui extends Core.System {

  initialize() {
    var gui = this.gui = new dat.GUI();
  }

}
Core.registerSystem('DatGui', DatGui);
