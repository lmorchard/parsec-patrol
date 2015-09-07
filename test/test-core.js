import * as Core from "core"

import "plugins/name"
import "plugins/position"
import "plugins/motion"

import {expect} from "chai"

describe('Components', function () {

  describe('getManager()', function () {

    it('should fetch "TestCounterComponent" manager by name', function () {
      expect(Core.getComponent('TestCounterComponent')).to.equal(TestCounterComponent);
    });

  });

  describe('TestCounterComponent', function () {

    before(function () {
      this.manager = Core.getComponent('TestCounterComponent');
    });

    it('should be named "TestCounterComponent"', function () {
      expect(this.manager.name).to.equal('TestCounterComponent');
    });

    it('should support .create()', function () {
      var attrs = { test: 'test' };
      var c = this.manager.create(attrs);
      expect(c).to.contain(this.manager.defaults());
      expect(c).to.contain(attrs)
    });

  });

});

describe('Entities', function () {

  describe('EntityManager', function () {

    beforeEach(function () {
      this.entities = new Core.EntityManager();
      this.entityData = {
        Name: { name: "test1" },
        Position: { x: 100, y: 100 },
      };
      this.entity = this.entities.insert(this.entityData);
    });

    describe('.insert()', function () {

      it('should assign an entity id', function () {
        expect(this.entity).to.equal(this.entities.lastEntityId);
      });

      it('should result in components stored by entity id', function () {
        for (var componentName in this.eidData) {
          expect(this.entities.store).to.include.keys(componentName);
          expect(this.entities.store[componentName]).to.include.keys(this.entity);
        }
      });

      it('should accept multiple entities', function () {
        var entityIds = this.entities.insert(
          { Name: { name: "test2" } },
          { Name: { name: "test3" } },
          { Name: { name: "test4" } }
        );
        expect(Array.isArray(entityIds)).to.be.true;
        expect(entityIds.length).to.equal(3);
        expect(entityIds[2]).to.equal(this.entities.lastEntityId);
      });

    });

    describe('.destroy()', function () {

      it('should remove the associated components', function () {
        this.entities.destroy(this.entity);

        for (var componentName in this.entities.store) {
          var components = this.entities.store[componentName];
          expect(components).to.not.include.keys(this.entity);
        }
      });

    });

    describe('.hasComponent()', function () {

      it('should yield true for an existing component', function () {
        expect(this.entities.hasComponent(this.entity, 'Position')).to.be.true;
      });

      it('should yield false for a non-existent component', function () {
        expect(this.entities.hasComponent(this.entity, 'Motion')).to.be.false;
      });

    });

    describe('.addComponent()', function () {

      it('should add a component to an entity', function () {
        var componentName = 'Motion';
        var componentAttrs = { dx: 100, dy: 100 };

        expect(this.entities.hasComponent(this.entity, componentName)).to.be.false;
        this.entities.addComponent(this.entity, componentName, componentAttrs);
        expect(this.entities.hasComponent(this.entity, componentName)).to.be.true;
      });

    });

    describe('.removeComponent()', function () {

      it('should remove a component from an entity', function () {
        var componentName = 'Position';

        expect(this.entities.hasComponent(this.entity, componentName)).to.be.true;
        this.entities.removeComponent(this.entity, componentName);
        expect(this.entities.hasComponent(this.entity, componentName)).to.be.false;
      });

    });

  });

});

describe('Systems', function () {

  describe('System', function () {

    before(function () {
      this.world = new Core.World();
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
        var c = this.world.entities.get('TestCounterComponent', this.entity);
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

        var c = this.world.entities.get('TestCounterComponent', this.entity);
        expect(c.counter).to.equal(numUpdates);
        expect(c.timeElapsed).to.equal(numUpdates * tickDelta);
      });

    });

  });

});

describe('World', function () {
  this.timeout(5000);

  beforeEach(function () {
    this.world = new Core.World();
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
    timeout(1000).then(() => {
      this.world.stop();
      // HACK: Due to performance quirks, we won't get exactly 60 and 1000
      expect(this.component.counter).to.be.at.least(50);
      expect(this.component.timeElapsed).to.be.at.least(0.8);
    }).then(done).catch(err => done(err));
  });

  it('should stop executing the tick loop when stopped', function (done) {
    var counterBefore;

    this.world.start();
    timeout(250).then(() => {
      this.world.stop();
      return timeout(100);
    }).then(() => {
      counterBefore = this.component.counter;
      return timeout(100);
    }).then(() => {
      expect(this.component.counter).to.equal(counterBefore);
    }).then(done).catch(err => done(err));
  });

  it('should properly pause and resume the tick loop', function (done) {
    var c = this.world.entities.get('TestCounterComponent', this.entity);
    var counterBefore;
    this.world.start();
    timeout(250).then(() => {
      this.world.pause();
      return timeout(100);
    }).then(() => {
      counterBefore = c.counter;
      return timeout(100);
    }).then(() => {
      expect(this.component.counter).to.equal(counterBefore);
      return timeout(100);
    }).then(() => {
      this.world.resume();
      return timeout(100);
    }).then(() => {
      expect(this.component.counter).to.not.equal(counterBefore);
      return timeout(100);
    }).then(done).catch(err => done(err));
  });

  it('should execute the draw loop periodically while running', function (done) {
    this.world.start();
    timeout(1000).then(() => {
      this.world.stop();
      // HACK: Due to performance quirks, we won't get exactly 60 and 1000
      expect(this.system.drawCounter).to.be.at.least(50);
      expect(this.system.drawTimeElapsed).to.be.at.least(0.8);
    }).then(done).catch(err => done(err));
  });

  it('should properly pause and resume the draw loop', function (done) {
    var counterBefore;
    this.world.start();
    timeout(250).then(() => {
      this.world.pause();
      return timeout(100);
    }).then(() => {
      counterBefore = this.system.drawCounter;
      return timeout(100);
    }).then(() => {
      expect(this.system.drawCounter).to.equal(counterBefore);
      return timeout(100);
    }).then(() => {
      this.world.resume();
      return timeout(100);
    }).then(() => {
      expect(this.system.drawCounter).to.not.equal(counterBefore);
      return timeout(100);
    }).then(done).catch(err => done(err));
  });

});

export function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

export class TestCounterComponent extends Core.Component {
  static defaults() {
    return { counter: 0, timeElapsed: 0 };
  }
}

Core.registerComponent('TestCounterComponent', TestCounterComponent);

export class TestCounterSystem extends Core.System {
  constructor() {
    super();
    this.initialized = false;
    this.drawCounter = 0;
    this.drawTimeElapsed = 0;
  }
  initialize() {
    this.initialized = true;
  }
  matchComponent() {
    return TestCounterComponent.name;
  }
  updateComponent(timeDelta, entityId, testComponent) {
    testComponent.counter++;
    testComponent.timeElapsed += timeDelta;
  }
  draw(timeDelta) {
    this.drawCounter++;
    this.drawTimeElapsed += timeDelta;
  }
}

Core.registerSystem('TestCounterSystem', TestCounterSystem);
