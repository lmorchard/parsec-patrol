import * as Core from "core"

import "plugins/name"
import "plugins/position"
import "plugins/motion"
import "plugins/health"

import {expect} from "chai"

describe('Plugins', function () {

  describe('health', function () {

    describe('component', function () {

      it('should be named "Health"', function () {
        expect(Core.getComponent('Health').name).to.equal('Health');
      });

      it('should set current from max', function () {
        var max = 2000;
        var c = Core.getComponent('Health').create({ max: max });
        expect(c.max).to.equal(max);
      });

    });

  });

  describe('motion', function () {

    describe('system', function () {
      var [numUpdates, tickDelta] = [3, 16];
      var maxRotation = Math.PI / 2;
      var [dx, dy] = [10, 20];

      before(function () {
        this.world = new Core.World({
          systems: {
            Motion: {}
          }
        });
        this.system = this.world.getSystem('Motion');
        this.entity = this.world.entities.insert({
          Name: { name: "test1" },
          Position: {},
          Motion: {
            dx: dx, dy: dy,
            drotation: maxRotation / tickDelta / numUpdates
          }
        });
      });

      describe('.update()', function () {

        it('should update position appropriately over updates', function () {
          for (var i=0; i < numUpdates; i++) {
            this.system.update(tickDelta);
          }
          var c = this.world.entities.get('Position', this.entity);
          expect(c.x).to.equal(dx * tickDelta * numUpdates);
          expect(c.y).to.equal(dy * tickDelta * numUpdates);
          expect(c.rotation).to.equal(maxRotation);
        });

      });

    });

  });

});
