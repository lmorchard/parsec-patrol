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
      U.timeout(1000).then(() => {
        this.world.stop();
        // HACK: Due to performance quirks, we won't get exactly 60 and 1000
        var c = this.world.entityManager.getComponent(this.entity, 'TestCounterComponent');
        expect(c.counter).to.be.at.least(50);
        expect(c.timeElapsed).to.be.at.least(900);
      }).then(done).catch(err => done(err));
    });

    it('should stop executing the tick loop when stopped', function (done) {
      var c = this.world.entityManager.getComponent(this.entity, 'TestCounterComponent');
      var counterBefore;

      this.world.start();
      U.timeout(250).then(() => {
        this.world.stop();
        return U.timeout(100);
      }).then(() => {
        counterBefore = c.counter;
        return U.timeout(100);
      }).then(() => {
        expect(c.counter).to.equal(counterBefore);
      }).then(done).catch(err => done(err));
    });

    it('should properly pause and resume the tick loop', function (done) {
      var c = this.world.entityManager
        .getComponent(this.entity, 'TestCounterComponent');
      var counterBefore;

      this.world.start();
      U.timeout(250).then(() => {
        this.world.pause();
        return U.timeout(100);
      }).then(() => {
        counterBefore = c.counter;
        return U.timeout(100);
      }).then(() => {
        expect(c.counter).to.equal(counterBefore);
        return U.timeout(100);
      }).then(() => {
        this.world.resume();
        return U.timeout(100);
      }).then(() => {
        expect(c.counter).to.not.equal(counterBefore);
        return U.timeout(100);
      }).then(done).catch(err => done(err));
    });

    it('should execute the draw loop periodically while running', function (done) {
      this.world.start();
      U.timeout(1000).then(() => {
        this.world.stop();
        // HACK: Due to performance quirks, we won't get exactly 60 and 1000
        var s = this.world.systems[0];
        expect(s.drawCounter).to.be.at.least(50);
        expect(s.drawTimeElapsed).to.be.at.least(900);
      }).then(done).catch(err => done(err));
    });

    it('should properly pause and resume the draw loop', function (done) {
      var s = this.world.systems[0];
      var counterBefore;
      this.world.start();
      U.timeout(250).then(() => {
        this.world.pause();
        return U.timeout(100);
      }).then(() => {
        counterBefore = s.drawCounter;
        return U.timeout(100);
      }).then(() => {
        expect(s.drawCounter).to.equal(counterBefore);
        return U.timeout(100);
      }).then(() => {
        this.world.resume();
        return U.timeout(100);
      }).then(() => {
        expect(s.drawCounter).to.not.equal(counterBefore);
        return U.timeout(100);
      }).then(done).catch(err => done(err));
    });

  });

};
