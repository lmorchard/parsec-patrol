(function(){define(["worlds","entities","components","systems","utils","pubsub","jquery","underscore","dat","Vector2D"],function(e,t,n,r,i,s,o,u,a,f){return function(t,s,o){var l,c,h,p,d,v,m,g,y=this;return s==null&&(s=!0),o==null&&(o=!0),h={max_entities:50,max_speed:70},v={entities_ct:0},g=new e.World(1600,1600,m=new r.ViewportSystem(t),new r.RadarSystem(t,.28),new r.PointerInputSystem(t),new r.ClickCourseSystem,new r.SpawnSystem,new r.HealthSystem,new r.CollisionSystem,new r.BouncerSystem,new r.SeekerSystem,new r.ThrusterSystem,new r.MotionSystem,new r.SpinSystem,new r.BeamWeaponSystem,new r.ExplosionSystem),m.zoom=1.5,l=g.entities,g.load({entities:{hero:{TypeName:{name:"HeroShip"},Sprite:{shape:"hero"},Position:{},Motion:{},Collidable:{},Bouncer:{mass:5e4,damage:.007},Spawn:{x:0,y:0,capture_camera:!0},Thruster:{dv:250,max_v:100,stop:!0},Seeker:{rad_per_sec:Math.PI},ClickCourse:{stop_on_arrival:!0},Health:{max:2e5},RadarPing:{color:"#0f0"},WeaponsTarget:{team:"commonwealth"},BeamWeapon:{max_beams:15,active_beams:9,max_range:1250,max_power:4500,charge_rate:4500,discharge_rate:4500,color:"#33f",target_team:"invaders"},Tombstone:{load:{Position:{},Explosion:{ttl:5,radius:70,max_particles:50,max_particle_size:1.5,max_velocity:300,color:"#fff"},Spawn:{capture_camera:!0}}}}},groups:{main:["hero"]},current_scene:"main"}),p=function(e,t,n,r,i,s,o,u,a){var f,l,c;return f=g.entities.loadComponents({Sprite:{shape:"asteroid",width:n,height:r},Spawn:{x:e,y:t},Motion:{dx:i,dy:s,drotation:o},Health:{max:a,show_bar:!1},Bouncer:{mass:u,damage:.007},RadarPing:{color:"#333"},Collidable:{},Position:{},Tombstone:{load:{Position:{},Explosion:{ttl:.5,radius:40,max_particles:25,max_particle_size:1.25,max_velocity:250,color:"#fff"}}}}),l=(c=g.entities).create.apply(c,f),g.entities.addToGroup("main",l),l},d=function(e,t,n,r,s,o,a,l){var c,h,d,v,m,g,y,b,w,E,S,x,T,N,C,k;e==null&&(e=0),t==null&&(t=0),n==null&&(n=300),r==null&&(r=50),s==null&&(s=5),o==null&&(o=12),a==null&&(a=120),l==null&&(l=8),w=new f(e,t),S=new f(0,0),E=new f(0,0),m=[],k=[];for(v=C=1;1<=r?C<=r:C>=r;v=1<=r?++C:--C)k.push(function(){var e,t,r,f,v;v=[];for(c=e=1;1<=s?e<=s:e>=s;c=1<=s?++e:--e){b=u.random(o,a),S.setValues(w.x,w.y-u.random(1,n)),y=Math.PI*4*Math.random(),S.rotateAround(w,y),g=!0;for(t=0,r=m.length;t<r;t++){f=m[t],T=f[0],N=f[1],x=f[2],d=f[3];if(i.inCollision(T,N,x,d,S.x,S.y,b*1.0125,b*1.0125)){g=!1;break}}if(!g)continue;m.push([S.x,S.y,b,b]),E.setValues(0,Math.random()*l),E.rotate(y),v.push(h=p(S.x,S.y,b,b,E.x,E.y,Math.PI*.25*Math.random(),4*b,400*b))}return v}());return k},d(-260,-260,250),d(260,260,250),d(260,-260,250),d(-260,260,250),g.subscribe(r.SpawnSystem.MSG_DESPAWN,function(e,t){var r,i;i=l.get(t.entity_id,n.TypeName);if((i!=null?i.name:void 0)==="HeroShip")return r=function(){return location.reload()},setTimeout(r,5e3)}),m.draw_bounding_boxes=!1,g.measure_fps=o,s&&(c=new a.GUI,c.add(g,"is_paused").listen(),c.add(m,"zoom",.125,3).step(.125),c.add(m,"use_grid"),c.add(m,"use_sprite_cache"),c.add(m,"draw_bounding_boxes")),g}})}).call(this);