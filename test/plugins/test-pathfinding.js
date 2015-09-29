import * as util from "util";

import * as Core from "core";

import * as Pathfinding from "plugins/pathfinding";

import QuadTree from "QuadTree";

import {expect} from "chai";

const width = 1000;
const height = 1000;
const entities = [

  [0, 0, 100],
  [200, 200, 100],
  [-200, -200, 100],
  [-200, 200, 100],
  [200, -200, 100]

];

function entityToBody(idx, entity) {
  var [x, y, d] = entity;
  var r = d / 2;
  return {
    idx: idx,
    x: x - r,
    y: y - r,
    right: x + r,
    bottom: y + r
  };
}

describe('pathfinding plugin', () => {

  describe('SpaceTreeNode', () => {

    it('should exist', () => {

      expect(Pathfinding);

      let qt = new QuadTree(0 - width/2, 0 - height/2, width, height, 3);

      for (var idx = 0; idx < entities.length; idx++) {
        var body = entityToBody(idx, entities[idx]);
        console.log("BODY", body);
        qt.insert(body);
      }
      //console.log(util.inspect(qt, {depth: null}));

      let st = new Pathfinding.SpaceTree(qt);
      console.log(util.inspect(st, {depth: null}));

    });

  });

});
