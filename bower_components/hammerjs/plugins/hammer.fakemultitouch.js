(function(e){e.plugins.fakeMultitouch=function(){var t=!1;e.HAS_POINTEREVENTS=navigator.msPointerEnabled&&navigator.msMaxTouchPoints&&navigator.msMaxTouchPoints>=1,e.event.getTouchList=function(n,r){if(e.HAS_POINTEREVENTS)return e.PointerEvent.getTouchList();if(n.touches)return n.touches;r==e.EVENT_START&&(t=!1);if(n.shiftKey){t||(t={pageX:n.pageX,pageY:n.pageY});var i=t.pageX-n.pageX,s=t.pageY-n.pageY;return[{identifier:1,pageX:t.pageX-i-50,pageY:t.pageY-s- -50,target:n.target},{identifier:2,pageX:t.pageX+i- -50,pageY:t.pageY+s-50,target:n.target}]}return t=!1,[{identifier:1,pageX:n.pageX,pageY:n.pageY,target:n.target}]}}})(window.Hammer);