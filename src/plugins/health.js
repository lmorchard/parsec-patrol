import * as Systems from "../systems";
import * as Components from "../components";
import * as Entities from "../entities"

export class Health extends Components.Component {
  static defaults() {
    return { max: 1000, current: null, show_bar: true };
  }
  static create(attrs) {
    var c = super.create(attrs);
    c.current = c.max;
    return c;
  }
}
Components.register('Health', Health);
