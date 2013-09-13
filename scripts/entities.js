(function(){var e=[].slice,t={}.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return i.prototype=n.prototype,e.prototype=new i,e.__super__=n.prototype,e};define(["components","utils","underscore"],function(t,r,i){var s,o,u,a,f,l,c,h,p,d,v,m;return u=function(){function t(){this.store={},this.gid=0,this.entities_by_group={},this.groups_by_entity={}}return t.prototype.create=function(){var t,n,i,s,o;n=1<=arguments.length?e.call(arguments,0):[],i=r.generateID();for(s=0,o=n.length;s<o;s++)t=n[s],this.addComponent(i,t);return i},t.prototype.destroy=function(e){var t,n,r,i;n=this.groupForEntity(e),n!==null&&this.removeFromGroup(n,e),i=this.store;for(r in i)t=i[r],e in t&&delete t[e];return this},t.prototype.has=function(e){var t,n,r;r=this.store;for(n in r){t=r[n];if(e in t)return!0}return!1},t.prototype.get=function(){var t,n,r,i,s,o,u,a,f,l,c;i=arguments[0],r=2<=arguments.length?e.call(arguments,1):[];if(r.length===1)return(f=this.store[r[0].prototype.type])!=null?f[i]:void 0;if(r.length>1){s=[];for(u=0,a=r.length;u<a;u++)n=r[u],s.push((l=this.store[n.prototype.type])!=null?l[i]:void 0);return s}s={},c=this.store;for(o in c)t=c[o],i in t&&(s[o]=t[i]);return s},t.prototype.addComponent=function(){var t,n,r,i,s,o,u;r=arguments[0],n=2<=arguments.length?e.call(arguments,1):[];for(o=0,u=n.length;o<u;o++)t=n[o],i=t.type,(s=this.store)[i]==null&&(s[i]={}),this.store[i][r]=t;return this},t.prototype.removeComponent=function(){var t,n,r,i,s;r=arguments[0],n=2<=arguments.length?e.call(arguments,1):[];for(i=0,s=n.length;i<s;i++)t=n[i],delete this.store[t.type][r];return this},t.prototype.getComponents=function(e){return this.store[e.prototype.type]||{}},t.prototype.createGroup=function(){var t,n;return t=1<=arguments.length?e.call(arguments,0):[],this.entities_by_group[n=++this.gid]={},t.length>0&&this.addToGroup.apply(this,[n].concat(e.call(t))),n},t.prototype.addToGroup=function(){var t,n,r,i,s,o;r=arguments[0],t=2<=arguments.length?e.call(arguments,1):[],o=[];for(i=0,s=t.length;i<s;i++)n=t[i],this.entities_by_group[r][n]=1,o.push(this.groups_by_entity[n]=r);return o},t.prototype.removeFromGroup=function(e,t){return this.groupHasEntity(e,t)?(delete this.entities_by_group[e][t],delete this.groups_by_entity[t]):!1},t.prototype.groupForEntity=function(e){return this.groups_by_entity[e]},t.prototype.groupHasEntity=function(e,t){return e in this.entities_by_group?t in this.entities_by_group[e]:!1},t.prototype.entitiesForGroup=function(e){return e in this.entities_by_group?this.entities_by_group[e]:[]},t}(),a=function(){function e(){}return e.create=function(e){return e.create()},e}(),l=function(e){function t(){return h=t.__super__.constructor.apply(this,arguments),h}return n(t,e),t}(a),o=function(e){function t(){return p=t.__super__.constructor.apply(this,arguments),p}return n(t,e),t}(l),c=function(e){function r(){return d=r.__super__.constructor.apply(this,arguments),d}return n(r,e),r.create=function(e,n){return n==null&&(n="unnamed"),e.create(new t.TypeName("Star"),new t.EntityName(n),new t.Spawn("center"),new t.Position,new t.Sprite("star"))},r}(o),s=function(e){function r(){return v=r.__super__.constructor.apply(this,arguments),v}return n(r,e),r.create=function(e,n){return n==null&&(n="unnamed"),e.create(new t.TypeName("Asteroid"),new t.EntityName(n),new t.Spawn("random"),new t.Position,new t.Sprite("asteroid"))},r}(o),f=function(e){function r(){return m=r.__super__.constructor.apply(this,arguments),m}return n(r,e),r.create=function(e,n,r){return n==null&&(n="unnamed"),e.create(new t.TypeName("Planet"),new t.EntityName(n),new t.Spawn("random"),new t.Position,new t.Orbit(r),new t.Sprite("planet"))},r}(o),{EntityManager:u,Star:c,Asteroid:s,Planet:f}})}).call(this);