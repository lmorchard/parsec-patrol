/*!
 * Chai - flag utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var inspect=require("./inspect");module.exports=function(e){var t=inspect(e),n=Object.prototype.toString.call(e);if(t.length>=40){if(n==="[object Function]")return!e.name||e.name===""?"[Function]":"[Function: "+e.name+"]";if(n==="[object Array]")return"[ Array("+e.length+") ]";if(n==="[object Object]"){var r=Object.keys(e),i=r.length>2?r.splice(0,2).join(", ")+", ...":r.join(", ");return"{ Object ("+i+") }"}return t}return t};