(function(){var e={}.hasOwnProperty,t=function(t,n){function i(){this.constructor=t}for(var r in n)e.call(n,r)&&(t[r]=n[r]);return i.prototype=n.prototype,t.prototype=new i,t.__super__=n.prototype,t};define(["entities","underscore"],function(e,n){var r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L,A,O,M,_,D,P,H,B,j;return u=function(){function e(e){var t,r,i;e==null&&(e={}),r=n.defaults(e,this.constructor.defaults);for(t in r)i=r[t],this[t]=n.isFunction(i)?i():i}return e.prototype.toString=function(){return""+this.type+": "+JSON.stringify(this)},e}(),E=function(e){function n(){return x=n.__super__.constructor.apply(this,arguments),x}return t(n,e),n.defaults={type:"TypeName",name:""},n}(u),a=function(e){function n(){return T=n.__super__.constructor.apply(this,arguments),T}return t(n,e),n.defaults={type:"EntityName",name:""},n}(u),h=function(e){function n(){return O=n.__super__.constructor.apply(this,arguments),O}return t(n,e),n.defaults={type:"Position",x:0,y:0,rotation:0},n}(u),c=function(e){function r(){return M=r.__super__.constructor.apply(this,arguments),M}return t(r,e),r.defaults={type:"Orbit",orbited_id:null,rad_per_sec:function(){return n.random(Math.PI/32,Math.PI)},rotate:!0,angle:0},r}(u),g=function(e){function r(){return _=r.__super__.constructor.apply(this,arguments),_}return t(r,e),r.defaults={type:"Spin",rad_per_sec:function(){return n.random(Math.PI/32,Math.PI)}},r}(u),i=function(e){function r(){return D=r.__super__.constructor.apply(this,arguments),D}return t(r,e),r.defaults={type:"Bouncer",x_dir:1,y_dir:1,x_sec:null,y_sec:null,x_sec:function(){return n.random(20,200)},y_sec:function(){return n.random(20,200)}},r}(u),m=function(e){function n(){return P=n.__super__.constructor.apply(this,arguments),P}return t(n,e),n.defaults={type:"Spawn",position_logic:"at",x:0,y:0,destroy:!1},n}(u),w=function(e){function n(){return H=n.__super__.constructor.apply(this,arguments),H}return t(n,e),n.defaults={type:"Tombstone",load:{},components:[]},n}(u),y=function(e){function n(){return B=n.__super__.constructor.apply(this,arguments),B}return t(n,e),n.defaults={type:"Sprite",shape:"sun",stroke_style:"#fff",width:30,height:30},n}(u),d=function(e){function n(){return j=n.__super__.constructor.apply(this,arguments),j}return t(n,e),n.defaults={type:"Renderable"},n}(u),o=function(e){function n(e){n.__super__.constructor.call(this,e),this.in_collision_with={}}return t(n,e),n.defaults={type:"Collidable"},n}(u),b=function(e){function n(){return N=n.__super__.constructor.apply(this,arguments),N}return t(n,e),n.defaults={type:"Thruster",active:!0,max_v:0,dv:0,dx:0,dy:0},n}(u),v=function(e){function n(){return C=n.__super__.constructor.apply(this,arguments),C}return t(n,e),n.defaults={type:"Seeker",target:null,rad_per_sec:0},n}(u),s=function(e){function n(){return k=n.__super__.constructor.apply(this,arguments),k}return t(n,e),n.defaults={type:"ClickCourse",stop_on_arrival:!1,active:!0},n}(u),S=function(e){function n(){return L=n.__super__.constructor.apply(this,arguments),L}return t(n,e),n.defaults={type:"WeaponsTarget",team:"foe"},n}(u),r=function(e){function n(e){var t;n.__super__.constructor.call(this,e),this.beams=function(){var e,n,r;r=[];for(t=e=1,n=this.max_beams;1<=n?e<=n:e>=n;t=1<=n?++e:--e)r.push({target:null,x:0,y:0,charging:!0,charge:0});return r}.call(this)}return t(n,e),n.defaults={type:"BeamWeapon",x:0,y:0,max_beams:12,active_beams:4,max_range:150,max_power:150,charge_rate:150,discharge_rate:300,color:"#6f6",target_team:"enemy",dmg_penalty:.2,range_penalty:.8},n}(u),l=function(e){function n(e){n.__super__.constructor.call(this,e),this.current==null&&(this.current=this.max)}return t(n,e),n.defaults={type:"Health",max:1e3,current:null},n}(u),f=function(e){function n(e){var t,r,i;n.__super__.constructor.call(this,e),this.particles=[];for(t=r=0,i=this.max_particles-1;0<=i?r<=i:r>=i;t=0<=i?++r:--r)this.particles.push({free:!0,x:0,y:0,dx:0,dy:0,s:0,mr:0})}return t(n,e),n.defaults={type:"Explosion",ttl:2,radius:100,max_particles:100,max_particle_size:4,max_velocity:300,color:"#f00",age:0,stop:!1},n}(u),p=function(e){function n(){return A=n.__super__.constructor.apply(this,arguments),A}return t(n,e),n.defaults={type:"RadarPing",color:"#fff"},n}(u),{Component:u,TypeName:E,EntityName:a,Position:h,Orbit:c,Spin:g,Bouncer:i,Spawn:m,Tombstone:w,Collidable:o,Renderable:d,Sprite:y,Thruster:b,Seeker:v,ClickCourse:s,WeaponsTarget:S,BeamWeapon:r,Health:l,Explosion:f,RadarPing:p}})}).call(this);