(function(){define("app",["worlds","entities","components","systems","pubsub","jquery","underscore","Vector2D","utils"],function(e,t,n,r,i,s,o,u,a){var f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N=this;h=document.getElementById("gameCanvas"),l=document.getElementById("gameArea"),x=new e.World(640,480,new r.ViewportSystem(window,l,h,1,1),new r.KeyboardInputSystem(h),new r.PointerInputSystem(h),new r.ClickCourseSystem,new r.SpawnSystem,new r.OrbiterSystem,new r.SpinSystem,new r.SeekerSystem,new r.ThrusterSystem,new r.HealthSystem,new r.BeamWeaponSystem,new r.ExplosionSystem),v=x.entities,x.current_scene=y=v.createGroup(d=t.Star.create(v,"Sun"),p=v.create(new n.TypeName("HeroShip"),new n.EntityName("hero"),new n.Sprite("hero"),new n.Position,new n.Spawn("at",-65,65),new n.Collidable,new n.Thruster(150,75,0,0,!1),new n.ClickCourse(w=!0),new n.Seeker(null,Math.PI),new n.Health(2e4),new n.WeaponsTarget("commonwealth"),c=new n.BeamWeapon(15,9,1250,4e3,4e3,4e3,"#33f","invaders"))),f=24,S=new u(0,-300),E=new u(0,0),m=0,s("#beam_sel").click(function(e){var t;return t=s(e.target),c.active_beams=t.attr("value"),!1}),b=function(){return m++,S.rotateAround(E,Math.PI*2*Math.random()),v.addToGroup(y,v.create(new n.TypeName("EnemyScout"),new n.EntityName("enemy-"+m),new n.Sprite("enemyscout","#f33",12,12),new n.Spawn("at",S.x,S.y),new n.Position,new n.Collidable,new n.Thruster(100,50,0,0),new n.Seeker(p,Math.PI*2),new n.Health(300),new n.WeaponsTarget("invaders"),new n.BeamWeapon(1,1,75,250,250,500,"#f44","commonwealth"),new n.Tombstone(new n.TypeName("Explosion"),new n.Position,new n.Explosion(.75,70,20,3,150,"#f33"))))};if(f)for(g=T=1;1<=f?T<=f:T>=f;g=1<=f?++T:--T)b();return x.subscribe(r.SpawnSystem.MSG_DESPAWN,function(e,t){var r,i,s,o,u;u=v.get(t.entity_id,n.TypeName),(u!=null?u.name:void 0)==="EnemyScout"&&(s=function(){var e,t;e=v.getComponents(n.TypeName),t=[];for(r in e)o=e[r],o.name==="EnemyScout"&&t.push(r);return t}(),s.length<=f&&b());if((u!=null?u.name:void 0)==="HeroShip")return i=function(){return location.reload()},setTimeout(i,5e3)}),function(){return x.start()}})}).call(this);