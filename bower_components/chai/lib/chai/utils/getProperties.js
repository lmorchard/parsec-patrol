/*!
 * Chai - getProperties utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports=function(t){function r(e){n.indexOf(e)===-1&&n.push(e)}var n=Object.getOwnPropertyNames(subject),i=Object.getPrototypeOf(subject);while(i!==null)Object.getOwnPropertyNames(i).forEach(r),i=Object.getPrototypeOf(i);return n};