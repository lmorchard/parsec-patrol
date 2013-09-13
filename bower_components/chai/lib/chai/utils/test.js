/*!
 * Chai - test utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag=require("./flag");module.exports=function(e,t){var n=flag(e,"negate"),r=t[0];return n?!r:r};