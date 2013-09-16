(function(){var e={}.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define("sketches/seeker",["worlds","entities","components","systems","pubsub","jquery","underscore"],function(e,n,r,i,s,o,u){var a,f,l,c,h,p,d,v;return a=function(e){function n(){return d=n.__super__.constructor.apply(this,arguments),d}return t(n,e),n.defaults={type:"PointerFollower"},n}(r.Component),r.PointerFollower=a,f=function(e){function n(){return v=n.__super__.constructor.apply(this,arguments),v}return t(n,e),n.prototype.match_component=a,n.prototype.update_match=function(e,t,n){var i;return i=this.world.entities.get(t,r.Position),i.x=this.world.inputs.pointer_world_x,i.y=this.world.inputs.pointer_world_y},n}(i.System),c=document.getElementById("gameCanvas"),l=document.getElementById("gameArea"),p=new e.World(320,240,new i.PointerInputSystem(c),new i.SpawnSystem,new i.SpinSystem,new i.SeekerSystem,new i.ThrusterSystem,new f,new i.ViewportSystem(window,l,c,1,1)),p.load(h={entities:{sun:{Sprite:{shape:"star"},Spawn:{position_logic:"center"},Position:{}},torp:{Spawn:{x:30,y:0},Position:{},Collidable:{},PointerFollower:{},Spin:{rad_per_sec:Math.PI*2},Sprite:{shape:"torpedo",stroke_style:"#f33",width:10,height:10}},enemy3:{Sprite:{shape:"enemyscout",stroke_style:"#3ff",width:15,height:15},Spawn:{x:-80,y:0},Position:{},Collidable:{},Thruster:{dv:150,max_v:75},Seeker:{target:"torp",rad_per_sec:Math.PI}},enemy4:{Sprite:{shape:"enemyscout",stroke_style:"#f3f",width:15,height:15},Spawn:{x:0,y:80},Position:{},Collidable:{},Thruster:{dv:150,max_v:75},Seeker:{target:"enemy3",rad_per_sec:Math.PI}},enemy5:{Sprite:{shape:"enemyscout",stroke_style:"#ff3",width:15,height:15},Spawn:{x:80,y:0},Position:{},Collidable:{},Thruster:{dv:150,max_v:75},Seeker:{target:"enemy4",rad_per_sec:Math.PI}},enemy6:{Sprite:{shape:"enemyscout",stroke_style:"#3f3",width:15,height:15},Spawn:{x:80,y:-80},Position:{},Collidable:{},Thruster:{dv:150,max_v:75},Seeker:{target:"enemy5",rad_per_sec:Math.PI}}},groups:{main:["sun","torp","enemy3","enemy4","enemy5","enemy6"]}}),p.measure_fps=!0,p.current_scene=u.keys(h.groups)[0],p.start()})}).call(this);