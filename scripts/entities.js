(function(){var e=[].slice,t={}.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return i.prototype=n.prototype,e.prototype=new i,e.__super__=n.prototype,e};define(["components","utils","underscore","QuadTree"],function(t,r,i,s){var o,u,a,f,l,c,h,p,d,v,m,g;return a=function(){function n(e,t){this.width=e!=null?e:1e3,this.height=t!=null?t:1e3,this.reset()}return n.prototype.reset=function(){return this.store={},this.max_eid=0,this.max_gid=0,this.entities_by_group={},this.groups_by_entity={},this.quadtrees={}},n.prototype.load=function(t){var n,r,i,s,o,u,a;this.reset(),u=t.entities;for(i in u)n=u[i],r=this.loadComponents(n),this.put.apply(this,[i].concat(e.call(r)));a=t.groups;for(o in a)s=a[o],this.addToGroup.apply(this,[o].concat(e.call(s)));return this.max_eid=t.max_eid||0,this.max_gid=t.max_gid||0},n.prototype.loadComponents=function(e){var n,r,i;n=[];for(r in e)i=e[r],n.push(new t[r](i));return n},n.prototype.save=function(){var e,t,n,r,s,o,u,a,f,l;n={max_eid:this.max_eid,max_gid:this.max_gid,groups:{},entities:{}},f=this.entities_by_group;for(o in f)s=f[o],n.groups[o]=i.keys(s);l=this.store;for(u in l){e=l[u];for(r in e)t=e[r],(a=n.entities)[r]==null&&(a[r]={}),n.entities[r][u]=i.clone(t)}return n},n.prototype.create=function(){var t;return t=1<=arguments.length?e.call(arguments,0):[],this.put.apply(this,[this.max_eid++].concat(e.call(t)))},n.prototype.put=function(){var t,n,r,i,s;r=arguments[0],n=2<=arguments.length?e.call(arguments,1):[];for(i=0,s=n.length;i<s;i++)t=n[i],this.addComponent(r,t);return r},n.prototype.destroy=function(e){var t,n,r,i;n=this.groupForEntity(e),n!==null&&this.removeFromGroup(n,e),i=this.store;for(r in i)t=i[r],e in t&&delete t[e];return this},n.prototype.has=function(e){var t,n,r;r=this.store;for(n in r){t=r[n];if(e in t)return!0}return!1},n.prototype.get=function(){var t,n,r,i,s,o,u,a,f,l,c;i=arguments[0],r=2<=arguments.length?e.call(arguments,1):[];if(r.length===1)return(f=this.store[r[0].defaults.type])!=null?f[i]:void 0;if(r.length>1){s=[];for(u=0,a=r.length;u<a;u++)n=r[u],s.push((l=this.store[n.defaults.type])!=null?l[i]:void 0);return s}s={},c=this.store;for(o in c)t=c[o],i in t&&(s[o]=t[i]);return s},n.prototype.addComponent=function(){var t,n,r,i,s,o,u;r=arguments[0],n=2<=arguments.length?e.call(arguments,1):[];for(o=0,u=n.length;o<u;o++)t=n[o],i=t.type,(s=this.store)[i]==null&&(s[i]={}),this.store[i][r]=t;return this},n.prototype.removeComponent=function(){var t,n,r,i,s;r=arguments[0],n=2<=arguments.length?e.call(arguments,1):[];for(i=0,s=n.length;i<s;i++)t=n[i],delete this.store[t.type][r];return this},n.prototype.getComponents=function(e){return this.store[e.defaults.type]||{}},n.prototype.createGroup=function(){var t,n;return t=1<=arguments.length?e.call(arguments,0):[],this.entities_by_group[n=++this.max_gid]={},t.length>0&&this.addToGroup.apply(this,[n].concat(e.call(t))),n},n.prototype.addToGroup=function(){var t,n,r,i,s,o;r=arguments[0],t=2<=arguments.length?e.call(arguments,1):[],r in this.entities_by_group||(this.entities_by_group[r]={}),o=[];for(i=0,s=t.length;i<s;i++)n=t[i],this.entities_by_group[r][n]=1,o.push(this.groups_by_entity[n]=r);return o},n.prototype.removeFromGroup=function(e,t){return this.groupHasEntity(e,t)?(delete this.entities_by_group[e][t],delete this.groups_by_entity[t]):!1},n.prototype.groupForEntity=function(e){return this.groups_by_entity[e]},n.prototype.groupHasEntity=function(e,t){return e in this.entities_by_group?t in this.entities_by_group[e]:!1},n.prototype.entitiesForGroup=function(e){return e in this.entities_by_group?this.entities_by_group[e]:[]},n.prototype.update=function(e){return this.update_quadtrees()},n.prototype.update_quadtrees=function(){var e,t;t=[];for(e in this.entities_by_group)t.push(this.update_quadtree(e));return t},n.prototype.update_quadtree=function(e){var t,n,r,i,o,u,a,f,l;this.quadtrees[e]?(o=this.quadtrees[e],o.clear()):o=this.quadtrees[e]=new s({x:0-this.width/2,y:0-this.height/2,width:this.width,height:this.height},!1),f=this.entities_by_group[e],l=[];for(n in f){r=f[n],u=this.store.Spawn[n];if(!u||u.destroy||!u.spawned)continue;a=this.store.Sprite[n];if(!a)continue;t=this.store.Collidable[n],i=this.store.Position[n],l.push(o.insert({eid:n,x:i.x,y:i.y,width:a.width,height:a.height,collidable:t,pos:i,sprite:a}))}return l},n}(),f=function(){function e(){}return e.create=function(e){return e.create()},e}(),c=function(e){function t(){return p=t.__super__.constructor.apply(this,arguments),p}return n(t,e),t}(f),u=function(e){function t(){return d=t.__super__.constructor.apply(this,arguments),d}return n(t,e),t}(c),h=function(e){function r(){return v=r.__super__.constructor.apply(this,arguments),v}return n(r,e),r.create=function(e,n){return n==null&&(n="unnamed"),e.create(new t.TypeName("Star"),new t.EntityName(n),new t.Spawn("center"),new t.Position,new t.Sprite("star"))},r}(u),o=function(e){function r(){return m=r.__super__.constructor.apply(this,arguments),m}return n(r,e),r.create=function(e,n){return n==null&&(n="unnamed"),e.create(new t.TypeName("Asteroid"),new t.EntityName(n),new t.Spawn("random"),new t.Position,new t.Sprite("asteroid"))},r}(u),l=function(e){function r(){return g=r.__super__.constructor.apply(this,arguments),g}return n(r,e),r.create=function(e,n,r){return n==null&&(n="unnamed"),e.create(new t.TypeName("Planet"),new t.EntityName(n),new t.Spawn("random"),new t.Position,new t.Orbit(r),new t.Sprite("planet"))},r}(u),{EntityManager:a,Star:h,Asteroid:o,Planet:l}})}).call(this);