[
  require('./test-components'),
  require('./test-entities'),
  require('./test-systems'),
  require('./test-world')
].map(test => test(chai.expect));
