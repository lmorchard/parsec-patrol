/*!
 * Chai - addProperty utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports=function(e,t,n){Object.defineProperty(e,t,{get:function(){var e=n.call(this);return e===undefined?this:e},configurable:!0})};