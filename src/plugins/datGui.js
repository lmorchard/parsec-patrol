import * as Entities from "../entities"
import * as Components from "../components";
import * as Systems from "../systems";

import dat from "dat-gui";

export class DatGui extends Systems.System {

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
Systems.register('DatGui', DatGui);
