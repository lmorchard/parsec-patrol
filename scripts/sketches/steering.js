(function(){define(["worlds","entities","components","systems","utils","pubsub","jquery","underscore","dat","Vector2D"],function(e,t,n,r,i,s,o,u,a,f){return function(t,n,i){var s,o,u,f;return n==null&&(n=!0),i==null&&(i=!0),f=new e.World(1e3,1e3,u=new r.ViewportSystem(t),new r.PointerInputSystem(t),new r.ClickCourseSystem,new r.SpawnSystem,new r.HealthSystem,new r.CollisionSystem,new r.BouncerSystem,new r.SeekerSystem,new r.SteeringSystem,new r.ThrusterSystem,new r.MotionSystem,new r.SpinSystem,new r.BeamWeaponSystem,new r.ExplosionSystem),s=f.entities,f.load({entities:{rock:{TypeName:{name:"Rock"},Sprite:{shape:"asteroid",width:400,height:400},Spawn:{x:0,y:0},Position:{},Motion:{drotation:Math.PI/8},Collidable:{},CollisionCircle:{radius:200},Bouncer:{mass:2e3,damage:0}},hero:{TypeName:{name:"HeroShip"},Sprite:{shape:"hero",width:30,height:30},Spawn:{x:450,y:0},Position:{},Motion:{dx:0,dy:0},Collidable:{},CollisionCircle:{radius:15}},enemy1:{Sprite:{shape:"enemyscout",width:30,height:30},Spawn:{x:-450,y:-150,rotation:-Math.PI/2},Position:{},Motion:{},Collidable:{},CollisionCircle:{radius:15},Bouncer:{mass:2e3,damage:0},Thruster:{dv:250,max_v:120},Steering:{target:"hero",los_range:150,rad_per_sec:Math.PI}},enemy2:{Sprite:{shape:"enemyscout",width:30,height:30},Spawn:{x:-450,y:150,rotation:Math.PI/2},Position:{},Motion:{},Collidable:{},CollisionCircle:{radius:15},Bouncer:{mass:2e3,damage:0},Thruster:{dv:250,max_v:120},Steering:{target:"hero",los_range:150,rad_per_sec:Math.PI}},enemy3:{Sprite:{shape:"enemyscout",width:30,height:30},Spawn:{x:-450,y:0,rotation:0},Position:{},Motion:{},Collidable:{},CollisionCircle:{radius:15},Bouncer:{mass:2e3,damage:0},Thruster:{dv:250,max_v:120},Steering:{target:"hero",los_range:150,rad_per_sec:Math.PI}}},groups:{main:["rock","hero","enemy1","enemy2","enemy3"]},current_scene:"main"}),u.zoom=1,u.draw_bounding_boxes=!0,u.draw_steering=!0,f.measure_fps=i,n&&(o=new a.GUI,o.add(f,"is_paused").listen(),o.add(u,"zoom",.125,3).step(.125),o.add(u,"use_grid"),o.add(u,"glow"),o.add(u,"use_sprite_cache"),o.add(u,"draw_bounding_boxes"),o.add(u,"draw_steering")),window.world=f,f}})}).call(this);