/*!
 * Attach chai to global should
 */

/*!
 * Provide check for fail function.
 */

global.chai=process&&process.env&&process.env.CHAI_COV?require("../../lib-cov/chai"):require("../.."),global.err=function(e,t){try{throw e(),new chai.AssertionError({message:"Expected an error"})}catch(n){"string"==typeof t?chai.expect(n.message).to.equal(t):chai.expect(n.message).to.match(t)}};