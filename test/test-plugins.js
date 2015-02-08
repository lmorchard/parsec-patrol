import * as W from "../src/world"
import * as S from "../src/systems"
import * as C from "../src/components"
import * as E from "../src/entities"
import * as U from "./utils"

import "../src/plugins/position"
import "../src/plugins/motion"
import "../src/plugins/health"

module.exports = function (expect) {

  describe('plugins', function () {

    describe('health', function () {

      describe('component', function () {

        it('should be named "Health"', function () {
          expect(C.get('Health').name).to.equal('Health');
        });

        it('should set current from max', function () {
          var max = 2000;
          var c = C.get('Health').create({ max: max });
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
          this.world = new W.World({
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
            var c = this.world.entities.getComponent(this.entity, 'Position');
            expect(c.x).to.equal(dx * tickDelta * numUpdates);
            expect(c.y).to.equal(dy * tickDelta * numUpdates);
            expect(c.rotation).to.equal(maxRotation);
          });

        });

      });

    });

  });

};
