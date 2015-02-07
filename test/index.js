[
  require('./test-app'),
  require('./test-components'),
  require('./test-entities')
].map((test) => test(chai.expect));
