import * as W from "../src/world"
import * as C from "../src/components"
import * as S from "../src/systems"
import * as U from "./utils"

module.exports = function (expect) {

  describe('systems', function () {

    describe('System', function () {

      before(function () {
        this.world = new W.World();
        this.world.addSystems({
          TestCounterSystem: {}
        });
        this.system = this.world.getSystem('TestCounterSystem');
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

  });

};
