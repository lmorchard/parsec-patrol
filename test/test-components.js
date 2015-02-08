import * as C from "../src/components"
import * as U from "./utils"

module.exports = function (expect) {

  describe('components', function () {

    describe('getManager()', function () {

      it('should fetch "TestCounterComponent" manager by name', function () {
        expect(C.get('TestCounterComponent')).to.equal(U.TestCounterComponent);
      });

    });

    describe('TestCounterComponent', function () {

      before(function () {
        this.manager = C.get('TestCounterComponent');
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

      it('should have a reference to the manager', function () {
        var c = this.manager.create();
        expect(c.manager).to.equal(this.manager);
      });

    });

  });

};
