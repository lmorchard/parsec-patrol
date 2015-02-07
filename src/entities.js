export class EntityManager {

  constructor() {
    this.reset();
  }

  reset() {
    this.store = {};
    this.lastEntityId = 0;
    this.groups = {};
    this.lastGroupId = 0;
  }

  generateEntityId() {
    return ++(this.lastEntityId);
  }

  generateGroupId() {
    return ++(this.lastGroupId);
  }

  insert(...args) {
    var eid = this.generateEntityId();
    for (var idx = 0; idx < args.length; idx += 2) {
      var type = args[idx];
      var attrs = args[idx + 1];
      var c = type.create(attrs);
      var name = c.type.name;
      if (!this.store[name]) {
        this.store[name] = {};
      }
      this.store[name][eid] = c;
    }
    return eid;
  }

}
