import _ from 'lodash';
import * as E from "../src/entities"
import * as C from "../src/components"
import * as U from "./utils"

module.exports = function (expect) {

  describe('EntityManager', function () {

    beforeEach(function () {
      this.entities = new E.EntityManager();
      this.entityData = {
        Name: { name: "test1" },
        Position: { x: 100, y: 100 },
        Health: { max: 500 }
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
        expect(_.isArray(entityIds)).to.be.true;
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

}
