/*!
 * Chai - addChainingMethod utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Module dependencies
 */

/*!
 * Module variables
 */

var transferFlags=require("./transferFlags"),hasProtoSupport="__proto__"in Object,excludeNames=/^(?:length|name|arguments|caller)$/,call=Function.prototype.call,apply=Function.prototype.apply;module.exports=function(e,t,n,r){typeof r!="function"&&(r=function(){}),Object.defineProperty(e,t,{get:function(){r.call(this);var t=function(){var e=n.apply(this,arguments);return e===undefined?this:e};if(hasProtoSupport){var i=t.__proto__=Object.create(this);i.call=call,i.apply=apply}else{var s=Object.getOwnPropertyNames(e);s.forEach(function(n){if(!excludeNames.test(n)){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,r)}})}return transferFlags(this,t),t},configurable:!0})};