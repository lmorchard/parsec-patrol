/*!
 * chai
 * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
 * Chai version
 */

/*!
 * Primary `Assertion` prototype
 */

/*!
 * Assertion Error
 */

/*!
 * Utils for plugins (not exported)
 */

/*!
 * Core Assertions
 */

/*!
 * Expect interface
 */

/*!
 * Should interface
 */

/*!
 * Assert interface
 */

var used=[],exports=module.exports={};exports.version="1.6.1",exports.Assertion=require("./chai/assertion"),exports.AssertionError=require("./chai/error");var util=require("./chai/utils");exports.use=function(e){return~used.indexOf(e)||(e(this,util),used.push(e)),this};var core=require("./chai/core/assertions");exports.use(core);var expect=require("./chai/interface/expect");exports.use(expect);var should=require("./chai/interface/should");exports.use(should);var assert=require("./chai/interface/assert");exports.use(assert);