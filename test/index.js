require("6to5/polyfill");

var tests = [
  require('./test-components'),
  require('./test-entities'),
  require('./test-systems'),
  require('./test-world'),
  require('./test-plugins')
];

tests.map(test => test(chai.expect));
