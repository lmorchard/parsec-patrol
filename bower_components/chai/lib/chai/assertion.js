/*!
 * chai
 * http://chaijs.com
 * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies.
 */

/*!
 * Module export.
 */

/*!
 * Assertion Constructor
 *
 * Creates object for chaining.
 *
 * @api private
 */

/*!
  * ### Assertion.includeStack
  *
  * User configurable property, influences whether stack trace
  * is included in Assertion error message. Default of false
  * suppresses stack trace in the error message
  *
  *     Assertion.includeStack = true;  // enable stack on error
  *
  * @api public
  */

/*!
 * ### Assertion.showDiff
 *
 * User configurable property, influences whether or not
 * the `showDiff` flag should be included in the thrown
 * AssertionErrors. `false` will always be `false`; `true`
 * will be true when the assertion has requested a diff
 * be shown.
 *
 * @api public
 */

/*!
 * ### .assert(expression, message, negateMessage, expected, actual)
 *
 * Executes an expression and check expectations. Throws AssertionError for reporting if test doesn't pass.
 *
 * @name assert
 * @param {Philosophical} expression to be tested
 * @param {String} message to display if fails
 * @param {String} negatedMessage to display if negated expression fails
 * @param {Mixed} expected value (remember to check for negation)
 * @param {Mixed} actual (optional) will default to `this.obj`
 * @api private
 */

/*!
 * ### ._obj
 *
 * Quick reference to stored `actual` value for plugin developers.
 *
 * @api private
 */

function Assertion(e,t,n){flag(this,"ssfi",n||arguments.callee),flag(this,"object",e),flag(this,"message",t)}var AssertionError=require("./error"),util=require("./utils"),flag=util.flag;module.exports=Assertion,Assertion.includeStack=!1,Assertion.showDiff=!0,Assertion.addProperty=function(e,t){util.addProperty(this.prototype,e,t)},Assertion.addMethod=function(e,t){util.addMethod(this.prototype,e,t)},Assertion.addChainableMethod=function(e,t,n){util.addChainableMethod(this.prototype,e,t,n)},Assertion.overwriteProperty=function(e,t){util.overwriteProperty(this.prototype,e,t)},Assertion.overwriteMethod=function(e,t){util.overwriteMethod(this.prototype,e,t)},Assertion.prototype.assert=function(e,t,n,r,i,s){var o=util.test(this,arguments);!0!==s&&(s=!1),!0!==Assertion.showDiff&&(s=!1);if(!o){var t=util.getMessage(this,arguments),u=util.getActual(this,arguments);throw new AssertionError({message:t,actual:u,expected:r,stackStartFunction:Assertion.includeStack?this.assert:flag(this,"ssfi"),showDiff:s})}},Object.defineProperty(Assertion.prototype,"_obj",{get:function(){return flag(this,"object")},set:function(e){flag(this,"object",e)}});