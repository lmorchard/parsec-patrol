function Hook(e,t){Runnable.call(this,e,t),this.type="hook"}var Runnable=require("./runnable");module.exports=Hook,Hook.prototype.__proto__=Runnable.prototype,Hook.prototype.error=function(e){if(0==arguments.length){var e=this._error;return this._error=null,e}this._error=e};