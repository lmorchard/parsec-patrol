import {EntityManager} from "./entities";
//var entities = require('./entities');

console.log("HELLO WORLD");

['a','b','c'].forEach(x => {
  console.log(x);
});

export function sum(x, y) {
  return x + y;
}
export var pi = 3.141593;

export class BaseComponent {
}

export class Position extends BaseComponent {
}
