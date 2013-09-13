Hammer.gestures=Hammer.gestures||{},Hammer.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function(t,n){switch(t.eventType){case Hammer.EVENT_START:clearTimeout(this.timer),Hammer.detection.current.name=this.name,this.timer=setTimeout(function(){Hammer.detection.current.name=="hold"&&n.trigger("hold",t)},n.options.hold_timeout);break;case Hammer.EVENT_MOVE:t.distance>n.options.hold_threshold&&clearTimeout(this.timer);break;case Hammer.EVENT_END:clearTimeout(this.timer)}}},Hammer.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300},handler:function(t,n){if(t.eventType==Hammer.EVENT_END){var r=Hammer.detection.previous,i=!1;if(t.deltaTime>n.options.tap_max_touchtime||t.distance>n.options.tap_max_distance)return;r&&r.name=="tap"&&t.timeStamp-r.lastEvent.timeStamp<n.options.doubletap_interval&&t.distance<n.options.doubletap_distance&&(n.trigger("doubletap",t),i=!0);if(!i||n.options.tap_always)Hammer.detection.current.name="tap",n.trigger(Hammer.detection.current.name,t)}}},Hammer.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_max_touches:1,swipe_velocity:.7},handler:function(t,n){if(t.eventType==Hammer.EVENT_END){if(n.options.swipe_max_touches>0&&t.touches.length>n.options.swipe_max_touches)return;if(t.velocityX>n.options.swipe_velocity||t.velocityY>n.options.swipe_velocity)n.trigger(this.name,t),n.trigger(this.name+t.direction,t)}}},Hammer.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25},triggered:!1,handler:function(t,n){if(Hammer.detection.current.name!=this.name&&this.triggered){n.trigger(this.name+"end",t),this.triggered=!1;return}if(n.options.drag_max_touches>0&&t.touches.length>n.options.drag_max_touches)return;switch(t.eventType){case Hammer.EVENT_START:this.triggered=!1;break;case Hammer.EVENT_MOVE:if(t.distance<n.options.drag_min_distance&&Hammer.detection.current.name!=this.name)return;Hammer.detection.current.name=this.name;if(Hammer.detection.current.lastEvent.drag_locked_to_axis||n.options.drag_lock_to_axis&&n.options.drag_lock_min_distance<=t.distance)t.drag_locked_to_axis=!0;var r=Hammer.detection.current.lastEvent.direction;t.drag_locked_to_axis&&r!==t.direction&&(Hammer.utils.isVertical(r)?t.direction=t.deltaY<0?Hammer.DIRECTION_UP:Hammer.DIRECTION_DOWN:t.direction=t.deltaX<0?Hammer.DIRECTION_LEFT:Hammer.DIRECTION_RIGHT),this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),n.trigger(this.name+t.direction,t),(n.options.drag_block_vertical&&Hammer.utils.isVertical(t.direction)||n.options.drag_block_horizontal&&!Hammer.utils.isVertical(t.direction))&&t.preventDefault();break;case Hammer.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},Hammer.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1,transform_always_block:!1},triggered:!1,handler:function(t,n){if(Hammer.detection.current.name!=this.name&&this.triggered){n.trigger(this.name+"end",t),this.triggered=!1;return}if(t.touches.length<2)return;n.options.transform_always_block&&t.preventDefault();switch(t.eventType){case Hammer.EVENT_START:this.triggered=!1;break;case Hammer.EVENT_MOVE:var r=Math.abs(1-t.scale),i=Math.abs(t.rotation);if(r<n.options.transform_min_scale&&i<n.options.transform_min_rotation)return;Hammer.detection.current.name=this.name,this.triggered||(n.trigger(this.name+"start",t),this.triggered=!0),n.trigger(this.name,t),i>n.options.transform_min_rotation&&n.trigger("rotate",t),r>n.options.transform_min_scale&&(n.trigger("pinch",t),n.trigger("pinch"+(t.scale<1?"in":"out"),t));break;case Hammer.EVENT_END:this.triggered&&n.trigger(this.name+"end",t),this.triggered=!1}}},Hammer.gestures.Touch={name:"touch",index:-Infinity,defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(t,n){if(n.options.prevent_mouseevents&&t.pointerType==Hammer.POINTER_MOUSE){t.stopDetect();return}n.options.prevent_default&&t.preventDefault(),t.eventType==Hammer.EVENT_START&&n.trigger(this.name,t)}},Hammer.gestures.Release={name:"release",index:Infinity,handler:function(t,n){t.eventType==Hammer.EVENT_END&&n.trigger(this.name,t)}};