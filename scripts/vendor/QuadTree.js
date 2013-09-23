/*
	The MIT License

	Copyright (c) 2011 Mike Chambers

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

define([],function(){function e(e,r,i,s){var o;r?o=new t(e,0,i,s):o=new n(e,0,i,s),this.root=o}function t(e,t,n,r){this._bounds=e,this.children=[],this.nodes=[],r&&(this._maxChildren=r),n&&(this._maxDepth=n),t&&(this._depth=t)}function n(e,n,r,i){t.call(this,e,n,r,i),this._stuckChildren=[]}return e.prototype.root=null,e.prototype.insert=function(e){if(e instanceof Array){var t=e.length;for(var n=0;n<t;n++)this.root.insert(e[n])}else this.root.insert(e)},e.prototype.clear=function(){this.root.clear()},e.prototype.retrieve=function(e){var t=this.root.retrieve(e).slice(0);return t},t.prototype.nodes=null,t.prototype._classConstructor=t,t.prototype.children=null,t.prototype._bounds=null,t.prototype._depth=0,t.prototype._maxChildren=4,t.prototype._maxDepth=4,t.TOP_LEFT=0,t.TOP_RIGHT=1,t.BOTTOM_LEFT=2,t.BOTTOM_RIGHT=3,t.prototype.insert=function(e){if(this.nodes.length){var t=this._findIndex(e);this.nodes[t].insert(e);return}this.children.push(e);var n=this.children.length;if(!(this._depth>=this._maxDepth)&&n>this._maxChildren){this.subdivide();for(var r=0;r<n;r++)this.insert(this.children[r]);this.children.length=0}},t.prototype.retrieve=function(e){if(this.nodes.length){var t=this._findIndex(e);return this.nodes[t].retrieve(e)}return this.children},t.prototype._findIndex=function(e){var n=this._bounds,r=e.x>n.x+n.width/2?!1:!0,i=e.y>n.y+n.height/2?!1:!0,s=t.TOP_LEFT;return r?i||(s=t.BOTTOM_LEFT):i?s=t.TOP_RIGHT:s=t.BOTTOM_RIGHT,s},t.prototype.subdivide=function(){var e=this._depth+1,n=this._bounds.x,r=this._bounds.y,i=this._bounds.width/2|0,s=this._bounds.height/2|0,o=n+i,u=r+s;this.nodes[t.TOP_LEFT]=new this._classConstructor({x:n,y:r,width:i,height:s},e),this.nodes[t.TOP_RIGHT]=new this._classConstructor({x:o,y:r,width:i,height:s},e),this.nodes[t.BOTTOM_LEFT]=new this._classConstructor({x:n,y:u,width:i,height:s},e),this.nodes[t.BOTTOM_RIGHT]=new this._classConstructor({x:o,y:u,width:i,height:s},e)},t.prototype.clear=function(){this.children.length=0;var e=this.nodes.length;for(var t=0;t<e;t++)this.nodes[t].clear();this.nodes.length=0},n.prototype=new t,n.prototype._classConstructor=n,n.prototype._stuckChildren=null,n.prototype._out=[],n.prototype.insert=function(e){if(this.nodes.length){var t=this._findIndex(e),n=this.nodes[t];e.x>=n._bounds.x&&e.x+e.width<=n._bounds.x+n._bounds.width&&e.y>=n._bounds.y&&e.y+e.height<=n._bounds.y+n._bounds.height?this.nodes[t].insert(e):this._stuckChildren.push(e);return}this.children.push(e);var r=this.children.length;if(!(this._depth>=this._maxDepth)&&r>this._maxChildren){this.subdivide();for(var i=0;i<r;i++)this.insert(this.children[i]);this.children.length=0}},n.prototype.getChildren=function(){return this.children.concat(this._stuckChildren)},n.prototype.retrieve=function(e){var t=this._out;t.length=0;if(this.nodes.length){var n=this._findIndex(e);t.push.apply(t,this.nodes[n].retrieve(e))}return t.push.apply(t,this._stuckChildren),t.push.apply(t,this.children),t},n.prototype.clear=function(){this._stuckChildren.length=0,this.children.length=0;var e=this.nodes.length;if(!e)return;for(var t=0;t<e;t++)this.nodes[t].clear();this.nodes.length=0},n.prototype.getChildCount,e});