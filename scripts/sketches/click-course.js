(function(){define("sketches/click-course",["worlds","entities","components","systems","pubsub","jquery","underscore"],function(e,t,n,r,i,s,o){var u,a,f,l,c,h,p,d,v,m,g;return a=document.getElementById("gameCanvas"),u=document.getElementById("gameArea"),g=new e.World(640,480,new r.ViewportSystem(window,u,a,1,1),new r.PointerInputSystem(a),new r.ClickCourseSystem,new r.SpawnSystem,new r.SpinSystem,new r.SeekerSystem,new r.ThrusterSystem),v=g.entities,g.current_scene=m=v.createGroup(d=t.Star.create(v,"Sun"),p=v.create(new n.TypeName("HeroShip"),new n.EntityName("hero"),new n.Sprite("hero"),new n.Position,new n.Spawn("at",-40,40),new n.Collidable,new n.Thruster(150,75,0,0,!1),new n.ClickCourse(!0),new n.Seeker(null,Math.PI)),f=v.create(new n.TypeName("EnemyScout"),new n.EntityName("enemy3"),new n.Sprite("enemyscout","#fff",15,15),new n.Spawn("at",-80,0),new n.Position,new n.Collidable,new n.Thruster(100,50,0,0),new n.Seeker(p,Math.PI)),l=v.create(new n.TypeName("EnemyScout"),new n.EntityName("enemy3"),new n.Sprite("enemyscout","#fff",15,15),new n.Spawn("at",0,80),new n.Position,new n.Collidable,new n.Thruster(100,50,0,0),new n.Seeker(f,Math.PI)),c=v.create(new n.TypeName("EnemyScout"),new n.EntityName("enemy5"),new n.Sprite("enemyscout","#fff",15,15),new n.Spawn("at",80,0),new n.Position,new n.Collidable,new n.Thruster(100,50,0,0),new n.Seeker(l,Math.PI*2)),h=v.create(new n.TypeName("EnemyScout"),new n.EntityName("enemy6"),new n.Sprite("enemyscout","#fff",15,15),new n.Spawn("at",80,-80),new n.Position,new n.Collidable,new n.Thruster(100,50,0,0),new n.Seeker(c,Math.PI*2))),window.world=g,g.start()})}).call(this);