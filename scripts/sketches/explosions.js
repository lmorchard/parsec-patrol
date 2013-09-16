(function(){define("sketches/explosions",["worlds","entities","components","systems","pubsub","jquery","underscore","Vector2D","utils"],function(e,t,n,r,i,s,o,u,a){var f,l,c,h,p,d,v;return l=document.getElementById("gameCanvas"),f=document.getElementById("gameArea"),v=new e.World(640,480,new r.ViewportSystem(window,f,l,1,1),new r.ClickCourseSystem,new r.SpawnSystem,new r.ExplosionSystem),h=v.entities,v.current_scene=p=h.createGroup(c=h.create(new n.Sprite({shape:"star"}),new n.Spawn({position_logic:"center"}),new n.Position)),d=function(){var e,t;return t=new u(0,250-150*Math.random()),e=new u(0,0),t.rotateAround(e,Math.PI*2*Math.random()),h.addToGroup(p,h.create(new n.Position,new n.Spawn({x:t.x,y:t.y}),new n.Explosion({ttl:.75,radius:70,max_particles:50,max_particle_size:2,max_velocity:175,color:"#f00"})))},setInterval(d,.5*Math.random()),v.start()})}).call(this);