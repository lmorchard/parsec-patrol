/* jshint expr: true */
/* global chai, before, describe, it */
var expect = chai.expect;

describe('app', function () {

  it('should pass the first test', function (done) {
    console.log("yay yay");
    ['a','b','c'].forEach(x => {
      console.log('TEST poof narp ploo ' + x);
    });
    done();
  });

});
