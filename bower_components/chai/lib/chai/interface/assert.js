/*!
 * chai
 * Copyright(c) 2011-2013 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/*!
   * Chai dependencies.
   */

/*!
   * Module export.
   */

/*!
   * Undocumented / untested
   */

/*!
   * Aliases.
   */

module.exports=function(chai,util){var Assertion=chai.Assertion,flag=util.flag,assert=chai.assert=function(e,t){var n=new Assertion(null);n.assert(e,t,"[ negation message unavailable ]")};assert.fail=function(e,t,n,r){throw new chai.AssertionError({actual:e,expected:t,message:n,operator:r,stackStartFunction:assert.fail})},assert.ok=function(e,t){(new Assertion(e,t)).is.ok},assert.equal=function(e,t,n){var r=new Assertion(e,n);r.assert(t==flag(r,"object"),"expected #{this} to equal #{exp}","expected #{this} to not equal #{act}",t,e)},assert.notEqual=function(e,t,n){var r=new Assertion(e,n);r.assert(t!=flag(r,"object"),"expected #{this} to not equal #{exp}","expected #{this} to equal #{act}",t,e)},assert.strictEqual=function(e,t,n){(new Assertion(e,n)).to.equal(t)},assert.notStrictEqual=function(e,t,n){(new Assertion(e,n)).to.not.equal(t)},assert.deepEqual=function(e,t,n){(new Assertion(e,n)).to.eql(t)},assert.notDeepEqual=function(e,t,n){(new Assertion(e,n)).to.not.eql(t)},assert.isTrue=function(e,t){(new Assertion(e,t)).is["true"]},assert.isFalse=function(e,t){(new Assertion(e,t)).is["false"]},assert.isNull=function(e,t){(new Assertion(e,t)).to.equal(null)},assert.isNotNull=function(e,t){(new Assertion(e,t)).to.not.equal(null)},assert.isUndefined=function(e,t){(new Assertion(e,t)).to.equal(undefined)},assert.isDefined=function(e,t){(new Assertion(e,t)).to.not.equal(undefined)},assert.isFunction=function(e,t){(new Assertion(e,t)).to.be.a("function")},assert.isNotFunction=function(e,t){(new Assertion(e,t)).to.not.be.a("function")},assert.isObject=function(e,t){(new Assertion(e,t)).to.be.a("object")},assert.isNotObject=function(e,t){(new Assertion(e,t)).to.not.be.a("object")},assert.isArray=function(e,t){(new Assertion(e,t)).to.be.an("array")},assert.isNotArray=function(e,t){(new Assertion(e,t)).to.not.be.an("array")},assert.isString=function(e,t){(new Assertion(e,t)).to.be.a("string")},assert.isNotString=function(e,t){(new Assertion(e,t)).to.not.be.a("string")},assert.isNumber=function(e,t){(new Assertion(e,t)).to.be.a("number")},assert.isNotNumber=function(e,t){(new Assertion(e,t)).to.not.be.a("number")},assert.isBoolean=function(e,t){(new Assertion(e,t)).to.be.a("boolean")},assert.isNotBoolean=function(e,t){(new Assertion(e,t)).to.not.be.a("boolean")},assert.typeOf=function(e,t,n){(new Assertion(e,n)).to.be.a(t)},assert.notTypeOf=function(e,t,n){(new Assertion(e,n)).to.not.be.a(t)},assert.instanceOf=function(e,t,n){(new Assertion(e,n)).to.be.instanceOf(t)},assert.notInstanceOf=function(e,t,n){(new Assertion(e,n)).to.not.be.instanceOf(t)},assert.include=function(e,t,n){var r=new Assertion(e,n);if(Array.isArray(e))r.to.include(t);else{if("string"!=typeof e)throw new chai.AssertionError({message:"expected an array or string",stackStartFunction:assert.include});r.to.contain.string(t)}},assert.notInclude=function(e,t,n){var r=new Assertion(e,n);if(Array.isArray(e))r.to.not.include(t);else{if("string"!=typeof e)throw new chai.AssertionError({message:"expected an array or string",stackStartFunction:assert.include});r.to.not.contain.string(t)}},assert.match=function(e,t,n){(new Assertion(e,n)).to.match(t)},assert.notMatch=function(e,t,n){(new Assertion(e,n)).to.not.match(t)},assert.property=function(e,t,n){(new Assertion(e,n)).to.have.property(t)},assert.notProperty=function(e,t,n){(new Assertion(e,n)).to.not.have.property(t)},assert.deepProperty=function(e,t,n){(new Assertion(e,n)).to.have.deep.property(t)},assert.notDeepProperty=function(e,t,n){(new Assertion(e,n)).to.not.have.deep.property(t)},assert.propertyVal=function(e,t,n,r){(new Assertion(e,r)).to.have.property(t,n)},assert.propertyNotVal=function(e,t,n,r){(new Assertion(e,r)).to.not.have.property(t,n)},assert.deepPropertyVal=function(e,t,n,r){(new Assertion(e,r)).to.have.deep.property(t,n)},assert.deepPropertyNotVal=function(e,t,n,r){(new Assertion(e,r)).to.not.have.deep.property(t,n)},assert.lengthOf=function(e,t,n){(new Assertion(e,n)).to.have.length(t)},assert.Throw=function(e,t,n,r){if("string"==typeof t||t instanceof RegExp)n=t,t=null;(new Assertion(e,r)).to.Throw(t,n)},assert.doesNotThrow=function(e,t,n){"string"==typeof t&&(n=t,t=null),(new Assertion(e,n)).to.not.Throw(t)},assert.operator=function(val,operator,val2,msg){if(!~["==","===",">",">=","<","<=","!=","!=="].indexOf(operator))throw new Error('Invalid operator "'+operator+'"');var test=new Assertion(eval(val+operator+val2),msg);test.assert(!0===flag(test,"object"),"expected "+util.inspect(val)+" to be "+operator+" "+util.inspect(val2),"expected "+util.inspect(val)+" to not be "+operator+" "+util.inspect(val2))},assert.closeTo=function(e,t,n,r){(new Assertion(e,r)).to.be.closeTo(t,n)},assert.sameMembers=function(e,t,n){(new Assertion(e,n)).to.have.same.members(t)},assert.includeMembers=function(e,t,n){(new Assertion(e,n)).to.include.members(t)},assert.ifError=function(e,t){(new Assertion(e,t)).to.not.be.ok},function alias(e,t){return assert[t]=assert[e],alias}("Throw","throw")("Throw","throws")};