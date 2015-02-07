require("6to5/polyfill");
[
  require('./test-components'),
  require('./test-entities'),
  require('./test-systems'),
  require('./test-world')
].map(test => test(chai.expect));
