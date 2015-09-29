import * as Core from "core"

import "plugins/health"

import {expect} from "chai"

describe('health plugin', function () {

  describe('component', function () {

    it('should be named "Health"', function () {
      expect(Core.getComponent('Health').name).to.equal('Health');
    });

    it('should set current from max', function () {
      var max = 2000;
      var c = Core.getComponent('Health').create({ max: max });
      expect(c.max).to.equal(max);
    });

  });

});
