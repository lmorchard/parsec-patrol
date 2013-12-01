(function(){define(["worlds","entities","components","systems","pubsub","jquery","underscore","Vector2D","utils","dat"],function(e,t,n,r,i,s,o,u,a,f){return function(i,s,a){var l,c,h,p,d,v,m,g,y,b,w,x,T,N,k,L=this;s==null&&(s=!0),a==null&&(a=!0),m={max_enemies:100,respawn_enemies:!0},T=new e.World(3e3,3e3,x=new r.ViewportSystem(i),new r.RadarSystem(i,.28),new r.PointerInputSystem(i),new r.ClickCourseSystem,new r.SpawnSystem,new r.SpinSystem,new r.OrbiterSystem,new r.SeekerSystem,new r.ThrusterSystem,new r.MotionSystem,new r.HealthSystem,new r.BeamWeaponSystem,new r.ExplosionSystem),window.C=n,window.E=t,window.W=e,window.world=T,window.vp=x,x.zoom=4,p=T.entities,T.load(h={entities:{sun:{Sprite:{shape:"star"},Spawn:{position_logic:"center"},RadarPing:{color:"#ff0"},Position:{}},hero:{TypeName:{name:"HeroShip"},Sprite:{shape:"hero"},Position:{},Motion:{},Collidable:{},Spawn:{x:-65,y:65,capture_camera:!0},Thruster:{dv:250,max_v:100,stop:!0},Seeker:{rad_per_sec:Math.PI},ClickCourse:{stop_on_arrival:!0},Health:{max:"20000"},RadarPing:{color:"#0f0"},WeaponsTarget:{team:"commonwealth"},BeamWeapon:{max_beams:15,active_beams:9,max_range:1250,max_power:4500,charge_rate:4500,discharge_rate:4500,color:"#33f",target_team:"invaders"},Tombstone:{load:{Position:{},Explosion:{ttl:5,radius:70,max_particles:50,max_particle_size:1.5,max_velocity:300,color:"#fff"},Spawn:{capture_camera:!0}}}}},groups:{main:["sun","hero"]}}),l=T.entities.get("hero",n.BeamWeapon),c=T.entities.get("hero",n.Health),T.current_scene=g=o.keys(h.groups)[0],w=new u(0,0),y=function(){var e,t,n;return n=new u(0,-1500*Math.random()),n.rotateAround(w,Math.PI*2*Math.random()),e=p.loadComponents({TypeName:{name:"EnemyScout"},Sprite:{shape:"enemyscout",stroke_style:"#f33",width:12,height:12},Spawn:{x:n.x,y:n.y},Position:{},Motion:{},Collidable:{},Thruster:{dv:100,max_v:50},Seeker:{target:"hero",rad_per_sec:Math.PI},Health:{max:"300"},WeaponsTarget:{team:"invaders"},RadarPing:{color:"#f00"},BeamWeapon:{max_beams:1,active_beams:1,max_range:75,max_power:250,charge_rate:250,discharge_rate:500,color:"#f44",target_team:"commonwealth"},Tombstone:{load:{Position:{},Explosion:{ttl:.5,radius:40,max_particles:25,max_particle_size:1.25,max_velocity:250,color:"#f33"}}}}),t=p.create.apply(p,e),p.addToGroup(g,t)},b={enemy_ct:0},T.subscribe(r.SpawnSystem.MSG_DESPAWN,function(e,t){var r,i,s,o,u;u=p.get(t.entity_id,n.TypeName),s=function(){var e,t;e=p.getComponents(n.TypeName),t=[];for(r in e)o=e[r],o.name==="EnemyScout"&&t.push(r);return t}(),b.enemy_ct=s.length,(u!=null?u.name:void 0)==="EnemyScout"&&(m.respawn_enemies&&s.length<=m.max_enemies&&y(),s.length===1&&(i=function(){return location.reload()},setTimeout(i,5e3)));if((u!=null?u.name:void 0)==="HeroShip")return i=function(){return location.reload()},setTimeout(i,5e3)});if(m.max_enemies)for(v=N=1,k=m.max_enemies;1<=k?N<=k:N>=k;v=1<=k?++N:--N)y();return T.measure_fps=a,s&&(d=new f.GUI,d.add(T,"is_paused"),d.add(x,"zoom",1,15).step(.25),d.add(l,"active_beams",1,15).step(1),d.add(m,"max_enemies",1,200).step(10),d.add(m,"respawn_enemies"),d.add(b,"enemy_ct").listen()),T}})}).call(this);