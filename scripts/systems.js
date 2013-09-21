(function(){var e={}.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["components","utils","jquery","underscore","pubsub","Vector2D","Hammer"],function(e,n,r,i,s,o,u,a){var f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L,A,O,M,_;return x=function(){function e(){}return e.prototype.world=null,e.prototype.match_component=null,e.prototype.setWorld=function(e){return this.world=e},e.prototype.getMatches=function(){return this.match_component?this.world.entities.getComponents(this.match_component):[]},e.prototype.update=function(e){var t,n,r,i;r=this.getMatches(),i=[];for(n in r)t=r[n],i.push(this.update_match(e,n,t));return i},e.prototype.update_match=function(e,t,n){},e.prototype.draw=function(e){},e}(),v=function(e){function n(e){this.canvas=e}return t(n,e),n.prototype.setWorld=function(e){return n.__super__.setWorld.call(this,e),this.world.inputs.keyboard={}},n.prototype.update=function(e){},n}(x),y=function(e){function i(e){this.canvas=e}return t(i,e),i.prototype.setWorld=function(e){var t,s,o,a=this;return i.__super__.setWorld.call(this,e),s=["left","middle","right"],t=function(e){return function(t){var r;return r="pointer_button_"+s[t.button],a.world.inputs[r]=e?n.now():null,!1}},o=function(e){return function(t){var r;return r="pointer_button_"+s[0],a.world.inputs[r]=e?n.now():null,a.world.inputs.pointer_x=t.gesture.center.pageX-a.canvas.offsetLeft,a.world.inputs.pointer_y=t.gesture.center.pageY-a.canvas.offsetTop,!1}},r(this.canvas).bind("contextmenu",function(e){return!1}).bind("mousedown",t(!0)).bind("mouseup",t(!1)).bind("mousemove",function(e){return a.world.inputs.pointer_x=e.pageX-a.canvas.offsetLeft,a.world.inputs.pointer_y=e.pageY-a.canvas.offsetTop}),u(this.canvas).on("touch",o(!0)).on("release",o(!1))},i.prototype.update=function(e){},i}(x),E=function(n){function r(){return k=r.__super__.constructor.apply(this,arguments),k}return t(r,n),r.MSG_SPAWN="spawn.spawn",r.MSG_DESPAWN="spawn.despawn",r.prototype.match_component=e.Spawn,r.prototype.setWorld=function(t){var n=this;return r.__super__.setWorld.call(this,t),this.world.subscribe(r.MSG_DESPAWN,function(t,r){var i;i=n.world.entities.get(r.entity_id,e.Spawn);if(i)return i.destroy=!0})},r.prototype.update_match=function(t,n,r){var s,o,u,a,f,l,c,h,p,d;if(!this.world)return;f=this.world.entities.get(n,e.Position);if(r.destroy){c=this.world.entities.get(n,e.Tombstone);if(c){o=c.load?this.world.entities.loadComponents(c.load):c.components,u=!1;for(h=0,p=o.length;h<p;h++){s=o[h];if(s.type!=="Spawn")continue;u=!0,s.x=f.x,s.y=f.y}u||o.push(new e.Spawn({x:f.x,y:f.y})),l=(d=this.world.entities).create.apply(d,o),a=this.world.entities.groupForEntity(n),a!==null&&this.world.entities.addToGroup(a,l)}return this.world.entities.destroy(n)}if(!r.spawned){switch(r.position_logic){case"random":f.x=i.random(0-this.world.width/2,this.world.width/2),f.y=i.random(0-this.world.height/2,this.world.height/2),f.rotation=i.random(0,Math.PI*2);break;case"at":f.x=r.x,f.y=r.y,f.rotation=r.rotation;break;default:f.x=f.y=0}r.spawned=!0,this.world.publish(this.constructor.MSG_SPAWN,{entity_id:n,spawn:r});if(r.capture_camera)return this.world.publish(C.MSG_CAPTURE_CAMERA,{entity_id:n})}else if(r.ttl!==null){r.ttl-=t;if(r.ttl<=0)return r.destroy=!0}},r}(x),b=function(n){function r(e,t,n){this.canvas=e,this.gui_size=t!=null?t:.2,this.position=n!=null?n:"bottomright",this.ctx=this.canvas.getContext("2d")}return t(r,n),r.prototype.match_component=e.Position,r.prototype.draw=function(t){var n,r,i,s,o,u,a,f,l,c,h,p,d,v,m;r=this.canvas.width,n=this.canvas.height,s=this.gui_size*Math.min(r,n);switch(this.position){case"topright":v=r-s,m=0,d=s,o=s;break;case"bottomright":v=r-s,m=n-s,d=s,o=s}l=d<o?d/this.world.width:o/this.world.height,this.ctx.save(),this.ctx.globalAlpha=.75,this.ctx.strokeStyle="#33c",this.ctx.fillStyle="#000",this.ctx.strokeRect(v,m,d,o),this.ctx.fillRect(v,m,d,o),this.ctx.translate(v+d/2,m+o/2),this.ctx.scale(l,l),c=1/l*2,h=this.world.entities.entitiesForGroup(this.world.current_scene);for(i in h){u=h[i],p=this.world.entities.get(i,e.Spawn),f=this.world.entities.get(i,e.Position),a=this.world.entities.get(i,e.RadarPing);if(!a||(p!=null?!p.spawned:!void 0)||!f)continue;this.ctx.fillStyle=a.color,this.ctx.strokeStyle=a.color,this.ctx.fillRect(f.x,f.y,c,c)}return this.ctx.restore()},r}(x),C=function(n){function r(e){var t,n,r,i,s,o;this.canvas=e,this.buffer_canvas=document.createElement("canvas"),this.ctx=this.buffer_canvas.getContext("2d"),this.screen_ctx=this.canvas.getContext("2d"),this.viewport_width=0,this.viewport_height=0,this.viewport_ratio=1,this.follow_entity=null,this.sprite_cache={},o=this.sprite_names;for(i=0,s=o.length;i<s;i++)r=o[i],t=this.source_size+10,e=document.createElement("canvas"),e.width=t,e.height=t,this.sprite_cache[r]=e,n=e.getContext("2d"),n.translate(t/2,t/2),n.lineWidth=3,n.strokeStyle="#fff",this["draw_sprite_"+r](n,this.source_size,this.source_size)}return t(r,n),r.MSG_CAPTURE_CAMERA="viewport.capture_camera",r.prototype.glow=!1,r.prototype.draw_bounding_boxes=!1,r.prototype.draw_beam_range=!1,r.prototype.grid_size=150,r.prototype.grid_color="#111",r.prototype.source_size=100,r.prototype.use_sprite_cache=!1,r.prototype.use_grid=!0,r.prototype.prev_zoom=0,r.prototype.zoom=1,r.prototype.camera_x=0,r.prototype.camera_y=0,r.prototype.sprite_names=["star","hero","enemyscout","enemycruiser","torpedo","default"],r.prototype.setWorld=function(e){var t=this;return r.__super__.setWorld.call(this,e),this.world.subscribe(this.constructor.MSG_CAPTURE_CAMERA,function(e,n){return t.follow_entity=n.entity_id})},r.prototype.draw=function(t){var n;this.follow_entity&&(n=this.world.entities.get(this.follow_entity,e.Position),n&&(this.camera_x=n.x,this.camera_y=n.y)),this.updateViewportMetrics(),this.world.inputs.pointer_x&&(this.world.inputs.pointer_world_x=(this.world.inputs.pointer_x-this.viewport_width/2)/this.zoomed_ratio+this.camera_x,this.world.inputs.pointer_world_y=(this.world.inputs.pointer_y-this.viewport_height/2)/this.zoomed_ratio+this.camera_y),this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 1.0)",this.ctx.fillRect(0,0,this.viewport_width,this.viewport_height),this.ctx.translate(this.viewport_center_left,this.viewport_center_top),this.ctx.scale(this.zoomed_ratio,this.zoomed_ratio),this.ctx.translate(0-this.camera_x,0-this.camera_y),this.draw_backdrop(t),this.draw_scene(t),this.ctx.restore(),this.world.is_paused&&this.draw_paused_bezel(t);if(this.screen_ctx)return this.screen_ctx.drawImage(this.buffer_canvas,0,0)},r.prototype.updateViewportMetrics=function(e,t){e=this.canvas.width,t=this.canvas.height;if(this.viewport_width!==e||this.viewport_height!==t||this.prev_zoom!==this.zoom)this.prev_zoom=this.zoom,this.viewport_width=e,this.viewport_height=t,this.buffer_canvas&&(this.buffer_canvas.width=e,this.buffer_canvas.height=t),this.viewport_ratio=this.viewport_width>this.viewport_height?this.viewport_width/this.world.width:this.viewport_height/this.world.height,this.viewport_center_left=this.viewport_width/2,this.viewport_center_top=this.viewport_height/2,this.zoomed_ratio=this.viewport_ratio*this.zoom;return this.visible_width=this.viewport_width/this.zoomed_ratio,this.visible_height=this.viewport_height/this.zoomed_ratio,this.visible_left=0-this.visible_width/2+this.camera_x,this.visible_top=0-this.visible_height/2+this.camera_y,this.visible_right=this.visible_left+this.visible_width,this.visible_bottom=this.visible_top+this.visible_height},r.prototype.draw_paused_bezel=function(e){var t,n,r,i,s;return s=this.canvas.width*.75,n=this.canvas.height*.25,r=(this.canvas.width-s)/2,i=(this.canvas.height-n)/2,this.ctx.globalAlpha=.85,this.ctx.strokeStyle="#fff",this.ctx.fillStyle="#000",this.ctx.fillRect(r,i,s,n),this.ctx.strokeRect(r,i,s,n),this.ctx.fillStyle="#fff",t=48*this.viewport_ratio,this.ctx.font=""+t+"px monospace",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.strokeText("Paused",r+s/2,i+n/2,s)},r.prototype.draw_backdrop=function(e){var t,n,r,i,s,o,u,a,f,l;if(!this.use_grid)return;this.ctx.save(),this.ctx.strokeStyle=this.grid_color,this.ctx.lineWidth=1,n=this.visible_left%this.grid_size,s=this.visible_left-n,t=this.visible_right;for(i=u=s,f=this.grid_size;f>0?u<=t:u>=t;i=u+=f)this.ctx.moveTo(i,this.visible_top),this.ctx.lineTo(i,this.visible_bottom);r=this.visible_top%this.grid_size,s=this.visible_top-r,t=this.visible_bottom;for(o=a=s,l=this.grid_size;l>0?a<=t:a>=t;o=a+=l)this.ctx.moveTo(this.visible_left,o),this.ctx.lineTo(this.visible_right,o);return this.ctx.stroke(),this.ctx.restore()},r.prototype.draw_scene=function(t){var n,r,i,s,o,u,a,f,l,c,h,p,d;a=this.world.entities.entitiesForGroup(this.world.current_scene),d=[];for(n in a){o=a[n],f=this.world.entities.get(n,e.Spawn);if(f!=null?!f.spawned:!void 0)continue;u=this.world.entities.get(n,e.Position);if(!u)continue;this.draw_beams(t,n,u);if(u.x<this.visible_left||u.x>this.visible_right||u.y<this.visible_top||u.y>this.visible_bottom)continue;this.ctx.save(),c=this.world.entities.get(n,e.VaporTrail),c&&this.draw_vapor_trail(t,n,c),this.ctx.translate(u.x,u.y),l=this.world.entities.get(n,e.Sprite),l&&(h=l.width,i=l.height,this.draw_bounding_boxes&&(this.ctx.strokeStyle="#33c",p=h/2,s=i/2,this.ctx.strokeRect(0-p,0-p,h,i)),this.draw_health_bar(t,n,h,i),this.draw_sprite(t,n,h,i,u,l)),r=this.world.entities.get(n,e.Explosion),r&&this.draw_explosion(t,n,r),d.push(this.ctx.restore())}return d},r.prototype.draw_vapor_trail=function(e,t,n){var r,i,s,o,u,a;this.ctx.save(),r=1/n.particles.length,this.ctx.globalAlpha=1,s=n.skip,a=n.particles;for(o=0,u=a.length;o<u;o++){i=a[o];if(s-->0)continue;this.ctx.globalAlpha-=r,this.ctx.fillStyle=n.color,this.ctx.fillRect(i.x,i.y,n.width,n.width)}return this.ctx.restore()},r.prototype.draw_explosion=function(e,t,n){var r,i,s,o,u,a;this.ctx.save(),this.ctx.strokeStyle=n.color,this.ctx.fillStyle=n.color,this.glow&&(this.ctx.shadowColor=n.color,this.ctx.shadowBlur=4),r=1-n.age/n.ttl,a=n.particles;for(o=0,u=a.length;o<u;o++){i=a[o];if(i.free)continue;this.ctx.globalAlpha=(1-i.r/i.mr)*r,s=i.s,this.ctx.beginPath(),this.ctx.moveTo(0,0),this.ctx.lineWidth=s,this.ctx.lineTo(i.x,i.y),this.ctx.stroke()}return this.ctx.restore()},r.prototype.draw_health_bar=function(t,n,r,i){var s,o,u,a;s=this.world.entities.get(n,e.Health);if(!s||!s.show_bar)return;return u=s.current/s.max,a=0-i/2-10,o=0-r/2,this.ctx.save(),this.ctx.lineWidth=2,this.ctx.strokeStyle="#333",this.glow&&(this.ctx.shadowColor="#333",this.ctx.shadowBlur=4),this.ctx.beginPath(),this.ctx.moveTo(o,a),this.ctx.lineTo(o+r,a),this.ctx.stroke(),u>0&&(this.ctx.strokeStyle="#3e3",this.glow&&(this.ctx.shadowColor="#3e3"),this.ctx.beginPath(),this.ctx.moveTo(o,a),this.ctx.lineTo(o+r*u,a),this.ctx.stroke()),this.ctx.restore()},r.prototype.draw_beams=function(t,n,r){var i,s,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E;s=this.world.entities.get(n,e.BeamWeapon);if(!s)return;l=s.x,c=s.y,g=new o(l,c),y=new o(l,s.y-6),y.rotateAround(g,r.rotation),m=Math.PI*2/s.active_beams,h=s.active_beams/s.max_beams,this.draw_beam_range&&(h=s.active_beams/s.max_beams,p=s.max_range/s.active_beams,this.ctx.save(),this.ctx.globalAlpha=.05,this.ctx.strokeStyle=s.color,this.ctx.beginPath(),this.ctx.arc(l,c,p,0,Math.PI*2,!1),this.ctx.stroke(),this.ctx.restore()),E=[];for(a=b=0,w=s.active_beams-1;0<=w?b<=w:b>=w;a=0<=w?++b:--b){i=s.beams[a];if(!i)continue;this.ctx.save(),y.rotateAround(g,m),(i!=null?i.target:void 0)&&(i!=null?!i.charging:!void 0)&&(u=1.25,d=i.x+Math.random()*u-u/2,v=i.y+Math.random()*u-u/2,f=2,this.ctx.lineWidth=f-f*.75*h,this.ctx.strokeStyle=s.color,this.glow&&(this.ctx.shadowBlur=4,this.ctx.shadowColor=s.color),this.ctx.beginPath(),this.ctx.moveTo(y.x,y.y),this.ctx.lineTo(d,v),this.ctx.stroke()),E.push(this.ctx.restore())}return E},r.prototype.draw_sprite=function(e,t,n,r,i,s){var o;this.ctx.rotate(i.rotation);if(this.use_sprite_cache){this.ctx.drawImage(this.sprite_cache[s.shape]||this.sprite_cache["default"],5,5,this.source_size,this.source_size,0-n/2,0-r/2,n,r);return}return this.ctx.fillStyle="#000",this.ctx.strokeStyle=s.stroke_style,this.glow&&(this.ctx.shadowColor=s.stroke_style,this.ctx.shadowBlur=4),this.ctx.lineWidth=1.25,o=this["draw_sprite_"+s.shape]||this.draw_sprite_default,o.call(this,this.ctx,n,r)},r.prototype.draw_sprite_default=function(e,t,n){return e.beginPath(),e.arc(0,0,t/2,0,Math.PI*2,!0),e.stroke()},r.prototype.draw_sprite_star=function(e,t,n){return e.fillStyle="#ccc",e.beginPath(),e.arc(0,0,t/2,0,Math.PI*2,!0),e.fill()},r.prototype.draw_sprite_hero=function(e,t,n){return e.rotate(Math.PI),e.beginPath(),e.moveTo(0-t*.125,0-n/2),e.lineTo(0-t*.25,0-n/2),e.lineTo(0-t*.5,0),e.arc(0,0,t/2,Math.PI,0,!0),e.lineTo(t*.25,0-n/2),e.lineTo(t*.125,0-n/2),e.lineTo(t*.25,0),e.arc(0,0,t*.25,0,Math.PI,!0),e.lineTo(0-t*.125,0-n/2),e.stroke()},r.prototype.draw_sprite_enemyscout=function(e,t,n){return e.beginPath(),e.moveTo(0,0-n*.5),e.lineTo(0-t*.45,n*.5),e.lineTo(0-t*.125,n*.125),e.lineTo(0,n*.25),e.lineTo(0+t*.125,n*.125),e.lineTo(t*.45,n*.5),e.lineTo(0,0-n*.5),e.moveTo(0,0-n*.5),e.stroke()},r.prototype.draw_sprite_enemycruiser=function(e,t,n){var r,i;return r=n/5,i=t/4,e.beginPath(),e.moveTo(0,0-r*2.5),e.lineTo(-(i*1),r*.5),e.lineTo(-(i*1.25),0-r*1.5),e.lineTo(-(i*2),r*2.5),e.arc(0-i,r*2.5,t*.25,Math.PI,Math.PI/2,!0),e.lineTo(-i*.5,r*2.5),e.arc(0,r*2.5,t*.125,Math.PI,0,!0),e.lineTo(i,r*3.75),e.arc(i,r*2.5,t*.25,Math.PI/2,0,!0),e.lineTo(i*1.25,0-r*1.5),e.lineTo(i*1,r*.5),e.lineTo(0,0-r*2.5),e.stroke()},r.prototype.draw_sprite_torpedo=function(e,t,n){return e.beginPath(),e.moveTo(0-t*.5,0),e.arc(0-t*.5,0-n*.5,t*.5,Math.PI*.5,0,!0),e.moveTo(0,0-n*.5),e.arc(t*.5,0-n*.5,t*.5,Math.PI,Math.PI*.5,!0),e.moveTo(0,n*.5),e.arc(t*.5,n*.5,t*.5,Math.PI*1,Math.PI*1.5,!1),e.moveTo(0-t*.5,0),e.arc(0-t*.5,n*.5,t*.5,Math.PI*1.5,0,!1),e.stroke()},r}(x),h=function(r){function s(){}return t(s,r),s.prototype.match_component=e.Collidable,s.prototype.update=function(t){var r,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L,A,O;b=this.world.entities.getComponents(this.match_component),d={},C=[0,1,2,3,4],r=C[0],o=C[1],u=C[2],s=C[3],a=C[4];for(m in b)v=b[m],k=this.world.entities.get(m,e.Position,e.Sprite),w=k[0],E=k[1],d[m]=[v,w.x,w.y,E.width,E.height];L=this.combinations(i.keys(d),2),O=[];for(T=0,N=L.length;T<N;T++)A=L[T],l=A[0],p=A[1],f=d[l],h=d[p],y=Math.abs(f[o]-h[o])*2,S=Math.abs(f[u]-h[u])*2,x=f[a]+h[a],g=f[s]+h[s],c=p in f[r].in_collision_with&&l in h[r].in_collision_with,y<x&&S<g?c?O.push(void 0):(f[r].in_collision_with[p]=n.now(),O.push(h[r].in_collision_with[l]=n.now())):c?(delete f[r].in_collision_with[p],O.push(delete h[r].in_collision_with[l])):O.push(void 0);return O},s.prototype.combinations=function(e,t){var n,r,i,s,o,u,a,f,l;i=[];if(e.length>0)for(n=u=0,f=e.length-1;0<=f?u<=f:u>=f;n=0<=f?++u:--u)if(t===1)i.push([e[n]]);else{s=this.combinations(e.slice(n+1,e.length),t-1);if(s.length>0)for(o=a=0,l=s.length-1;0<=l?a<=l:a>=l;o=0<=l?++a:--a)r=s[o],r.unshift(e[n]),i.push(r)}return i},s}(x),l=function(n){function r(){return L=r.__super__.constructor.apply(this,arguments),L}return t(r,n),r.prototype.match_component=e.Bouncer,r.prototype.update_match=function(t,n,r){var s,o,u,a,f;return f=this.world.entities.get(n,e.Position,e.Collidable),o=f[0],s=f[1],s&&i.keys(s.in_collision_with).length>0&&(r.x_dir=0-r.x_dir,r.y_dir=0-r.y_dir),u=this.world.width/2,a=this.world.height/2,o.x>u&&(r.x_dir=-1),o.x<-u&&(r.x_dir=1),o.y>a&&(r.y_dir=-1),o.y<-a&&(r.y_dir=1),o.x+=r.x_dir*t*r.x_sec,o.y+=r.y_dir*t*r.y_sec},r}(x),S=function(n){function r(){return A=r.__super__.constructor.apply(this,arguments),A}return t(r,n),r.prototype.match_component=e.Spin,r.prototype.update_match=function(t,n,r){var i,s;return s=this.world.entities.get(n,e.Position),i=t*r.rad_per_sec,s.rotation=(s.rotation+i)%(Math.PI*2)},r}(x),g=function(n){function r(){this.v_orbited=new o,this.v_orbiter=new o,this.v_old=new o}return t(r,n),r.prototype.match_component=e.Orbit,r.prototype.update_match=function(t,n,r){var i,s,o;o=this.world.entities.get(n,e.Position),s=this.world.entities.get(r.orbited_id,e.Position),this.v_orbited.setValues(s.x,s.y),this.v_orbiter.setValues(o.x,o.y),i=t*r.rad_per_sec,this.v_orbiter.rotateAround(this.v_orbited,i),this.v_old.setValues(o.x,o.y),o.x=this.v_orbiter.x,o.y=this.v_orbiter.y;if(r.rotate)return o.rotation=this.v_old.angleTo(this.v_orbiter)+Math.PI*.5},r}(x),w=function(n){function r(){this.v_seeker=new o,this.v_target=new o}return t(r,n),r.prototype.match_component=e.Seeker,r.prototype.update_match=function(t,n,r){var s,o,u,a,f,l,c;if(!r.target)return;f=this.world.entities.get(n,e.Position);if(!f)return;if(r.acquisition_delay>0){r.acquisition_delay-=t;return}c=r.target,i.isObject(c)||(c=this.world.entities.get(r.target,e.Position));if(!c||!c.x&&c.y)return;this.v_seeker.setValues(f.x,f.y),this.v_target.setValues(c.x,c.y),l=this.v_seeker.angleTo(this.v_target)+Math.PI*.5,l<0&&(l+=2*Math.PI),r.error>0&&(u=r.rad_per_sec*r.error,l+=u/2-u*Math.random()),o=l<f.rotation?-1:1,a=Math.abs(l-f.rotation),a>Math.PI&&(o=0-o),s=t*r.rad_per_sec,s>a&&(s=a),f.rotation=(f.rotation+o*s)%(Math.PI*2);if(f.rotation<0)return f.rotation+=2*Math.PI},r}(x),T=function(n){function r(){this.v_inertia=new o,this.v_thrust=new o}return t(r,n),r.prototype.match_component=e.Thruster,r.prototype.update_match=function(t,n,r){var i,s,o,u;return o=this.world.entities.get(n,e.Position),this.v_inertia.setValues(r.dx,r.dy),u=t*r.dv,r.active?(this.v_thrust.setValues(0,0-u),this.v_thrust.rotate(o.rotation),this.v_inertia.add(this.v_thrust),i=this.v_inertia.magnitude(),i>r.max_v&&(s=r.max_v/i,this.v_inertia.multiplyScalar(s))):(this.v_inertia.addScalar(0-u),this.v_inertia.x<0&&(this.v_inertia.x=0),this.v_inertia.y<0&&(this.v_inertia.y=0)),r.dx=this.v_inertia.x,r.dy=this.v_inertia.y,o.x+=t*r.dx,o.y+=t*r.dy},r}(x),c=function(n){function r(){return O=r.__super__.constructor.apply(this,arguments),O}return t(r,n),r.prototype.match_component=e.ClickCourse,r.prototype.update_match=function(t,n,r){var i,s,o,u,a,f;i=this.world.entities.get(n,e.Position),o=this.world.entities.get(n,e.Sprite),s=this.world.entities.get(n,e.Seeker),u=this.world.entities.get(n,e.Thruster),r.active&&this.world.inputs.pointer_button_left&&(r.x=this.world.inputs.pointer_world_x,r.y=this.world.inputs.pointer_world_y,u!=null&&(u.active=!0),s!=null&&(s.target={x:r.x,y:r.y})),a=Math.abs(i.x-r.x),f=Math.abs(i.y-r.y);if(a<o.width/2&&f<o.height/2)return r.stop_on_arrival&&u!=null&&(u.active=!1),s!=null?s.target=null:void 0},r}(x),m=function(n){function r(){this.v_center=new o(0,0),this.v_pos=new o(0,0),this.v_unit=new o(0,0)}return t(r,n),r.DAMAGE_TYPE="Missile",r.prototype.match_component=e.MissileWeapon,r.prototype.update_match=function(t,n,r){var i,s;return i=this.world.entities.get(n,e.Position),s=this.world.entities.get(n,e.Sprite),r.x=i.x,r.y=i.y,r.rotation=i.rotation,r.length=50,this.load_turrets(t,r,n),this.target_turrets(t,r,n),this.fire_turrets(t,r,n,i)},r.prototype.load_turrets=function(e,t,n){var r,i,s,o,u;u=[];for(r=s=0,o=t.active_turrets-1;0<=o?s<=o:s>=o;r=0<=o?++s:--s)i=t.turrets[r],i.loading>0&&(i.loading-=e),i.loading<=0?(i.loading=0,u.push(i.target=null)):u.push(void 0);return u},r.prototype.target_turrets=function(t,n,r){var i,s,o,u,a,f,l,c,h,p,d,v,m;h=[];for(s=d=0,v=n.active_turrets-1;0<=v?d<=v:d>=v;s=0<=v?++d:--d)p=n.turrets[s],p.loading===0&&p.target===null&&h.push(p);if(h.length===0)return;o=Math.pow(n.target_range,2),c=this.world.entities.getComponents(e.WeaponsTarget),i=[];for(u in c){l=c[u];if(u===r)continue;if(l.team!==n.target_team)continue;a=this.world.entities.get(u,e.Position),f=(a.x-n.x)*(a.x-n.x)+(a.y-n.y)*(a.y-n.y),f<=o&&i.push([f,u])}if(i.length){i.sort(function(e,t){return e[0]-t[0]}),m=[];while(h.length)m.push(function(){var e,t,n,r;r=[];for(e=0,t=i.length;e<t;e++){n=i[e],f=n[0],u=n[1],p=h.pop();if(!p)break;r.push(p.target=u)}return r}());return m}},r.prototype.fire_turrets=function(e,t,n,r){var i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E;p=4,this.v_unit.setValues(0,0-t.length/t.active_turrets),this.v_unit.rotateAround({x:0,y:0},r.rotation),this.v_pos.setValues(t.x,t.y+t.length/2),this.v_pos.rotateAround({x:t.x,y:t.y},r.rotation),E=[];for(a=m=0,b=t.active_turrets-1;0<=b?m<=b:m>=b;a=0<=b?++m:--m){this.v_pos.add(this.v_unit),d=t.turrets[a];if(d.target===null||d.loading>0)continue;l=t.missile,i=l.color,h=r.rotation+(a%2===0?Math.PI/2:0-Math.PI/2),c={Position:{},Sprite:{shape:"enemyscout",width:p,height:p,stroke_style:i},Spawn:{x:this.v_pos.x,y:this.v_pos.y,rotation:h,ttl:l.ttl},Collidable:{on_collide:{destruct:!0,damage:l.damage}},Thruster:{dv:l.speed,max_v:l.speed,active:!0},Seeker:{rad_per_sec:l.rad_per_sec,acquisition_delay:l.acquisition_delay*Math.random(),error:l.error,target:d.target},Health:{max:l.health,show_bar:!1},RadarPing:{color:i,size:3},VaporTrail:{color:"#aaa",history:15,skip:3,width:1},WeaponsTarget:{team:"invaders"},Tombstone:{load:{Position:{},Explosion:{ttl:.75,radius:p*2,max_particles:15,max_particle_size:1.5,max_velocity:100,color:i}}}},c.Missile={};for(v=g=0,y=l.length;g<y;v=++g)f=l[v],c.Missile[f]=v;s=this.world.entities.loadComponents(c),o=(w=this.world.entities).create.apply(w,s),u=this.world.entities.groupForEntity(n),this.world.entities.addToGroup(u,o),d.loading=t.loading_time,E.push(d.target=null)}return E},r}(x),f=function(n){function r(){this.stats={}}return t(r,n),r.DAMAGE_TYPE="Beam",r.prototype.match_component=e.BeamWeapon,r.prototype.update_match=function(t,n,r){var i,s,o,u,a;s=this.world.entities.get(n,e.Position),r.x=s.x,r.y=s.y,r.active_beams=Math.min(r.active_beams,r.max_beams);if(r.active_beams===0)return;o=this.calculate_stats(r);for(i in o)a=o[i],r.current_stats[i]=a;return u=this.charge_beams(t,o,r),u.length>0&&this.target_beams(t,o,r,n,u),this.discharge_beams(t,o,r,n)},r.prototype.calculate_stats=function(e){var t,n,r,i;return r=""+e.active_beams+":"+e.max_power,r in this.stats||(t=e.active_beams,i=e.active_beams/e.max_beams,n=e.max_range/e.active_beams,this.stats[r]={max_charge:e.max_power/(t*t),charge_rate:e.charge_rate/t,discharge_rate:e.discharge_rate/t,beam_range:n,beam_range_sq:Math.pow(n,2),dmg_penalty:1-i*e.dmg_penalty}),this.stats[r]},r.prototype.charge_beams=function(e,t,n){var r,i,s,o,u;s=[];for(i=o=0,u=n.active_beams-1;0<=u?o<=u:o>=u;i=0<=u?++o:--o)r=n.beams[i],r.charging&&(r.charge+=t.charge_rate*e,r.charge>=t.max_charge&&(r.charge=t.max_charge,r.charging=!1,r.target=null)),r.target===null&&s.push(r);return s},r.prototype.target_beams=function(t,n,r,i,s){var o,u,a,f,l,c,h,p;h=this.world.entities.getComponents(e.WeaponsTarget),u=[];for(a in h){c=h[a];if(a===i)continue;if(c.team!==r.target_team)continue;f=this.world.entities.get(a,e.Position),l=(f.x-r.x)*(f.x-r.x)+(f.y-r.y)*(f.y-r.y),l<=n.beam_range_sq&&u.push([l,a])}if(u.length){u.sort(function(e,t){return e[0]-t[0]}),p=[];while(s.length)p.push(function(){var e,t,n,r;r=[];for(e=0,t=u.length;e<t;e++){n=u[e],l=n[0],a=n[1],o=s.pop();if(!o)break;r.push(o.target=a)}return r}());return p}},r.prototype.discharge_beams=function(t,n,r,i){var s,o,u,a,f,l,c,h;h=[];for(a=l=0,c=r.active_beams-1;0<=c?l<=c:l>=c;a=0<=c?++l:--l){s=r.beams[a];if(s.charging||s.target===null)continue;o=n.discharge_rate*t,s.charge<o&&(o=s.charge),s.charge-=o,s.charge<=0&&(s.charge=0,s.charging=!0),u=o*n.dmg_penalty,f=this.world.entities.get(s.target,e.Position),f?(s.x=f.x,s.y=f.y,h.push(this.world.publish(d.MSG_DAMAGE,{to:s.target,from:i,kind:this.constructor.DAMAGE_TYPE,amount:u}))):h.push(void 0)}return h},r}(x),d=function(n){function r(){return M=r.__super__.constructor.apply(this,arguments),M}return t(r,n),r.MSG_DAMAGE="health.damage",r.MSG_HEAL="health.heal",r.prototype.match_component=e.Health,r.prototype.setWorld=function(t){var n=this;return r.__super__.setWorld.call(this,t),this.world.subscribe(this.constructor.MSG_DAMAGE,function(t,r){var i;i=n.world.entities.get(r.to,e.Health);if(!i)return;return i.current-=r.amount}),this.world.subscribe(this.constructor.MSG_HEAL,function(t,r){var i;i=n.world.entities.get(r.to,e.Health);if(!i)return;return i.health+=r.amount})},r.prototype.update_match=function(e,t,n){if(n.current<0)return this.world.publish(E.MSG_DESPAWN,{entity_id:t})},r}(x),N=function(n){function r(){return _=r.__super__.constructor.apply(this,arguments),_}return t(r,n),r.prototype.match_component=e.VaporTrail,r.prototype.update_match=function(t,n,r){var i,s;return s=this.world.entities.get(n,e.Position),i=r.particles.pop(),i.x=s.x,i.y=s.y,r.particles.unshift(i)},r}(x),p=function(n){function r(){this.v_center=new o(0,0),this.v_scratch=new o(0,0)}return t(r,n),r.prototype.match_component=e.Explosion,r.prototype.update_match=function(e,t,n){var r,i,s,o,u,a,f,l;f=n.particles;for(s=0,u=f.length;s<u;s++)i=f[s],!n.stop&&i.free&&(i.x=i.y=0,this.v_scratch.setValues(0,n.max_velocity*Math.random()),this.v_scratch.rotateAround(this.v_center,Math.PI*2*Math.random()),i.dx=this.v_scratch.x,i.dy=this.v_scratch.y,i.mr=n.radius*Math.random(),i.s=n.max_particle_size,i.free=!1),i.free||(i.x+=i.dx*e,i.y+=i.dy*e,this.v_scratch.setValues(i.x,i.y),i.r=this.v_scratch.dist(this.v_center),i.r>=i.mr&&(i.r=i.mr,i.free=!0));n.age+=e,!n.stop&&n.age>=n.ttl*.75&&(n.stop=!0);if(n.stop){r=!0,l=n.particles;for(o=0,a=l.length;o<a;o++){i=l[o];if(!i.free){r=!1;break}}if(r||n.age>=n.ttl)return n.age=n.ttl,this.world.publish(E.MSG_DESPAWN,{entity_id:t})}},r}(x),{System:x,SpawnSystem:E,BouncerSystem:l,SpinSystem:S,OrbiterSystem:g,ViewportSystem:C,PointerInputSystem:y,CollisionSystem:h,SeekerSystem:w,ThrusterSystem:T,ClickCourseSystem:c,KeyboardInputSystem:v,BeamWeaponSystem:f,HealthSystem:d,ExplosionSystem:p,RadarSystem:b,MissileWeaponSystem:m,VaporTrailSystem:N}})}).call(this);