import _ from 'lodash';

export class Component {
  constructor(attrs) {
    console.log(this);
    console.log(this.prototype);
    return this.prototype.create(attrs);
  }
  static defaults() {
    return {};
  }
  static create(attrs) {
    return _.extend(this.defaults(), attrs || {}, { type: this })
  }
}

export class Name extends Component {
  static defaults() {
    return { name: "unnamed" };
  }
}

export class Position extends Component {
  static defaults() {
    return { x: 0, y: 0, rotation: 0 };
  }
}

export class Motion extends Component {
  static defaults() {
    return { dx: 0, dy: 0, drotation: 0 };
  }
}

export class Health extends Component {
  static defaults() {
    return { max: 1000, current: null, show_bar: true };
  }
  static create(attrs) {
    var c = super.create(attrs);
    c.current = c.max;
    return c;
  }
}
