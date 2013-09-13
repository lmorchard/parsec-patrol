var THREEx=THREEx||{};THREEx.KeyboardState=function(e){this.domElement=e||document,this.keyCodes={},this.modifiers={};var t=this;this._onKeyDown=function(e){t._onKeyChange(e)},this._onKeyUp=function(e){t._onKeyChange(e)},this.domElement.addEventListener("keydown",this._onKeyDown,!1),this.domElement.addEventListener("keyup",this._onKeyUp,!1)},THREEx.KeyboardState.prototype.destroy=function(){this.domElement.removeEventListener("keydown",this._onKeyDown,!1),this.domElement.removeEventListener("keyup",this._onKeyUp,!1)},THREEx.KeyboardState.MODIFIERS=["shift","ctrl","alt","meta"],THREEx.KeyboardState.ALIAS={left:37,up:38,right:39,down:40,space:32,pageup:33,pagedown:34,tab:9,escape:27},THREEx.KeyboardState.prototype._onKeyChange=function(e){var t=e.keyCode,n=e.type==="keydown"?!0:!1;this.keyCodes[t]=n,this.modifiers.shift=e.shiftKey,this.modifiers.ctrl=e.ctrlKey,this.modifiers.alt=e.altKey,this.modifiers.meta=e.metaKey},THREEx.KeyboardState.prototype.pressed=function(e){var t=e.split("+");for(var n=0;n<t.length;n++){var r=t[n],i=!1;THREEx.KeyboardState.MODIFIERS.indexOf(r)!==-1?i=this.modifiers[r]:Object.keys(THREEx.KeyboardState.ALIAS).indexOf(r)!=-1?i=this.keyCodes[THREEx.KeyboardState.ALIAS[r]]:i=this.keyCodes[r.toUpperCase().charCodeAt(0)];if(!i)return!1}return!0},THREEx.KeyboardState.prototype.eventMatches=function(e,t){var n=THREEx.KeyboardState.ALIAS,r=Object.keys(n),i=t.split("+");for(var s=0;s<i.length;s++){var o=i[s],u=!1;o==="shift"?u=e.shiftKey?!0:!1:o==="ctrl"?u=e.ctrlKey?!0:!1:o==="alt"?u=e.altKey?!0:!1:o==="meta"?u=e.metaKey?!0:!1:r.indexOf(o)!==-1?u=e.keyCode===n[o]?!0:!1:e.keyCode===o.toUpperCase().charCodeAt(0)&&(u=!0);if(!u)return!1}return!0};