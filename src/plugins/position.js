import * as Core from "../core";

export class Position extends Core.Component {
  static defaults() {
    return { x: 0, y: 0, rotation: 0 };
  }
}
Core.registerComponent('Position', Position);
