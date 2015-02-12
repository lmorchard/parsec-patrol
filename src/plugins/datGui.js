import * as Core from "../core";

import dat from "dat-gui";

export class DatGui extends Core.System {

  initialize() {
    var gui = this.gui = new dat.GUI();
    var text = {
      message: 'foo',
      speed: 0,
      displayOutline: true,
      explode: true
    };
    gui.add(text, 'message');
    gui.add(text, 'speed', -5, 5);
    gui.add(text, 'displayOutline');
    gui.add(text, 'explode');
  }

}
Core.registerSystem('DatGui', DatGui);
