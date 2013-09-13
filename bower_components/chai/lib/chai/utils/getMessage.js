/*!
 * Chai - message composition utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependancies
 */

var flag=require("./flag"),getActual=require("./getActual"),inspect=require("./inspect"),objDisplay=require("./objDisplay");module.exports=function(e,t){var n=flag(e,"negate"),r=flag(e,"object"),i=t[3],s=getActual(e,t),o=n?t[2]:t[1],u=flag(e,"message");return o=o||"",o=o.replace(/#{this}/g,objDisplay(r)).replace(/#{act}/g,objDisplay(s)).replace(/#{exp}/g,objDisplay(i)),u?u+": "+o:o};