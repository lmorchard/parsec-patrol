import * as Entities from "../entities"
import * as Components from "../components";
import * as Systems from "../systems";

export class Position extends Components.Component {
  static defaults() {
    return { x: 0, y: 0, rotation: 0 };
  }
}
Components.register('Position', Position);
