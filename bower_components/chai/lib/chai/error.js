/*!
 * chai
 * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Main export
 */

/*!
 * Inherit from Error
 */

function AssertionError(e){e=e||{},this.message=e.message,this.actual=e.actual,this.expected=e.expected,this.operator=e.operator,this.showDiff=e.showDiff;if(e.stackStartFunction&&Error.captureStackTrace){var t=e.stackStartFunction;Error.captureStackTrace(this,t)}}module.exports=AssertionError,AssertionError.prototype=Object.create(Error.prototype),AssertionError.prototype.name="AssertionError",AssertionError.prototype.constructor=AssertionError,AssertionError.prototype.toString=function(){return this.message};