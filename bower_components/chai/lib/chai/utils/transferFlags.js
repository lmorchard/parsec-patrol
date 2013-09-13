/*!
 * Chai - transferFlags utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports=function(e,t,n){var r=e.__flags||(e.__flags=Object.create(null));t.__flags||(t.__flags=Object.create(null)),n=arguments.length===3?n:!0;for(var i in r)if(n||i!=="object"&&i!=="ssfi"&&i!="message")t.__flags[i]=r[i]};