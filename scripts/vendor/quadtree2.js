/*
 Copyright © 2012 Timo Hausmann

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

define([],function(){function t(e,t,n,r){var i=this;i.v2=!0,i.max_objects=t||10,i.max_levels=n||4,i.level=r||0,i.bounds=e,i.objects=[],i.nodes=[]}var e=Math;return t.prototype.split=function(){var n=this,r=n.level+1,i=e.round(n.bounds.width/2),s=e.round(n.bounds.height/2),o=e.round(n.bounds.x),u=e.round(n.bounds.y);n.nodes[0]=new t({x:o+i,y:u,width:i,height:s},n.max_objects,n.max_levels,r),n.nodes[1]=new t({x:o,y:u,width:i,height:s},n.max_objects,n.max_levels,r),n.nodes[2]=new t({x:o,y:u+s,width:i,height:s},n.max_objects,n.max_levels,r),n.nodes[3]=new t({x:o+i,y:u+s,width:i,height:s},n.max_objects,n.max_levels,r)},t.prototype.getIndex=function(e){var t=this,n=-1,r=t.bounds.x+t.bounds.width/2,i=t.bounds.y+t.bounds.height/2,s=e.y<i&&e.y+e.height<i,o=e.y>i;return e.x<r&&e.x+e.width<r?s?n=1:o&&(n=2):e.x>r&&(s?n=0:o&&(n=3)),n},t.prototype.insert=function(e){var t=this,n=0,r;if(typeof t.nodes[0]!="undefined"){r=t.getIndex(e);if(r!==-1){t.nodes[r].insert(e);return}}t.objects.push(e);if(t.objects.length>t.max_objects&&t.level<t.max_levels){typeof t.nodes[0]=="undefined"&&t.split();while(n<t.objects.length)r=t.getIndex(t.objects[n]),r!==-1?t.nodes[r].insert(t.objects.splice(n,1)[0]):n+=1}},t.prototype.retrieve=function(e){var t=this,n=t.getIndex(e),r=t.objects;if(typeof t.nodes[0]!="undefined")if(n!==-1)r=r.concat(t.nodes[n].retrieve(e));else for(var i=0;i<t.nodes.length;i+=1)r=r.concat(t.nodes[i].retrieve(e));return r},t.prototype.clear=function(){var e=this;e.objects=[];for(var t=0;t<e.nodes.length;t+=1)typeof e.nodes[t]!="undefined"&&(e.nodes[t].clear(),delete e.nodes[t])},t});