/*!
 * Chai - addMethod utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports=function(e,t,n){e[t]=function(){var e=n.apply(this,arguments);return e===undefined?this:e}};