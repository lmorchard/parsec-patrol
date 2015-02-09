import * as W from "../src/world"
import * as S from "../src/systems"
import * as C from "../src/components"
import * as E from "../src/entities"
import * as U from "./utils"

module.exports = function (expect) {

  describe('World', function () {
    this.timeout(5000);

    beforeEach(function () {
      this.world = new W.World();
      this.world.addSystems({
        TestCounterSystem: {}
      });
      this.system = this.world.getSystem('TestCounterSystem');
      this.entity = this.world.entities.insert({
        Name: { name: "test1" },
        TestCounterComponent: {}
      });
      this.component = this.world.entities.get('TestCounterComponent', this.entity);
    });

    it('should not be running at first', function () {
      expect(this.world.isRunning).to.be.false;
    });

    it('should not be paused at first', function () {
      expect(this.world.isPaused).to.be.false;
    });

    it('should have an entity manager', function () {
      expect(this.world.entities).to.not.be.null;
    });

    it('should have systems that are initialized after start', function () {
      expect(this.system.initialized).to.be.false;
      this.world.start();
      expect(this.system.initialized).to.be.true;
      this.world.stop();
    });

    it('should execute the tick loop periodically while running', function (done) {
      this.world.start();
      U.timeout(1000).then(() => {
        this.world.stop();
        // HACK: Due to performance quirks, we won't get exactly 60 and 1000
        expect(this.component.counter).to.be.at.least(50);
        expect(this.component.timeElapsed).to.be.at.least(800);
      }).then(done).catch(err => done(err));
    });

    it('should stop executing the tick loop when stopped', function (done) {
      var counterBefore;

      this.world.start();
      U.timeout(250).then(() => {
        this.world.stop();
        return U.timeout(100);
      }).then(() => {
        counterBefore = this.component.counter;
        return U.timeout(100);
      }).then(() => {
        expect(this.component.counter).to.equal(counterBefore);
      }).then(done).catch(err => done(err));
    });

    it('should properly pause and resume the tick loop', function (done) {
      var c = this.world.entities.get('TestCounterComponent', this.entity);
      var counterBefore;
      this.world.start();
      U.timeout(250).then(() => {
        this.world.pause();
        return U.timeout(100);
      }).then(() => {
        counterBefore = c.counter;
        return U.timeout(100);
      }).then(() => {
        expect(this.component.counter).to.equal(counterBefore);
        return U.timeout(100);
      }).then(() => {
        this.world.resume();
        return U.timeout(100);
      }).then(() => {
        expect(this.component.counter).to.not.equal(counterBefore);
        return U.timeout(100);
      }).then(done).catch(err => done(err));
    });

    it('should execute the draw loop periodically while running', function (done) {
      this.world.start();
      U.timeout(1000).then(() => {
        this.world.stop();
        // HACK: Due to performance quirks, we won't get exactly 60 and 1000
        expect(this.system.drawCounter).to.be.at.least(50);
        expect(this.system.drawTimeElapsed).to.be.at.least(900);
      }).then(done).catch(err => done(err));
    });

    it('should properly pause and resume the draw loop', function (done) {
      var counterBefore;
      this.world.start();
      U.timeout(250).then(() => {
        this.world.pause();
        return U.timeout(100);
      }).then(() => {
        counterBefore = this.system.drawCounter;
        return U.timeout(100);
      }).then(() => {
        expect(this.system.drawCounter).to.equal(counterBefore);
        return U.timeout(100);
      }).then(() => {
        this.world.resume();
        return U.timeout(100);
      }).then(() => {
        expect(this.system.drawCounter).to.not.equal(counterBefore);
        return U.timeout(100);
      }).then(done).catch(err => done(err));
    });

  });

};
