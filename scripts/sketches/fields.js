(function(){define(["worlds","entities","components","systems","utils","pubsub","jquery","underscore","dat","Vector2D"],function(e,t,n,r,i,s,o,u,a,f){return function(t,n,s){var o,l,c,h,p,d,v;return n==null&&(n=!0),s==null&&(s=!0),l={max_entities:50,max_speed:70},p={entities_ct:0},v=new e.World(1600,1600,d=new r.ViewportSystem(t),new r.SpawnSystem,new r.HealthSystem,new r.CollisionSystem,new r.BouncerSystem,new r.MotionSystem,new r.SpinSystem,new r.ExplosionSystem),d.zoom=1,v.load({entities:{},groups:{main:[]},current_scene:"main"}),c=function(e,t,n,r,i,s,o,u,a){var f,l,c;return f=v.entities.loadComponents({Sprite:{shape:"asteroid",width:n,height:r},Spawn:{x:e,y:t},Motion:{dx:i,dy:s,drotation:o},Health:{max:a,show_bar:!1},Bouncer:{mass:u,damage:.007},Collidable:{},Position:{},Tombstone:{load:{Position:{},Explosion:{ttl:.5,radius:40,max_particles:25,max_particle_size:1.25,max_velocity:250,color:"#fff"}}}}),l=(c=v.entities).create.apply(c,f),v.entities.addToGroup("main",l),l},h=function(e,t,n,r,s,o,a,l){var h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k;e==null&&(e=0),t==null&&(t=0),n==null&&(n=300),r==null&&(r=30),s==null&&(s=3),o==null&&(o=15),a==null&&(a=100),l==null&&(l=6),w=new f(e,t),S=new f(0,0),E=new f(0,0),m=[],k=[];for(v=C=1;1<=r?C<=r:C>=r;v=1<=r?++C:--C)k.push(function(){var e,t,r,f,v;v=[];for(h=e=1;1<=s?e<=s:e>=s;h=1<=s?++e:--e){b=u.random(o,a),S.setValues(w.x,w.y-u.random(1,n)),y=Math.PI*4*Math.random(),S.rotateAround(w,y),g=!0;for(t=0,r=m.length;t<r;t++){f=m[t],T=f[0],N=f[1],x=f[2],d=f[3];if(i.inCollision(T,N,x,d,S.x,S.y,b*1.0125,b*1.0125)){g=!1;break}}if(!g)continue;m.push([S.x,S.y,b,b]),E.setValues(0,Math.random()*l),E.rotate(y),v.push(p=c(S.x,S.y,b,b,E.x,E.y,Math.PI*.25*Math.random(),4*b,40*b))}return v}());return k},h(-260,-260,250),h(260,260,250),h(260,-260,250),h(-260,260,250),d.draw_bounding_boxes=!1,v.measure_fps=s,n&&(o=new a.GUI,o.add(v,"is_paused").listen(),o.add(d,"zoom",.125,3).step(.125),o.add(d,"use_grid"),o.add(d,"use_sprite_cache"),o.add(d,"draw_bounding_boxes")),v}})}).call(this);