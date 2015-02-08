import * as W from "../src/world"
import * as C from "../src/components"
import * as S from "../src/systems"
import * as U from "./utils"

module.exports = function (expect) {

  describe('systems', function () {

    describe('System', function () {

      before(function () {
        this.system = new U.TestCounterSystem();
        this.world = new W.World(this.system);
        this.entity = this.world.entities.insert({
          Name: { name: "test1" },
          TestCounterComponent: {}
        });
      });

      it('should get a reference to the world', function () {
        expect(this.system.world).to.equal(this.world);
      });

      describe('.getMatchingComponents()', function () {

        it('should find relevant components', function () {
          var c = this.world.entities.getComponent(this.entity, 'TestCounterComponent');
          var matches = this.system.getMatchingComponents();
          expect(matches[this.entity]).to.equal(c);
        });

      });

      describe('.update()', function () {

        it('should update relevant components', function () {
          var [numUpdates, tickDelta] = [3, 16];
          for (var i=0; i < numUpdates; i++) {
            this.system.update(tickDelta);
          }

          var c = this.world.entities.getComponent(this.entity, 'TestCounterComponent');
          expect(c.counter).to.equal(numUpdates);
          expect(c.timeElapsed).to.equal(numUpdates * tickDelta);
        });

      });

    });

    describe('MotionSystem', function () {
      var [numUpdates, tickDelta] = [3, 16];
      var maxRotation = Math.PI / 2;
      var [dx, dy] = [10, 20];

      before(function () {
        this.system = new S.MotionSystem();
        this.world = new W.World(this.system);
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

        it('play', function () {
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

};
