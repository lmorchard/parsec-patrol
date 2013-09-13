/*!
 * Chai - type utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Detectable javascript natives
 */

var natives={"[object Arguments]":"arguments","[object Array]":"array","[object Date]":"date","[object Function]":"function","[object Number]":"number","[object RegExp]":"regexp","[object String]":"string"};module.exports=function(e){var t=Object.prototype.toString.call(e);return natives[t]?natives[t]:e===null?"null":e===undefined?"undefined":e===Object(e)?"object":typeof e};