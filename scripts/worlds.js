(function(){var e=[].slice,t={}.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return i.prototype=n.prototype,e.prototype=new i,e.__super__=n.prototype,e};define(["utils","entities","components","systems","underscore","pubsub","Stats"],function(t,r,i,s,o,u,a){var f,l,c,h,p;return p=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){return setTimeout(e,1e3/60)},c=60,l=1e3/c,h=function(){function n(){var n,i,s;s=arguments[0],n=arguments[1],i=3<=arguments.length?e.call(arguments,2):[],this.width=s!=null?s:640,this.height=n!=null?n:480,this.id=t.generateID(),this.is_running=!1,this.is_paused=!1,this.inputs={},this.entities=new r.EntityManager,this.systems=[],this.msg_subscribers={},this.addSystem.apply(this,i)}return n.prototype.measure_fps=!1,n.prototype.tick_duration=l,n.prototype.max_t_delta=l*5,n.prototype.ticks=0,n.prototype._psPrefix=function(e){return e==null&&(e=null),e=e?"."+e:"","worlds."+this.id+e},n.prototype.subscribe=function(e,t){var n;return((n=this.msg_subscribers)[e]!=null?(n=this.msg_subscribers)[e]:n[e]=[]).push(t)},n.prototype.publish=function(e,t){var n,r,i,s,o;if(!this.msg_subscribers[e])return;s=this.msg_subscribers[e],o=[];for(r=0,i=s.length;r<i;r++)n=s[r],o.push(n(e,t));return o},n.prototype.unsubscribe=function(e){},n.prototype.addSystem=function(){var t,n,r,i;n=1<=arguments.length?e.call(arguments,0):[];for(r=0,i=n.length;r<i;r++)t=n[r],t.setWorld(this),this.systems.push(t);return this},n.prototype.removeSystem=function(e){return e.world=null,this.systems.splice(this.systems.indexOf(e),1),this},n.prototype.tick=function(e){var t,n,r,i;this.ticks++,i=this.systems;for(n=0,r=i.length;n<r;n++)t=i[n],t.update(e);return this},n.prototype.draw=function(e){var t,n,r,i;i=this.systems;for(n=0,r=i.length;n<r;n++)t=i[n],t.draw(e);return this},n.prototype.load=function(e){return this.entities.load(e),this.current_scene=e.current_scene,this},n.prototype.save=function(e){return e=this.entities.save(),e.current_scene=this.current_scene,e},n.prototype.start=function(){var e,t=this;if(this.is_running)return;return this.is_running=!0,this.t_last=0,this.accumulator=0,this.tick_duration_sec=this.tick_duration/1e3,this.measure_fps&&(this.stats=new a,this.stats.setMode(0),document.body.appendChild(this.stats.domElement)),e=function(n){var r;t.measure_fps&&t.stats.begin(),r=Math.min(n-t.t_last,t.max_t_delta),t.t_last=n,t.draw(r);if(!t.is_paused){t.accumulator+=r;while(t.accumulator>t.tick_duration)t.tick(t.tick_duration_sec),t.accumulator-=t.tick_duration}t.measure_fps&&t.stats.end();if(t.is_running)return p(e)},p(e),this},n.prototype.stop=function(){return this.is_running=!1,this},n.prototype.pause=function(){return this.is_paused=!0,this},n.prototype.unpause=function(){return this.is_paused=!1,this},n}(),f=function(e){function t(){t.__super__.constructor.apply(this,arguments)}return n(t,e),t}(h),{World:h,BasicWorld:f}})}).call(this);