function _deepEqual(e,t,n){if(e===t)return!0;if(Buffer.isBuffer(e)&&Buffer.isBuffer(t)){if(e.length!=t.length)return!1;for(var r=0;r<e.length;r++)if(e[r]!==t[r])return!1;return!0}return e instanceof Date&&t instanceof Date?e.getTime()===t.getTime():typeof e!="object"&&typeof t!="object"?e===t:e instanceof RegExp&&t instanceof RegExp?e.toString()===t.toString():objEquiv(e,t,n)}function isUndefinedOrNull(e){return e===null||e===undefined}function isArguments(e){return Object.prototype.toString.call(e)=="[object Arguments]"}function objEquiv(e,t,n){if(isUndefinedOrNull(e)||isUndefinedOrNull(t))return!1;if(e.prototype!==t.prototype)return!1;var r;if(n){for(r=0;r<n.length;r++)if(n[r][0]===e&&n[r][1]===t||n[r][0]===t&&n[r][1]===e)return!0}else n=[];if(isArguments(e))return isArguments(t)?(e=pSlice.call(e),t=pSlice.call(t),_deepEqual(e,t,n)):!1;try{var i=getEnumerableProperties(e),s=getEnumerableProperties(t),o}catch(u){return!1}if(i.length!=s.length)return!1;i.sort(),s.sort();for(r=i.length-1;r>=0;r--)if(i[r]!=s[r])return!1;n.push([e,t]);for(r=i.length-1;r>=0;r--){o=i[r];if(!_deepEqual(e[o],t[o],n))return!1}return!0}module.exports=_deepEqual;var getEnumerableProperties=require("./getEnumerableProperties"),Buffer;try{Buffer=require("buffer").Buffer}catch(ex){Buffer={isBuffer:function(){return!1}}};