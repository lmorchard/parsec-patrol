(function(){var e={}.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t},n=[].slice;define(["components","utils","jquery","underscore","pubsub","Vector2D","Hammer","THREEx.KeyboardState","QuadTree"],function(e,r,i,s,o,u,a,f,l){var c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L,A,O,M,_,D,P,H,B,j;return L=function(){function e(){}return e.prototype.world=null,e.prototype.match_component=null,e.prototype.setWorld=function(e){return this.world=e},e.prototype.getMatches=function(){return this.match_component?this.world.entities.getComponents(this.match_component):[]},e.prototype.update=function(e){var t,n,r,i;r=this.getMatches(),i=[];for(n in r)t=r[n],i.push(this.updateMatch(e,n,t));return i},e.prototype.updateMatch=function(e,t,n){},e.prototype.draw=function(e){},e}(),g=function(e){function n(e){this.canvas=e}return t(n,e),n.prototype.setWorld=function(e){return n.__super__.setWorld.call(this,e),this.world.inputs.keyboard={}},n.prototype.update=function(e){},n}(L),E=function(e){function n(e){this.canvas=e}return t(n,e),n.prototype.setWorld=function(e){var t,s,o,u=this;return n.__super__.setWorld.call(this,e),s=["left","middle","right"],t=function(e){return function(t){var n;return n="pointer_button_"+s[t.button],u.world.inputs[n]=e?r.now():null,!1}},o=function(e){return function(t){var n;return n="pointer_button_"+s[0],u.world.inputs[n]=e?r.now():null,u.world.inputs.pointer_x=t.gesture.center.pageX-u.canvas.offsetLeft,u.world.inputs.pointer_y=t.gesture.center.pageY-u.canvas.offsetTop,!1}},i(this.canvas).bind("contextmenu",function(e){return!1}).bind("mousedown",t(!0)).bind("mouseup",t(!1)).bind("mousemove",function(e){return u.world.inputs.pointer_x=e.pageX-u.canvas.offsetLeft,u.world.inputs.pointer_y=e.pageY-u.canvas.offsetTop}),a(this.canvas).on("touch",o(!0)).on("release",o(!1))},n.prototype.update=function(e){},n}(L),N=function(n){function r(){return _=r.__super__.constructor.apply(this,arguments),_}return t(r,n),r.MSG_SPAWN="spawn.spawn",r.MSG_DESPAWN="spawn.despawn",r.prototype.match_component=e.Spawn,r.prototype.setWorld=function(t){var n=this;return r.__super__.setWorld.call(this,t),this.world.subscribe(r.MSG_DESPAWN,function(t,r){var i;i=n.world.entities.get(r.entity_id,e.Spawn);if(i)return i.destroy=!0})},r.prototype.updateMatch=function(t,n,r){var i,o,u,a,f,l,c,h,p,d;if(!this.world)return;f=this.world.entities.get(n,e.Position);if(r.destroy){c=this.world.entities.get(n,e.Tombstone);if(c){o=c.load?this.world.entities.loadComponents(c.load):c.components,u=!1;for(h=0,p=o.length;h<p;h++){i=o[h];if(i.type!=="Spawn")continue;u=!0,i.x=f.x,i.y=f.y}u||o.push(new e.Spawn({x:f.x,y:f.y})),l=(d=this.world.entities).create.apply(d,o),a=this.world.entities.groupForEntity(n),a!==null&&this.world.entities.addToGroup(a,l)}return this.world.entities.destroy(n)}if(!r.spawned){switch(r.position_logic){case"random":f.x=s.random(0-this.world.width/2,this.world.width/2),f.y=s.random(0-this.world.height/2,this.world.height/2),f.rotation=s.random(0,Math.PI*2);break;case"at":f.x=r.x,f.y=r.y,f.rotation=r.rotation;break;default:f.x=f.y=0}r.spawned=!0,this.world.publish(this.constructor.MSG_SPAWN,{entity_id:n,spawn:r});if(r.capture_camera)return this.world.publish(M.MSG_CAPTURE_CAMERA,{entity_id:n})}else if(r.ttl!==null){r.ttl-=t;if(r.ttl<=0)return r.destroy=!0}},r}(L),x=function(n){function r(e,t,n){this.canvas=e,this.gui_size=t!=null?t:.2,this.position=n!=null?n:"bottomright",this.ctx=this.canvas.getContext("2d")}return t(r,n),r.prototype.match_component=e.Position,r.prototype.draw=function(t){var n,r,i,s,o,u,a,f,l,c,h,p,d,v,m;r=this.canvas.width,n=this.canvas.height,s=this.gui_size*Math.min(r,n);switch(this.position){case"topright":v=r-s,m=0,d=s,o=s;break;case"bottomright":v=r-s,m=n-s,d=s,o=s}l=d<o?d/this.world.width:o/this.world.height,this.ctx.save(),this.ctx.globalAlpha=.75,this.ctx.strokeStyle="#33c",this.ctx.fillStyle="#000",this.ctx.strokeRect(v,m,d,o),this.ctx.fillRect(v,m,d,o),this.ctx.translate(v+d/2,m+o/2),this.ctx.scale(l,l),c=1/l*2,h=this.world.entities.entitiesForGroup(this.world.current_scene);for(i in h){u=h[i],p=this.world.entities.get(i,e.Spawn),f=this.world.entities.get(i,e.Position),a=this.world.entities.get(i,e.RadarPing);if(!a||(p!=null?!p.spawned:!void 0)||!f)continue;this.ctx.fillStyle=a.color,this.ctx.strokeStyle=a.color,this.ctx.fillRect(f.x,f.y,c,c)}return this.ctx.restore()},r}(L),M=function(n){function r(e){this.canvas=e,this.ctx=this.canvas.getContext("2d"),this.viewport_width=0,this.viewport_height=0,this.viewport_ratio=1,this.follow_entity=null}return t(r,n),r.MSG_CAPTURE_CAMERA="viewport.capture_camera",r.MSG_DRAW_SCENE_PRE_TRANSLATE="viewport.draw_scene_pre_translate",r.MSG_DRAW_SCENE_POST_TRANSLATE="viewport.draw_scene_post_translate",r.MSG_PRE_DRAW_SCENE="viewport.pre_draw_scene",r.MSG_POST_DRAW_SCENE="viewport.post_draw_scene",r.prototype.glow=!1,r.prototype.draw_mass=!1,r.prototype.grid_size=150,r.prototype.grid_color="#111",r.prototype.source_size=100,r.prototype.prev_zoom=0,r.prototype.zoom=1,r.prototype.camera_x=0,r.prototype.camera_y=0,r.prototype.setWorld=function(e){var t=this;return r.__super__.setWorld.call(this,e),this.world.subscribe(this.constructor.MSG_CAPTURE_CAMERA,function(e,n){return t.follow_entity=n.entity_id})},r.prototype.draw=function(t){var n;this.follow_entity&&(n=this.world.entities.get(this.follow_entity,e.Position),n&&(this.camera_x=n.x,this.camera_y=n.y)),this.updateViewportMetrics(),this.world.inputs.pointer_x&&(this.world.inputs.pointer_world_x=(this.world.inputs.pointer_x-this.viewport_width/2)/this.zoomed_ratio+this.camera_x,this.world.inputs.pointer_world_y=(this.world.inputs.pointer_y-this.viewport_height/2)/this.zoomed_ratio+this.camera_y),this.ctx.save(),this.ctx.fillStyle="rgba(0, 0, 0, 1.0)",this.ctx.fillRect(0,0,this.viewport_width,this.viewport_height),this.ctx.translate(this.viewport_center_left,this.viewport_center_top),this.ctx.scale(this.zoomed_ratio,this.zoomed_ratio),this.ctx.translate(0-this.camera_x,0-this.camera_y),this.draw_backdrop(t),this.world.publish(this.constructor.MSG_PRE_DRAW_SCENE,t,this.ctx),this.draw_scene(t),this.world.publish(this.constructor.MSG_POST_DRAW_SCENE,t,this.ctx),this.ctx.restore();if(this.world.is_paused)return this.draw_paused_bezel(t)},r.prototype.updateViewportMetrics=function(e,t){e=this.canvas.width,t=this.canvas.height;if(this.viewport_width!==e||this.viewport_height!==t||this.prev_zoom!==this.zoom)this.prev_zoom=this.zoom,this.viewport_width=e,this.viewport_height=t,this.viewport_ratio=this.viewport_width>this.viewport_height?this.viewport_width/this.world.width:this.viewport_height/this.world.height,this.viewport_center_left=this.viewport_width/2,this.viewport_center_top=this.viewport_height/2,this.zoomed_ratio=this.viewport_ratio*this.zoom,this.visible_width=this.viewport_width/this.zoomed_ratio,this.visible_height=this.viewport_height/this.zoomed_ratio;return this.visible_left=0-this.visible_width/2+this.camera_x,this.visible_top=0-this.visible_height/2+this.camera_y,this.visible_right=this.visible_left+this.visible_width,this.visible_bottom=this.visible_top+this.visible_height},r.prototype.draw_paused_bezel=function(e){var t,n,r,i,s;return s=this.canvas.width*.75,n=this.canvas.height*.25,r=(this.canvas.width-s)/2,i=(this.canvas.height-n)/2,this.ctx.globalAlpha=.85,this.ctx.strokeStyle="#fff",this.ctx.fillStyle="#000",this.ctx.fillRect(r,i,s,n),this.ctx.strokeRect(r,i,s,n),this.ctx.fillStyle="#fff",t=48*this.viewport_ratio,this.ctx.font=""+t+"px monospace",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.strokeText("Paused",r+s/2,i+n/2,s)},r.prototype.draw_backdrop=function(e){var t,n,r,i,s,o,u,a,f,l;this.ctx.strokeStyle=this.grid_color,this.ctx.lineWidth=1,this.ctx.beginPath(),n=this.visible_left%this.grid_size,s=this.visible_left-n,t=this.visible_right;for(i=u=s,f=this.grid_size;f>0?u<=t:u>=t;i=u+=f)this.ctx.moveTo(i,this.visible_top),this.ctx.lineTo(i,this.visible_bottom);r=this.visible_top%this.grid_size,s=this.visible_top-r,t=this.visible_bottom;for(o=a=s,l=this.grid_size;l>0?a<=t:a>=t;o=a+=l)this.ctx.moveTo(this.visible_left,o),this.ctx.lineTo(this.visible_right,o);return this.ctx.stroke()},r.prototype.draw_scene=function(t){var n,r,i,s,o,u,a,f,l;u=this.world.entities.entitiesForGroup(this.world.current_scene),l=[];for(n in u){r=u[n],a=this.world.entities.get(n,e.Spawn);if(a!=null?!a.spawned:!void 0)continue;o=this.world.entities.get(n,e.Position);if(!o)continue;f=this.world.entities.get(n,e.Sprite),s=f?f.width/2:0,i=f?f.height/2:0;if(o.x<this.visible_left-s||o.x>this.visible_right+s||o.y<this.visible_top-i||o.y>this.visible_bottom+i)continue;this.ctx.save(),this.world.publish(this.constructor.MSG_DRAW_SCENE_PRE_TRANSLATE,t,this.ctx,n,o,a,f),this.ctx.translate(o.x,o.y),this.world.publish(this.constructor.MSG_DRAW_SCENE_POST_TRANSLATE,t,this.ctx,n,o,a,f),this.draw_sprite(t,n,o,f),l.push(this.ctx.restore())}return l},r.prototype.draw_sprite=function(e,t,n,r){var i,s,o,u,a,f;if(!r)return;return f=r.width,o=r.height,s=100,i=100,this.ctx.rotate(n.rotation+Math.PI/2),this.ctx.scale(f/s,o/i),this.ctx.fillStyle="#000",this.ctx.strokeStyle=r.stroke_style,u=s/f,this.glow&&(this.ctx.shadowColor=r.stroke_style,this.ctx.shadowBlur=4*u),this.ctx.lineWidth=.75*u,a=this["draw_sprite_"+r.shape]||this.draw_sprite_default,a.call(this,this.ctx,r,e)},r.prototype.draw_sprite_default=function(e,t,n){return e.strokeRect(-50,-50,100,100)},r.prototype.draw_sprite_star=function(e,t,n){return e.fillStyle="#ccc",e.beginPath(),e.arc(0,0,50,0,Math.PI*2,!0),e.fill()},r.prototype.draw_sprite_hero=function(e,t,n){return e.rotate(Math.PI),e.beginPath(),e.moveTo(-12.5,-50),e.lineTo(-25,-50),e.lineTo(-50,0),e.arc(0,0,50,Math.PI,0,!0),e.lineTo(25,-50),e.lineTo(12.5,-50),e.lineTo(25,0),e.arc(0,0,25,0,Math.PI,!0),e.lineTo(-12.5,-50),e.stroke()},r.prototype.draw_sprite_enemyscout=function(e,t,n){return e.beginPath(),e.moveTo(0,-50),e.lineTo(-45,50),e.lineTo(-12.5,12.5),e.lineTo(0,25),e.lineTo(12.5,12.5),e.lineTo(45,50),e.lineTo(0,-50),e.moveTo(0,-50),e.stroke()},r.prototype.draw_sprite_enemycruiser=function(e,t,n){var r,i,s,o;return s=100,r=100,i=r/5,o=s/4,e.beginPath(),e.moveTo(0,0-i*2.5),e.lineTo(-(o*1),i*.5),e.lineTo(-(o*1.25),0-i*1.5),e.lineTo(-(o*2),i*2.5),e.arc(0-o,i*2.5,s*.25,Math.PI,Math.PI/2,!0),e.lineTo(-o*.5,i*2.5),e.arc(0,i*2.5,s*.125,Math.PI,0,!0),e.lineTo(o,i*3.75),e.arc(o,i*2.5,s*.25,Math.PI/2,0,!0),e.lineTo(o*1.25,0-i*1.5),e.lineTo(o*1,i*.5),e.lineTo(0,0-i*2.5),e.stroke()},r.prototype.draw_sprite_torpedo=function(e,t,n){return e.beginPath(),e.moveTo(-50,0),e.arc(-50,-50,50,Math.PI*.5,0,!0),e.moveTo(0,-50),e.arc(50,-50,50,Math.PI,Math.PI*.5,!0),e.moveTo(0,50),e.arc(50,50,50,Math.PI*1,Math.PI*1.5,!1),e.moveTo(-50,0),e.arc(-50,50,50,Math.PI*1.5,0,!1),e.stroke()},r.prototype.draw_sprite_asteroid=function(e,t,n){var r,i,o,a,f,l,c,h,p,d;if(!t.points){o=8+Math.floor(8*Math.random()),r=50,i=35,a=Math.PI*2/o,l=new u(0,0),c=new u(0,0),t.points=[];for(f=h=1;1<=o?h<=o:h>=o;f=1<=o?++h:--h)c.setValues(s.random(i,r),0),c.rotateAround(l,f*a),t.points.push([c.x,c.y])}e.beginPath(),e.moveTo(t.points[0][0],t.points[0][1]);for(f=p=1,d=t.points.length-1;1<=d?p<=d:p>=d;f=1<=d?++p:--p)e.lineTo(t.points[f][0],t.points[f][1]);return e.lineTo(t.points[0][0],t.points[0][1]),e.stroke()},r}(L),d=function(r){function i(e,t){this.debug_bounding_boxes=e!=null?e:!1,this.debug_quadtrees=t!=null?t:!1}return t(i,r),i.prototype.match_component=e.Collidable,i.prototype.setWorld=function(e){var t=this;return i.__super__.setWorld.call(this,e),this.world.subscribe(M.MSG_PRE_DRAW_SCENE,function(){var e,r;return r=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],t.drawDebugQuadtree.apply(t,e)}),this.world.subscribe(M.MSG_DRAW_SCENE_POST_TRANSLATE,function(){var e,r;return r=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],t.drawDebugEntity.apply(t,e)})},i.prototype.drawDebugQuadtree=function(e,t){var n,r,i;if(!this.debug_quadtrees)return;r=this.world.current_scene,i=this.world.entities.quadtrees[r];if(!i)return;return t.save(),i.v2?(n=function(e){var r,i,s,o,u,a;t.strokeStyle="#404",r=e.bounds,t.strokeRect(r.x,r.y,r.width,r.height),u=e.nodes,a=[];for(s=0,o=u.length;s<o;s++)i=u[s],a.push(n(i));return a},n(i)):(n=function(e){var r,i,s,o,u,a;r=e._bounds,t.strokeRect(r.x,r.y,r.width,r.height),u=e.nodes,a=[];for(s=0,o=u.length;s<o;s++)i=u[s],a.push(n(i));return a},n(i.root)),t.restore()},i.prototype.drawDebugEntity=function(e,t,n,r,i,s){var o,u,a,f,l,c;if(!this.debug_bounding_boxes)return;if(!s)return;return f=s.width,o=s.height,t.strokeStyle="#33c",a=(c=this.world.entities.store.CollisionCircle)!=null?c[n]:void 0,a?(t.beginPath(),t.arc(0,0,a.radius,Math.PI*2,!1),t.stroke()):(l=f/2,u=o/2,t.strokeRect(0-l,0-l,f,o))},i.prototype.update=function(e){var t,n,r,i;r=this.world.entities.getComponents(this.match_component),i=[];for(n in r)t=r[n],i.push(this.checkCollisions(n,t));return i},i.prototype.checkCollisions=function(e,t){var n,r,i,s,o,u,a,f,l,c,h,p,d;f=this.world.entities.store.Spawn[e];if(!f||f.destroy||!f.spawned)return;p=t.in_collision_with;for(u in p)l=p[u],delete t.in_collision_with[u];s=this.world.entities.groupForEntity(e),a=this.world.entities.quadtrees[s];if(!a)return;n=this.world.entities.store.Position[e],r=this.world.entities.store.Sprite[e],o=a.retrieve({x:n.x,y:n.y,width:r.width,height:r.height}),d=[];for(c=0,h=o.length;c<h;c++){i=o[c];if(i.eid===e)continue;d.push(this.checkCollision(i.eid,i.collidable,i.pos,i.sprite,e,t,n,r))}return d},i.prototype.checkCollision=function(e,t,n,r,i,s,o,u){var a,f,l,c,h,p,d;if(!s||!t)return;a=(p=this.world.entities.store.CollisionCircle)!=null?p[i]:void 0,f=(d=this.world.entities.store.CollisionCircle)!=null?d[e]:void 0;if(a&&f){l=n.x-o.x,c=n.y-o.y,h=a.radius+f.radius;if(l*l+c*c<h*h)return s.in_collision_with[e]=1,t.in_collision_with[i]=1}else if(Math.abs(o.x-n.x)*2<u.width+r.width&&Math.abs(o.y-n.y)*2<u.height+r.height)return s.in_collision_with[e]=1,t.in_collision_with[i]=1},i}(L),b=function(n){function r(){return D=r.__super__.constructor.apply(this,arguments),D}return t(r,n),r.prototype.match_component=e.Motion,r.prototype.updateMatch=function(t,n,r){var i;i=this.world.entities.get(n,e.Position),i.x+=r.dx*t,i.y+=r.dy*t,i.rotation=(i.rotation+r.drotation*t)%(Math.PI*2);if(i.rotation<0)return i.rotation+=2*Math.PI},r}(L),h=function(r){function i(e){this.debug_mass=e!=null?e:!1}return t(i,r),i.DAMAGE_TYPE="Bounce",i.prototype.match_component=e.Bouncer,i.prototype.setWorld=function(e){var t=this;return i.__super__.setWorld.call(this,e),this.world.subscribe(M.MSG_DRAW_SCENE_POST_TRANSLATE,function(){var e,r;return r=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],t.drawDebugMass.apply(t,e)})},i.prototype.drawDebugMass=function(t,n,r,i,s,o){var u,a;if(!this.debug_mass)return;u=this.world.entities.get(r,e.Bouncer);if(u)return n.fillStyle="#fff",n.strokeStyle="#fff",a=14*this.viewport_ratio,n.font="normal normal "+a+"px monospace",n.textAlign="center",n.textBaseline="middle",n.fillText(u.mass,0,0)},i.prototype.update=function(t){var n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T;b=this.world.width/2,w=this.world.height/2,m={},E=this.getMatches();for(i in E){n=E[i],r=this.world.entities.get(i,e.Collidable),S=r.in_collision_with;for(f in S)y=S[f],v=[i,f],v.sort(),m[v.join(":")]=v;g=this.world.entities.get(i,e.Position),d=this.world.entities.get(i,e.Motion);if(g&&d){if(g.x>b||g.x<-b)d.dx=0-d.dx;if(g.y>w||g.y<-w)d.dy=0-d.dy}}T=[];for(p in m){x=m[p],i=x[0],f=x[1],n=this.world.entities.get(i,e.Bouncer);if(!n)continue;a=this.world.entities.get(f,e.Bouncer);if(!a)continue;o=this.world.entities.get(i,e.Position),u=this.world.entities.get(i,e.Sprite),s=this.world.entities.get(i,e.Motion),c=this.world.entities.get(f,e.Position),h=this.world.entities.get(f,e.Sprite),l=this.world.entities.get(f,e.Motion),T.push(this.resolve_elastic_collision(t,i,o,u,s,n,f,c,h,l,a))}return T},i.prototype.resolve_elastic_collision=function(e,t,n,r,i,s,o,a,f,l,c){var h,p,d,v,m,g,y,b,w,E,S,x,T,N;d=new u(n.x-a.x,n.y-a.y),p=d.magnitude(),d.normalize(),e=new u(d.y,-d.x),p===0&&(a.x+=.01),v=s.mass,m=c.mass,h=v+m,g={x:d.x*(r.width+f.width-p),y:d.y*(r.width+f.width-p)},y=i?new u(i.dx,i.dy):new u(0,0),E=l?new u(l.dx,l.dy):new u(0,0),b=new u(d.x*y.dot(d),d.y*y.dot(d)),w=new u(e.x*y.dot(e),e.y*y.dot(e)),S=new u(d.x*E.dot(d),d.y*E.dot(d)),x=new u(e.x*E.dot(e),e.y*E.dot(e)),i&&(N=new u(w.x+d.x*((v-m)/h*b.magnitude()+2*m/h*S.magnitude()),w.y+d.y*((v-m)/h*b.magnitude()+2*m/h*S.magnitude())),this.process_damage(t,o,N,s,v),i.dx=N.x,i.dy=N.y);if(l)return T=new u(x.x-d.x*((m-v)/h*S.magnitude()+2*v/h*b.magnitude()),x.y-d.y*((m-v)/h*S.magnitude()+2*v/h*b.magnitude())),this.process_damage(t,o,T,c,m),l.dx=T.x,l.dy=T.y},i.prototype.process_damage=function(t,n,r,i,s){var o,u;if(!i.damage)return;if(i.target_team){o=this.world.entities.get(o,e.WeaponsTarget);if(!o)return;if(o.team!==i.target_team)return}return r.multiplyScalar(1-i.damage),u=r.magnitude()*i.damage*s,this.world.publish(m.MSG_DAMAGE,{to:t,from:n,kind:this.constructor.DAMAGE_TYPE,amount:u/2}),this.world.publish(m.MSG_DAMAGE,{to:n,from:t,kind:this.constructor.DAMAGE_TYPE,amount:u/2})},i}(L),C=function(n){function r(){return P=r.__super__.constructor.apply(this,arguments),P}return t(r,n),r.prototype.match_component=e.Spin,r.prototype.updateMatch=function(t,n,r){var i;return i=this.world.entities.get(n,e.Motion),i.drotation=r.rad_per_sec},r}(L),w=function(n){function r(){this.v_orbited=new u,this.v_orbiter=new u,this.v_old=new u}return t(r,n),r.prototype.match_component=e.Orbit,r.prototype.updateMatch=function(t,n,r){var i,s,o;o=this.world.entities.get(n,e.Position),s=this.world.entities.get(r.orbited_id,e.Position),this.v_orbited.setValues(s.x,s.y),this.v_orbiter.setValues(o.x,o.y),i=t*r.rad_per_sec,this.v_orbiter.rotateAround(this.v_orbited,i),this.v_old.setValues(o.x,o.y),o.x=this.v_orbiter.x,o.y=this.v_orbiter.y;if(r.rotate)return o.rotation=this.v_old.angleTo(this.v_orbiter)},r}(L),S=function(r){function i(e){this.debug_potential_steering=e!=null?e:!1,this.v_self=new u,this.v_target=new u,this.v_accum=new u}return t(i,r),i.prototype.match_component=e.PotentialSteering,i.prototype.setWorld=function(e){var t=this;return i.__super__.setWorld.call(this,e),this.world.subscribe(M.MSG_DRAW_SCENE_PRE_TRANSLATE,function(){var e,r;return r=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],t.drawDebugPre.apply(t,e)}),this.world.subscribe(M.MSG_DRAW_SCENE_POST_TRANSLATE,function(){var e,r;return r=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],t.drawDebugPost.apply(t,e)})},i.prototype.drawDebugPre=function(e,t,n,r,i,s){var o,u,a,f,l,c;if(!this.debug_potential_steering)return;o=(l=this.world.entities.store.PotentialSteering)!=null?l[n]:void 0;if(!o||!o.vects)return;t.save(),t.strokeStyle="rgba(128, 128, 0, 0.5)",c=o.vects;for(a=0,f=c.length;a<f;a++)u=c[a],t.beginPath(),t.arc(u[2].x,u[2].y,5,0,Math.PI*2,!1),t.moveTo(r.x,r.y),t.lineTo(u[2].x,u[2].y),t.stroke();return t.restore()},i.prototype.drawDebugPost=function(e,t,n,r,i,s){var o,u,a,f,l,c;if(!this.debug_potential_steering)return;o=(l=this.world.entities.store.PotentialSteering)!=null?l[n]:void 0;if(!o)return;t.strokeStyle="rgba(128, 128, 0, 0.25)",t.strokeRect(0-o.sensor_range,0-o.sensor_range,o.sensor_range*2,o.sensor_range*2)},i.prototype.calcLennardJones=function(e,t,n,r,i,s,o,u,a,f){var l,c;o==null&&(o=2e3),u==null&&(u=4e3),a==null&&(a=2),f==null&&(f=3),this.v_target.setValues(this.v_self.x-i.x,this.v_self.y-i.y),c=this.v_target.magnitude()-r.width/2-s.width/2;if(c===0||c<0)c=.01;if(!e&&c>t.sensor_range)return;return this.v_target.normalise(),l=-o/Math.pow(c,a)+u/Math.pow(c,f),this.v_target.multiplyScalar(l),t.vects.push([this.v_target.x,this.v_target.y,i]),this.v_accum.add(this.v_target)},i.prototype.updateMatch=function(t,n,r){var i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b;c=this.world.entities.get(n,e.Position);if(!c)return;a=this.world.entities.get(n,e.Motion);if(!a)return;p=this.world.entities.get(n,e.Sprite);if(!p)return;this.v_self.setValues(c.x,c.y),this.v_accum.setValues(0,0),r.vects=[],d=this.world.entities.get(r.target,e.Position),v=this.world.entities.get(r.target,e.Sprite),this.calcLennardJones(!0,r,c,p,d,v,r.attract_magnitude,0,r.attract_attenuation,0),s=this.world.entities.groupForEntity(n),h=this.world.entities.quadtrees[s],f=h.retrieve({x:c.x-r.sensor_range,y:c.y-r.sensor_range,width:r.sensor_range*2,height:r.sensor_range*2});for(y=0,b=f.length;y<b;y++){u=f[y];if(u.eid===r.target)continue;if(u.eid===n)continue;this.calcLennardJones(!1,r,c,p,u.pos,u.sprite,0,r.repel_magnitude,0,r.repel_attenuation)}return m=this.v_accum.angle(),m<0&&(m+=2*Math.PI),r.target_angle=m,i=m<c.rotation?-1:1,l=Math.abs(m-c.rotation),l>Math.PI&&(i=0-i),g=i*Math.min(r.rad_per_sec,l/t),o=g-a.drotation,Math.abs(o)>r.rad_per_sec&&(o=o>0?r.rad_per_sec:o<0?0-r.rad_per_sec:void 0),a.drotation+=o},i}(L),k=function(r){function i(e){this.debug_steering=e!=null?e:!1,this.v_steering=new u,this.v_ray=new u,this.v_ray_unit=new u,this.v_target=new u,this.v_dodge=new u,this.v_dodge_unit=new u}return t(i,r),i.prototype.match_component=e.Steering,i.prototype.setWorld=function(e){var t=this;return i.__super__.setWorld.call(this,e),this.world.subscribe(M.MSG_DRAW_SCENE_PRE_TRANSLATE,function(){var e,r;return r=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],t.drawDebug.apply(t,e)})},i.prototype.drawDebug=function(e,t,n,r,i,s){var o,u,a,f,l,c,h,p,d;if(!this.debug_steering)return;u=(h=this.world.entities.store.Steering)!=null?h[n]:void 0;if(!u)return;t.save();if(u.hit_circles){t.strokeStyle="rgba(128, 0, 0, 0.5)",p=u.hit_circles;for(l=0,c=p.length;l<c;l++)d=p[l],a=d[0],f=d[1],o=d[2],t.beginPath(),t.arc(a,f,o,0,Math.PI*2,!1),t.stroke()}return t.restore()},i.prototype.castRay=function(e,t,n,r,i){var s,o,u,a,f,l,c,h,p,d;a=n.width*.5,c=i*a*1,p=r.los_range/(a*2),this.v_ray_unit.setValues(a*2,0),this.v_ray_unit.rotate(t.rotation),this.v_ray.setValues(t.x,t.y+c),this.v_ray.rotateAround(t,t.rotation),o=.1,s=1-o,h=o/p;for(f=d=0;0<=p?d<=p:d>=p;f=0<=p?++d:--d){u=a*(s+h*(p-f)),l=this.findHits(e,r,this.v_ray.x,this.v_ray.y,u,u);if(l.length>0)return l;this.v_ray.add(this.v_ray_unit)}return[]},i.prototype.findHits=function(e,t,n,r,i,o){var u,a,f,l,c,h,p,d,v,m,g;t.hit_circles.push([n,r,i]),l=this.world.entities.groupForEntity(e),d=this.world.entities.quadtrees[l];if(!d)return[];p=d.retrieve({x:n-i/2,y:r-o/2,width:i,height:o}),c=[];for(m=0,g=p.length;m<g;m++){h=p[m];if(h.eid===e)continue;v=h.width/2+i/2,a=h.x-n,f=h.y-r,u=a*a+f*f,u<=v*v&&c.push([u,h])}return s.sortBy(c,0)},i.prototype.calculateDodgeTarget=function(e,t,n,r,i,s,o,u){var a,f,l,c;return l=Math.atan2(o-r,s-n),t.angle_a2b=l,f=i*1.85+u*.85,a=Math.sqrt((s-n)*(s-n)+(o-r)*(s-r)),c=e*(a>f?Math.asin(f/a):Math.PI*.66),l+c},i.prototype.updateMatch=function(t,n,r){var i,o,u,a,f,l,c,h,p,d,v;c=this.world.entities.get(n,e.Position);if(!c)return;f=this.world.entities.get(n,e.Motion);if(!f)return;h=this.world.entities.get(n,e.Sprite);if(!h)return;return r.hit_circles=[],r.ray_left=this.castRay(n,c,h,r,-1),r.ray_right=this.castRay(n,c,h,r,1),r.ray_right.length?(o=r.ray_right[0][1],u=-1):r.ray_left.length?(o=r.ray_left[0][1],u=1):(o=null,u=!1),o?(r.dodging=!0,r.target_angle=p=this.calculateDodgeTarget(u,r,c.x,c.y,h.width,o.x,o.y,o.width)):(v=r.target,s.isObject(v)||(v=this.world.entities.get(r.target,e.Position)),r.dodging=!1,this.v_steering.setValues(c.x,c.y),this.v_target.setValues(v.x,v.y),p=this.v_steering.angleTo(this.v_target)),p<0&&(p+=2*Math.PI),r.target_angle=p,i=p<c.rotation?-1:1,l=Math.abs(p-c.rotation),l>Math.PI&&(i=0-i),d=i*Math.min(r.rad_per_sec,l/t),a=d-f.drotation,Math.abs(a)>r.rad_per_sec&&(a=a>0?r.rad_per_sec:a<0?0-r.rad_per_sec:void 0),f.drotation+=a},i}(L),T=function(n){function r(){this.v_seeker=new u,this.v_target=new u}return t(r,n),r.prototype.match_component=e.Seeker,r.prototype.updateMatch=function(t,n,r){var i,o,u,a,f,l,c,h;if(r.acquisition_delay>0){r.acquisition_delay-=t;return}f=this.world.entities.get(n,e.Position);if(!f)return;u=this.world.entities.get(n,e.Motion);if(!u)return;h=r.target,s.isObject(h)||(h=this.world.entities.get(r.target,e.Position));if(!h||!h.x&&h.y)return;return this.v_seeker.setValues(f.x,f.y),this.v_target.setValues(h.x,h.y),l=this.v_seeker.angleTo(this.v_target),l<0&&(l+=2*Math.PI),i=l<f.rotation?-1:1,a=Math.abs(l-f.rotation),a>Math.PI&&(i=0-i),c=i*Math.min(r.rad_per_sec,a/t),o=c-u.drotation,Math.abs(o)>r.rad_per_sec&&(o=o>0?r.rad_per_sec:o<0?0-r.rad_per_sec:void 0),u.drotation+=o},r}(L),A=function(n){function r(){this.v_inertia=new u,this.v_thrust=new u,this.v_brakes=new u}return t(r,n),r.prototype.match_component=e.Thruster,r.prototype.updateMatch=function(t,n,r){var i,s,o,u,a,f,l;if(!r.active)return;f=this.world.entities.get(n,e.Position),u=this.world.entities.get(n,e.Motion);if(!f||!u)return;return this.v_inertia.setValues(u.dx,u.dy),l=t*r.dv,r.stop||(this.v_thrust.setValues(l,0),this.v_thrust.rotate(f.rotation),this.v_inertia.add(this.v_thrust)),r.use_brakes&&(o=r.stop?0:r.max_v,s=this.v_inertia.magnitude(),a=s-o,a>0&&(i=Math.min(l,a),this.v_brakes.setValues(this.v_inertia.x,this.v_inertia.y),this.v_brakes.normalize(),this.v_brakes.multiplyScalar(0-i),this.v_inertia.add(this.v_brakes)),r.stop&&s===0&&(r.active=!1)),u.dx=this.v_inertia.x,u.dy=this.v_inertia.y},r}(L),p=function(n){function r(){return H=r.__super__.constructor.apply(this,arguments),H}return t(r,n),r.prototype.match_component=e.ClickCourse,r.prototype.updateMatch=function(t,n,r){var i,s,o,u,a,f;i=this.world.entities.get(n,e.Position),o=this.world.entities.get(n,e.Sprite),s=this.world.entities.get(n,e.Seeker),u=this.world.entities.get(n,e.Thruster),r.active&&this.world.inputs.pointer_button_left&&(r.x=this.world.inputs.pointer_world_x,r.y=this.world.inputs.pointer_world_y,u!=null&&(u.active=!0),u!=null&&(u.stop=!1),s!=null&&(s.target={x:r.x,y:r.y})),a=Math.abs(i.x-r.x),f=Math.abs(i.y-r.y);if(a<o.width/2&&f<o.height/2&&r.stop_on_arrival)return u!=null?u.stop=!0:void 0},r}(L),y=function(n){function r(){this.v_center=new u(0,0),this.v_pos=new u(0,0),this.v_unit=new u(0,0)}return t(r,n),r.DAMAGE_TYPE="Missile",r.prototype.match_component=e.MissileWeapon,r.prototype.updateMatch=function(t,n,r){var i,s;return i=this.world.entities.get(n,e.Position),s=this.world.entities.get(n,e.Sprite),r.x=i.x,r.y=i.y,r.rotation=i.rotation,r.length=50,this.loadTurrets(t,r,n),this.targetTurrets(t,r,n),this.fireTurrets(t,r,n,i)},r.prototype.loadTurrets=function(e,t,n){var r,i,s,o,u;u=[];for(r=s=0,o=t.active_turrets-1;0<=o?s<=o:s>=o;r=0<=o?++s:--s)i=t.turrets[r],i.loading>0&&(i.loading-=e),i.loading<=0?(i.loading=0,u.push(i.target=null)):u.push(void 0);return u},r.prototype.targetTurrets=function(t,n,r){var i,s,o,u,a,f,l,c,h,p,d,v,m;h=[];for(s=d=0,v=n.active_turrets-1;0<=v?d<=v:d>=v;s=0<=v?++d:--d)p=n.turrets[s],p.loading===0&&p.target===null&&h.push(p);if(h.length===0)return;o=Math.pow(n.target_range,2),c=this.world.entities.getComponents(e.WeaponsTarget),i=[];for(u in c){l=c[u];if(u===r)continue;if(l.team!==n.target_team)continue;a=this.world.entities.get(u,e.Position),f=(a.x-n.x)*(a.x-n.x)+(a.y-n.y)*(a.y-n.y),f<=o&&i.push([f,u])}if(i.length){i.sort(function(e,t){return e[0]-t[0]}),m=[];while(h.length)m.push(function(){var e,t,n,r;r=[];for(e=0,t=i.length;e<t;e++){n=i[e],f=n[0],u=n[1],p=h.pop();if(!p)break;r.push(p.target=u)}return r}());return m}},r.prototype.fireTurrets=function(e,t,n,r){var i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E;p=4,this.v_unit.setValues(0,0-t.length/t.active_turrets),this.v_unit.rotateAround({x:0,y:0},r.rotation),this.v_pos.setValues(t.x,t.y+t.length/2),this.v_pos.rotateAround({x:t.x,y:t.y},r.rotation),E=[];for(a=m=0,b=t.active_turrets-1;0<=b?m<=b:m>=b;a=0<=b?++m:--m){this.v_pos.add(this.v_unit),d=t.turrets[a];if(d.target===null||d.loading>0)continue;l=t.missile,i=l.color,h=r.rotation+(a%2===0?Math.PI/2:0-Math.PI/2),c={Sprite:{shape:"enemyscout",width:p,height:p,stroke_style:i},Spawn:{x:this.v_pos.x,y:this.v_pos.y,rotation:h,ttl:l.ttl},Position:{},Motion:{},Collidable:{},Bouncer:{mass:100,damage:.007,target_team:t.target_team},Thruster:{dv:l.speed,max_v:l.speed,active:!0},Seeker:{rad_per_sec:l.rad_per_sec,acquisition_delay:l.acquisition_delay*Math.random(),target:d.target},Health:{max:l.health,show_bar:!1},RadarPing:{color:i,size:3},VaporTrail:{color:"#aaa",history:15,skip:3,width:1},WeaponsTarget:{team:"invaders"},Tombstone:{load:{Position:{},Explosion:{ttl:.5,radius:p*4,max_particles:15,max_particle_size:1,max_velocity:100,color:i}}}},c.Missile={};for(v=g=0,y=l.length;g<y;v=++g)f=l[v],c.Missile[f]=v;s=this.world.entities.loadComponents(c),o=(w=this.world.entities).create.apply(w,s),u=this.world.entities.groupForEntity(n),this.world.entities.addToGroup(u,o),d.loading=t.loading_time,E.push(d.target=null)}return E},r}(L),c=function(r){function i(){this.stats={}}return t(i,r),i.DAMAGE_TYPE="Beam",i.prototype.match_component=e.BeamWeapon,i.prototype.setWorld=function(e){var t=this;return i.__super__.setWorld.call(this,e),this.world.subscribe(M.MSG_DRAW_SCENE_PRE_TRANSLATE,function(){var e,r;return r=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],t.drawBeams.apply(t,e)})},i.prototype.drawBeams=function(t,n,r,i,s,o){var a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x;f=this.world.entities.get(r,e.BeamWeapon);if(!f)return;p=f.x,d=f.y,b=new u(p,d),w=new u(p,f.y-6),w.rotateAround(b,i.rotation),y=Math.PI*2/f.active_beams,v=f.active_beams/f.max_beams,x=[];for(c=E=0,S=f.active_beams-1;0<=S?E<=S:E>=S;c=0<=S?++E:--E){a=f.beams[c];if(!a)continue;n.save(),w.rotateAround(b,y),(a!=null?a.target:void 0)&&(a!=null?!a.charging:!void 0)&&(l=1.25,m=a.x+Math.random()*l-l/2,g=a.y+Math.random()*l-l/2,h=2,n.lineWidth=h-h*.75*v,n.strokeStyle=f.color,this.glow&&(n.shadowBlur=4,n.shadowColor=f.color),n.beginPath(),n.moveTo(w.x,w.y),n.lineTo(m,g),n.stroke()),x.push(n.restore())}return x},i.prototype.updateMatch=function(t,n,r){var i,s,o,u,a;s=this.world.entities.get(n,e.Position),r.x=s.x,r.y=s.y,r.active_beams=Math.min(r.active_beams,r.max_beams);if(r.active_beams===0)return;o=this.calcStats(r);for(i in o)a=o[i],r.current_stats[i]=a;return u=this.chargeBeams(t,o,r),u.length>0&&this.target_beams(t,o,r,n,u),this.dischargeBeams(t,o,r,n)},i.prototype.calcStats=function(e){var t,n,r,i;return r=""+e.active_beams+":"+e.max_power,r in this.stats||(t=e.active_beams,i=e.active_beams/e.max_beams,n=e.max_range/e.active_beams,this.stats[r]={max_charge:e.max_power/(t*t),charge_rate:e.charge_rate/t,discharge_rate:e.discharge_rate/t,beam_range:n,beam_range_sq:Math.pow(n,2),dmg_penalty:1-i*e.dmg_penalty}),this.stats[r]},i.prototype.chargeBeams=function(e,t,n){var r,i,s,o,u;s=[];for(i=o=0,u=n.active_beams-1;0<=u?o<=u:o>=u;i=0<=u?++o:--o)r=n.beams[i],r.charging&&(r.charge+=t.charge_rate*e,r.charge>=t.max_charge&&(r.charge=t.max_charge,r.charging=!1,r.target=null)),r.target===null&&s.push(r);return s},i.prototype.target_beams=function(t,n,r,i,s){var o,u,a,f,l,c,h,p;h=this.world.entities.getComponents(e.WeaponsTarget),u=[];for(a in h){c=h[a];if(a===i)continue;if(c.team!==r.target_team)continue;f=this.world.entities.get(a,e.Position),l=(f.x-r.x)*(f.x-r.x)+(f.y-r.y)*(f.y-r.y),l<=n.beam_range_sq&&u.push([l,a])}if(u.length){u.sort(function(e,t){return e[0]-t[0]}),p=[];while(s.length)p.push(function(){var e,t,n,r;r=[];for(e=0,t=u.length;e<t;e++){n=u[e],l=n[0],a=n[1],o=s.pop();if(!o)break;r.push(o.target=a)}return r}());return p}},i.prototype.dischargeBeams=function(t,n,r,i){var s,o,u,a,f,l,c,h;h=[];for(a=l=0,c=r.active_beams-1;0<=c?l<=c:l>=c;a=0<=c?++l:--l){s=r.beams[a];if(s.charging||s.target===null)continue;o=n.discharge_rate*t,s.charge<o&&(o=s.charge),s.charge-=o,s.charge<=0&&(s.charge=0,s.charging=!0),u=o*n.dmg_penalty,f=this.world.entities.get(s.target,e.Position),f?(s.x=f.x,s.y=f.y,h.push(this.world.publish(m.MSG_DAMAGE,{to:s.target,from:i,kind:this.constructor.DAMAGE_TYPE,amount:u}))):h.push(void 0)}return h},i}(L),m=function(r){function i(){return B=i.__super__.constructor.apply(this,arguments),B}return t(i,r),i.MSG_DAMAGE="health.damage",i.MSG_HEAL="health.heal",i.prototype.match_component=e.Health,i.prototype.updateMatch=function(e,t,n){if(n.current<0)return this.world.publish(N.MSG_DESPAWN,{entity_id:t})},i.prototype.setWorld=function(t){var r=this;return i.__super__.setWorld.call(this,t),this.world.subscribe(this.constructor.MSG_DAMAGE,function(t,n){var i;i=r.world.entities.get(n.to,e.Health);if(!i)return;return i.current-=n.amount}),this.world.subscribe(this.constructor.MSG_HEAL,function(t,n){var i;i=r.world.entities.get(n.to,e.Health);if(!i)return;return i.health+=n.amount}),this.world.subscribe(M.MSG_DRAW_SCENE_POST_TRANSLATE,function(){var e,t;return t=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],r.drawHealthBar.apply(r,e)})},i.prototype.drawHealthBar=function(t,n,r,i,s,o){var u,a,f,l,c,h;if(!o)return;h=o.width,u=o.height,a=this.world.entities.get(r,e.Health);if(!a||!a.show_bar)return;return l=a.current/a.max,c=0-u/2-5,f=0-h/2,n.save(),n.lineWidth=2,n.strokeStyle="#333",n.beginPath(),n.moveTo(f,c),n.lineTo(f+h,c),n.stroke(),l>0&&(n.strokeStyle="#3e3",n.beginPath(),n.moveTo(f,c),n.lineTo(f+h*l,c),n.stroke()),n.restore()},i}(L),O=function(r){function i(){return j=i.__super__.constructor.apply(this,arguments),j}return t(i,r),i.prototype.match_component=e.VaporTrail,i.prototype.updateMatch=function(t,n,r){var i,s;return s=this.world.entities.get(n,e.Position),i=r.particles.pop(),i.x=s.x,i.y=s.y,r.particles.unshift(i)},i.prototype.setWorld=function(e){var t=this;return i.__super__.setWorld.call(this,e),this.world.subscribe(M.MSG_DRAW_SCENE_PRE_TRANSLATE,function(){var e,r;return r=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],t.drawViewport.apply(t,e)})},i.prototype.drawViewport=function(t,n,r,i,s,o){var u,a,f,l,c,h,p;l=this.world.entities.get(r,e.VaporTrail);if(!l)return;n.save(),u=1/l.particles.length,n.globalAlpha=1,f=l.skip,p=l.particles;for(c=0,h=p.length;c<h;c++){a=p[c];if(f-->0)continue;n.globalAlpha-=u,n.fillStyle=l.color,n.fillRect(a.x,a.y,l.width,l.width)}return n.restore()},i}(L),v=function(r){function i(){this.v_center=new u(0,0),this.v_scratch=new u(0,0)}return t(i,r),i.prototype.match_component=e.Explosion,i.prototype.setWorld=function(e){var t=this;return i.__super__.setWorld.call(this,e),this.world.subscribe(M.MSG_DRAW_SCENE_POST_TRANSLATE,function(){var e,r;return r=arguments[0],e=2<=arguments.length?n.call(arguments,1):[],t.drawExplosion.apply(t,e)})},i.prototype.updateMatch=function(e,t,n){var r,i,s,o,u,a,f,l;f=n.particles;for(s=0,u=f.length;s<u;s++)i=f[s],!n.stop&&i.free&&(i.x=i.y=0,this.v_scratch.setValues(0,n.max_velocity*Math.random()),this.v_scratch.rotateAround(this.v_center,Math.PI*2*Math.random()),i.dx=this.v_scratch.x,i.dy=this.v_scratch.y,i.mr=n.radius*Math.random(),i.s=n.max_particle_size,i.free=!1),i.free||(i.x+=i.dx*e,i.y+=i.dy*e,this.v_scratch.setValues(i.x,i.y),i.r=this.v_scratch.dist(this.v_center),i.r>=i.mr&&(i.r=i.mr,i.free=!0));n.age+=e,!n.stop&&n.age>=n.ttl*.75&&(n.stop=!0);if(n.stop){r=!0,l=n.particles;for(o=0,a=l.length;o<a;o++){i=l[o];if(!i.free){r=!1;break}}if(r||n.age>=n.ttl)return n.age=n.ttl,this.world.publish(N.MSG_DESPAWN,{entity_id:t})}},i.prototype.drawExplosion=function(t,n,r,i,s,o){var u,a,f,l,c,h,p;a=this.world.entities.get(r,e.Explosion);if(!a)return;u=1-a.age/a.ttl,n.save(),n.strokeStyle=a.color,n.fillStyle=a.color,p=a.particles;for(c=0,h=p.length;c<h;c++){f=p[c];if(f.free)continue;n.globalAlpha=(1-f.r/f.mr)*u,l=f.s,n.beginPath(),n.moveTo(0,0),n.lineWidth=l,n.lineTo(f.x,f.y),n.stroke()}return n.restore()},i}(L),{System:L,SpawnSystem:N,MotionSystem:b,BouncerSystem:h,SpinSystem:C,OrbiterSystem:w,ViewportSystem:M,PointerInputSystem:E,CollisionSystem:d,SeekerSystem:T,SteeringSystem:k,ThrusterSystem:A,ClickCourseSystem:p,KeyboardInputSystem:g,BeamWeaponSystem:c,HealthSystem:m,ExplosionSystem:v,RadarSystem:x,MissileWeaponSystem:y,VaporTrailSystem:O,PotentialSteeringSystem:S}})}).call(this);