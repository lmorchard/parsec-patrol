/*!
 * Chai - flag utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports=function(e,t,n){var r=e.__flags||(e.__flags=Object.create(null));if(arguments.length!==3)return r[t];r[t]=n};