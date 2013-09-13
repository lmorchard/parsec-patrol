/*!
 * Chai - getName utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports=function(e){if(e.name)return e.name;var t=/^\s?function ([^(]*)\(/.exec(e);return t&&t[1]?t[1]:""};