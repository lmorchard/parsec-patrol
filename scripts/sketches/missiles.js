(function(){define(["worlds","entities","components","systems","pubsub","jquery","underscore","Vector2D","utils","dat"],function(e,t,n,r,i,s,o,u,a,f){return function(i,s,o){var u,a,l,c,h,p,d,v,m,g,y=this;return s==null&&(s=!0),o==null&&(o=!0),d={max_enemies:100,respawn_enemies:!0},g=new e.World(1e3,1e3,m=new r.ViewportSystem(i),new r.RadarSystem(i,.28),new r.PointerInputSystem(i),new r.ClickCourseSystem,new r.SpawnSystem,new r.SpinSystem,new r.SeekerSystem,new r.ThrusterSystem,new r.MotionSystem,new r.CollisionSystem,new r.BouncerSystem,new r.HealthSystem,new r.BeamWeaponSystem,new r.MissileWeaponSystem,new r.VaporTrailSystem,new r.ExplosionSystem),m.zoom=2,h=g.entities,g.load(c={entities:{sun:{Sprite:{shape:"star"},Spawn:{position_logic:"center"},RadarPing:{color:"#ff0"},Position:{}},hero:{TypeName:{name:"HeroShip"},Sprite:{shape:"hero"},Position:{},Motion:{},Collidable:{},Bouncer:{mass:1e3,damage:.007},Spawn:{x:200,y:0},Thruster:{dv:250,max_v:100,stop:!0},Seeker:{rad_per_sec:Math.PI},ClickCourse:{stop_on_arrival:!0},Health:{max:"20000"},RadarPing:{color:"#0f0"},WeaponsTarget:{team:"commonwealth"},BeamWeapon:{max_beams:15,active_beams:10,max_range:1250,max_power:4500,charge_rate:4500,discharge_rate:4500,color:"#33f",target_team:"invaders"},Tombstone:{load:{Position:{},Explosion:{ttl:5,radius:70,max_particles:50,max_particle_size:1.5,max_velocity:300,color:"#fff"},Spawn:{}}}},cruiser:{TypeName:{name:"EnemyCruiser"},Sprite:{shape:"enemycruiser",width:50,height:50,stroke_style:"#f33"},Position:{},Motion:{},Collidable:{},Spin:{rad_per_sec:Math.PI/16},Spawn:{x:-200,y:0,rotation:Math.PI/2},Thruster:{dv:50,max_v:100,active:!1},Seeker:{rad_per_sec:Math.PI},Health:{max:"20000"},RadarPing:{color:"#f33",size:8},WeaponsTarget:{team:"invaders"},MissileWeapon:{target_team:"commonwealth",max_turrets:100,active_turrets:15,loading_time:3,target_range:1e3,missile:{health:20,damage:1e3,speed:125,ttl:6,color:"#f00",rad_per_sec:Math.PI*1.75,acquisition_delay:.75}},Tombstone:{load:{Position:{},Explosion:{ttl:5,radius:70,max_particles:50,max_particle_size:1.5,max_velocity:300,color:"#33f"}}}}},groups:{main:["sun","hero","cruiser"]},current_scene:"main"}),a=g.entities.get("hero",n.BeamWeapon),l=g.entities.get("hero",n.Health),u=g.entities.get("cruiser",n.MissileWeapon),v={enemy_ct:0},g.subscribe(r.SpawnSystem.MSG_DESPAWN,function(e,t){var r,i;i=h.get(t.entity_id,n.TypeName);if((i!=null?i.name:void 0)==="HeroShip")return r=function(){return location.reload()},setTimeout(r,5e3)}),window.C=n,window.E=t,window.W=e,window.world=g,window.vp=m,g.measure_fps=o,s&&(p=new f.GUI,p.add(g,"is_paused"),p.add(m,"glow"),p.add(m,"use_sprite_cache"),p.add(m,"zoom",.125,15).step(.125),p.add(m,"use_grid"),p.add(a,"active_beams",1,15).step(1),p.add(u,"active_turrets",1,100).step(1)),g}})}).call(this);