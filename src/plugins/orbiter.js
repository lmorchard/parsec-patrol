import * as Entities from "../entities"
import * as Components from "../components";
import * as Systems from "../systems";

import "./position";

import _ from "lodash";
import Vector2D from "../Vector2D";

export class Orbiter extends Components.Component {
  static defaults() {
    return {
      name: null,
      entityId: null,
      angle: 0.0,
      rotate: true,
      radPerSec: Math.PI / 4 / 1000
    };
  }
}
Components.register('Orbiter', Orbiter);

export class OrbiterSystem extends Systems.System {

  matchComponent() { return 'Orbiter'; }

  initialize() {
    this.vOrbited = new Vector2D();
    this.vOrbiter = new Vector2D();
    this.vOld = new Vector2D();
  }

  updateComponent(timeDelta, entityId, orbiter) {

    // Look up the orbited entity ID, if only name given.
    if (orbiter.name && !orbiter.entityId) {
      var names = this.world.entities.getComponents('Name');
      for (var nid in names) {
        var nameComponent = names[nid];
        if (nameComponent.name == orbiter.name) {
          orbiter.entityId = nid;
          console.log(orbiter.name + ' == ' + nid);
        }
      }
    }

    var pos = this.world.entities.get(entityId, 'Position');
    var oPos = this.world.entities.get(orbiter.entityId, 'Position');

    this.vOrbited.setValues(oPos.x, oPos.y);
    this.vOrbiter.setValues(pos.x, pos.y);

    var angleDelta = timeDelta * orbiter.radPerSec;
    this.vOrbiter.rotateAround(this.vOrbited, angleDelta);

    this.vOld.setValues(pos.x, pos.y);
    pos.x = this.vOrbiter.x;
    pos.y = this.vOrbiter.y;
    if (orbiter.rotate) {
      pos.rotation = this.vOld.angleTo(this.vOrbiter);
    }

  }
}
Systems.register('Orbiter', OrbiterSystem);
