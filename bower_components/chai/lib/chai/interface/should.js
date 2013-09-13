/*!
 * chai
 * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

module.exports=function(e,t){function r(){Object.defineProperty(Object.prototype,"should",{set:function(e){Object.defineProperty(this,"should",{value:e,enumerable:!0,configurable:!0,writable:!0})},get:function(){return this instanceof String||this instanceof Number?new n(this.constructor(this)):this instanceof Boolean?new n(this==1):new n(this)},configurable:!0});var e={};return e.equal=function(e,t,r){(new n(e,r)).to.equal(t)},e.Throw=function(e,t,r,i){(new n(e,i)).to.Throw(t,r)},e.exist=function(e,t){(new n(e,t)).to.exist},e.not={},e.not.equal=function(e,t,r){(new n(e,r)).to.not.equal(t)},e.not.Throw=function(e,t,r,i){(new n(e,i)).to.not.Throw(t,r)},e.not.exist=function(e,t){(new n(e,t)).to.not.exist},e["throw"]=e.Throw,e.not["throw"]=e.not.Throw,e}var n=e.Assertion;e.should=r,e.Should=r};