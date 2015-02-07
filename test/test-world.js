import * as W from "../src/world"
import * as S from "../src/systems"
import * as C from "../src/components"
import * as E from "../src/entities"
import * as U from "./utils"

module.exports = function (expect) {

  describe('World', function () {
    this.timeout(5000);

    beforeEach(function () {
      this.world = new W.World(
        new U.TestCounterSystem()
      );
      this.entity = this.world.entityManager.insert({
        Name: { name: "test1" },
        TestCounterComponent: {}
      });
    });

    it('should not be running at first', function () {
      expect(this.world.isRunning).to.be.false;
    });

    it('should not be paused at first', function () {
      expect(this.world.isPaused).to.be.false;
    });

    it('should accept systems on construction', function () {
      expect(this.world.systems.length).to.equal(1);
    });

    it('should have an EntityManager', function () {
      expect(this.world.entityManager).to.not.be.null;
    });

    it('should execute the tick loop periodically while running', function (done) {
      this.world.start();

      setTimeout(() => {
        this.world.stop();

        // HACK: Due to performance quirks, we won't get exactly 60 and 1000
        var c = this.world.entityManager
          .getComponent(this.entity, 'TestCounterComponent');
        expect(c.counter).to.be.at.least(50);
        expect(c.timeElapsed).to.be.at.least(900);

        done();
      }, 1000);
    });

    it('should stop executing the tick loop when stopped', function (done) {
      var c = this.world.entityManager
        .getComponent(this.entity, 'TestCounterComponent');
      this.world.start();
      setTimeout(() => {
        this.world.stop();
        setTimeout(() => {
          var counterBefore = c.counter;
          setTimeout(() => {
            expect(c.counter).to.equal(counterBefore);
            done();
          }, 100);
        }, 100);
      }, 250);
    });

    it('should properly pause and resume the tick loop', function (done) {
      var c = this.world.entityManager
        .getComponent(this.entity, 'TestCounterComponent');
      this.world.start();
      setTimeout(() => {
        this.world.pause();
        setTimeout(() => {
          var counterBefore = c.counter;
          setTimeout(() => {
            expect(c.counter).to.equal(counterBefore);
            setTimeout(() => {
              this.world.resume();
              setTimeout(() => {
                expect(c.counter).to.not.equal(counterBefore);
                this.world.stop();
                done();
              }, 100);
            }, 100);
          }, 100);
        }, 100);
      }, 250);
    });

    it('should execute the draw loop periodically while running', function (done) {
      this.world.start();

      setTimeout(() => {
        this.world.stop();

        // HACK: Due to performance quirks, we won't get exactly 60 and 1000
        var s = this.world.systems[0];
        expect(s.drawCounter).to.be.at.least(50);
        expect(s.drawTimeElapsed).to.be.at.least(900);

        done();
      }, 1000);
    });

  });

};
