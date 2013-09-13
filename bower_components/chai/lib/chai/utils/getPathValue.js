/*!
 * Chai - getPathValue utility
 * Copyright(c) 2012-2013 Jake Luer <jake@alogicalparadox.com>
 * @see https://github.com/logicalparadox/filtr
 * MIT Licensed
 */

/*!
 * ## parsePath(path)
 *
 * Helper function used to parse string object
 * paths. Use in conjunction with `_getPathValue`.
 *
 *      var parsed = parsePath('myobject.property.subprop');
 *
 * ### Paths:
 *
 * * Can be as near infinitely deep and nested
 * * Arrays are also valid using the formal `myobject.document[3].property`.
 *
 * @param {String} path
 * @returns {Object} parsed
 * @api private
 */

/*!
 * ## _getPathValue(parsed, obj)
 *
 * Helper companion function for `.parsePath` that returns
 * the value located at the parsed address.
 *
 *      var value = getPathValue(parsed, obj);
 *
 * @param {Object} parsed definition from `parsePath`.
 * @param {Object} object to search against
 * @returns {Object|Undefined} value
 * @api private
 */

function parsePath(e){var t=e.replace(/\[/g,".["),n=t.match(/(\\\.|[^.]+?)+/g);return n.map(function(e){var t=/\[(\d+)\]$/,n=t.exec(e);return n?{i:parseFloat(n[1])}:{p:e}})}function _getPathValue(e,t){var n=t,r;for(var i=0,s=e.length;i<s;i++){var o=e[i];n?("undefined"!=typeof o.p?n=n[o.p]:"undefined"!=typeof o.i&&(n=n[o.i]),i==s-1&&(r=n)):r=undefined}return r}var getPathValue=module.exports=function(e,t){var n=parsePath(e);return _getPathValue(n,t)};