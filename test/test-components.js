import * as C from "../src/components"

module.exports = function (expect) {

  describe('components', function () {

    describe('getManager', function () {

      it('should fetch "Position" manager by name', function () {
        expect(C.getManager('Position')).to.equal(C.Position);
      });

    });

    describe('Position', function () {

      it('should be named "Position"', function () {
        expect(C.Position.name).to.equal('Position');
      });

      it('should support .create()', function () {
        var attrs = { test: 'test' };
        var c = C.Position.create(attrs);
        expect(c).to.contain(C.Position.defaults());
        expect(c).to.contain(attrs)
      });

      it('should have a reference to the type', function () {
        var c = C.Position.create();
        expect(c.type).to.equal(C.Position);
      });

    });

    describe('Health', function () {

      it('should be named "Health"', function () {
        expect(C.Health.name).to.equal('Health');
      });

      it('should set current from max', function () {
        var max = 2000;
        var c = C.Health.create({ max: max });
        expect(c.max).to.equal(max);
      });

    });

  });

};
