import * as Core from "../core";

export class Name extends Core.Component {
  static defaults() {
    return { name: "unnamed" };
  }
}

Core.registerComponent('Name', Name);
