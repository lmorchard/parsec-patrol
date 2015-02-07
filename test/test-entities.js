import _ from 'lodash';
import * as E from "../src/entities"
import * as C from "../src/components"

module.exports = function (expect) {

  describe('entities', function () {

    before(function (done) {
      this.entities = new E.EntityManager();
      done();
    });

    it('should support creating an entity from components', function () {
      var eid1 = this.entities.insert(
        C.Name, { name: "test1" },
        C.Position, { x: 100, y: 100 },
        C.Health, {}
      );
      var eid2 = this.entities.insert(
        C.Name, { name: "test2" },
        C.Position, { x: 100, y: 100 },
        C.Health, {}
      );
      console.log(this.entities.lastEntityId);
      console.log(JSON.stringify(this.entities.store));
    });

  });

}
