$(document).ready(function(){function i(e,t,i){n=t,r=i}var e=null,t=null,n=null,r=[],s=function(e){this.replace(e)};_.extend(s.prototype,{replace:function(e){_.extend(this,_.pick($("<a></a>",{href:e})[0],"href","hash","host","search","fragment","pathname","protocol")),/^\//.test(this.pathname)||(this.pathname="/"+this.pathname)},toString:function(){return this.href}}),module("Backbone.Router",{setup:function(){t=new s("http://example.com"),Backbone.history=_.extend(new Backbone.History,{location:t}),e=new u({testing:101}),Backbone.history.interval=9,Backbone.history.start({pushState:!1}),n=null,r=[],Backbone.history.on("route",i)},teardown:function(){Backbone.history.stop(),Backbone.history.off("route",i)}});var o={value:"unset",routingFunction:function(e){this.value=e}};_.bindAll(o);var u=Backbone.Router.extend({count:0,routes:{noCallback:"noCallback",counter:"counter","search/:query":"search","search/:query/p:page":"search",contacts:"contacts","contacts/new":"newContact","contacts/:id":"loadContact","route-event/:arg":"routeEvent","optional(/:item)":"optionalItem","named/optional/(y:z)":"namedOptional","splat/*args/end":"splat",":repo/compare/*from...*to":"github","decode/:named/*splat":"decode","*first/complex-*part/*rest":"complex",":entity?*args":"query","function/:value":o.routingFunction,"*anything":"anything"},initialize:function(e){this.testing=e.testing,this.route("implicit","implicit")},counter:function(){this.count++},implicit:function(){this.count++},search:function(e,t){this.query=e,this.page=t},contacts:function(){this.contact="index"},newContact:function(){this.contact="new"},loadContact:function(){this.contact="load"},optionalItem:function(e){this.arg=e!=void 0?e:null},splat:function(e){this.args=e},github:function(e,t,n){this.repo=e,this.from=t,this.to=n},complex:function(e,t,n){this.first=e,this.part=t,this.rest=n},query:function(e,t){this.entity=e,this.queryArgs=t},anything:function(e){this.anything=e},namedOptional:function(e){this.z=e},decode:function(e,t){this.named=e,this.path=t},routeEvent:function(e){}});test("initialize",1,function(){equal(e.testing,101)}),test("routes (simple)",4,function(){t.replace("http://example.com#search/news"),Backbone.history.checkUrl(),equal(e.query,"news"),equal(e.page,void 0),equal(n,"search"),equal(r[0],"news")}),test("routes (simple, but unicode)",4,function(){t.replace("http://example.com#search/тест"),Backbone.history.checkUrl(),equal(e.query,"тест"),equal(e.page,void 0),equal(n,"search"),equal(r[0],"тест")}),test("routes (two part)",2,function(){t.replace("http://example.com#search/nyc/p10"),Backbone.history.checkUrl(),equal(e.query,"nyc"),equal(e.page,"10")}),test("routes via navigate",2,function(){Backbone.history.navigate("search/manhattan/p20",{trigger:!0}),equal(e.query,"manhattan"),equal(e.page,"20")}),test("routes via navigate for backwards-compatibility",2,function(){Backbone.history.navigate("search/manhattan/p20",!0),equal(e.query,"manhattan"),equal(e.page,"20")}),test("route precedence via navigate",6,function(){_.each([{trigger:!0},!0],function(t){Backbone.history.navigate("contacts",t),equal(e.contact,"index"),Backbone.history.navigate("contacts/new",t),equal(e.contact,"new"),Backbone.history.navigate("contacts/foo",t),equal(e.contact,"load")})}),test("loadUrl is not called for identical routes.",0,function(){Backbone.history.loadUrl=function(){ok(!1)},t.replace("http://example.com#route"),Backbone.history.navigate("route"),Backbone.history.navigate("/route"),Backbone.history.navigate("/route")}),test("use implicit callback if none provided",1,function(){e.count=0,e.navigate("implicit",{trigger:!0}),equal(e.count,1)}),test("routes via navigate with {replace: true}",1,function(){t.replace("http://example.com#start_here"),Backbone.history.checkUrl(),t.replace=function(e){strictEqual(e,(new s("http://example.com#end_here")).href)},Backbone.history.navigate("end_here",{replace:!0})}),test("routes (splats)",1,function(){t.replace("http://example.com#splat/long-list/of/splatted_99args/end"),Backbone.history.checkUrl(),equal(e.args,"long-list/of/splatted_99args")}),test("routes (github)",3,function(){t.replace("http://example.com#backbone/compare/1.0...braddunbar:with/slash"),Backbone.history.checkUrl(),equal(e.repo,"backbone"),equal(e.from,"1.0"),equal(e.to,"braddunbar:with/slash")}),test("routes (optional)",2,function(){t.replace("http://example.com#optional"),Backbone.history.checkUrl(),ok(!e.arg),t.replace("http://example.com#optional/thing"),Backbone.history.checkUrl(),equal(e.arg,"thing")}),test("routes (complex)",3,function(){t.replace("http://example.com#one/two/three/complex-part/four/five/six/seven"),Backbone.history.checkUrl(),equal(e.first,"one/two/three"),equal(e.part,"part"),equal(e.rest,"four/five/six/seven")}),test("routes (query)",5,function(){t.replace("http://example.com#mandel?a=b&c=d"),Backbone.history.checkUrl(),equal(e.entity,"mandel"),equal(e.queryArgs,"a=b&c=d"),equal(n,"query"),equal(r[0],"mandel"),equal(r[1],"a=b&c=d")}),test("routes (anything)",1,function(){t.replace("http://example.com#doesnt-match-a-route"),Backbone.history.checkUrl(),equal(e.anything,"doesnt-match-a-route")}),test("routes (function)",3,function(){e.on("route",function(e){ok(e==="")}),equal(o.value,"unset"),t.replace("http://example.com#function/set"),Backbone.history.checkUrl(),equal(o.value,"set")}),test("Decode named parameters, not splats.",2,function(){t.replace("http://example.com#decode/a%2Fb/c%2Fd/e"),Backbone.history.checkUrl(),strictEqual(e.named,"a/b"),strictEqual(e.path,"c/d/e")}),test("fires event when router doesn't have callback on it",1,function(){e.on("route:noCallback",function(){ok(!0)}),t.replace("http://example.com#noCallback"),Backbone.history.checkUrl()}),test("#933, #908 - leading slash",2,function(){t.replace("http://example.com/root/foo"),Backbone.history.stop(),Backbone.history=_.extend(new Backbone.History,{location:t}),Backbone.history.start({root:"/root",hashChange:!1,silent:!0}),strictEqual(Backbone.history.getFragment(),"foo"),Backbone.history.stop(),Backbone.history=_.extend(new Backbone.History,{location:t}),Backbone.history.start({root:"/root/",hashChange:!1,silent:!0}),strictEqual(Backbone.history.getFragment(),"foo")}),test("#1003 - History is started before navigate is called",1,function(){Backbone.history.stop(),Backbone.history.navigate=function(){ok(Backbone.History.started)},Backbone.history.start(),Backbone.history.iframe||ok(!0)}),test("#967 - Route callback gets passed encoded values.",3,function(){var t="has%2Fslash/complex-has%23hash/has%20space";Backbone.history.navigate(t,{trigger:!0}),strictEqual(e.first,"has/slash"),strictEqual(e.part,"has#hash"),strictEqual(e.rest,"has space")}),test("correctly handles URLs with % (#868)",3,function(){t.replace("http://example.com#search/fat%3A1.5%25"),Backbone.history.checkUrl(),t.replace("http://example.com#search/fat"),Backbone.history.checkUrl(),equal(e.query,"fat"),equal(e.page,void 0),equal(n,"search")}),test("#1185 - Use pathname when hashChange is not wanted.",1,function(){Backbone.history.stop(),t.replace("http://example.com/path/name#hash"),Backbone.history=_.extend(new Backbone.History,{location:t}),Backbone.history.start({hashChange:!1});var e=Backbone.history.getFragment();strictEqual(e,t.pathname.replace(/^\//,""))}),test("#1206 - Strip leading slash before location.assign.",1,function(){Backbone.history.stop(),t.replace("http://example.com/root/"),Backbone.history=_.extend(new Backbone.History,{location:t}),Backbone.history.start({hashChange:!1,root:"/root/"}),t.assign=function(e){strictEqual(e,"/root/fragment")},Backbone.history.navigate("/fragment")}),test("#1387 - Root fragment without trailing slash.",1,function(){Backbone.history.stop(),t.replace("http://example.com/root"),Backbone.history=_.extend(new Backbone.History,{location:t}),Backbone.history.start({hashChange:!1,root:"/root/",silent:!0}),strictEqual(Backbone.history.getFragment(),"")}),test("#1366 - History does not prepend root to fragment.",2,function(){Backbone.history.stop(),t.replace("http://example.com/root/"),Backbone.history=_.extend(new Backbone.History,{location:t,history:{pushState:function(e,t,n){strictEqual(n,"/root/x")}}}),Backbone.history.start({root:"/root/",pushState:!0,hashChange:!1}),Backbone.history.navigate("x"),strictEqual(Backbone.history.fragment,"x")}),test("Normalize root.",1,function(){Backbone.history.stop(),t.replace("http://example.com/root"),Backbone.history=_.extend(new Backbone.History,{location:t,history:{pushState:function(e,t,n){strictEqual(n,"/root/fragment")}}}),Backbone.history.start({pushState:!0,root:"/root",hashChange:!1}),Backbone.history.navigate("fragment")}),test("Normalize root.",1,function(){Backbone.history.stop(),t.replace("http://example.com/root#fragment"),Backbone.history=_.extend(new Backbone.History,{location:t,history:{pushState:function(e,t,n){},replaceState:function(e,t,n){strictEqual(n,"/root/fragment")}}}),Backbone.history.start({pushState:!0,root:"/root"})}),test("Normalize root.",1,function(){Backbone.history.stop(),t.replace("http://example.com/root"),Backbone.history=_.extend(new Backbone.History,{location:t}),Backbone.history.loadUrl=function(){ok(!0)},Backbone.history.start({pushState:!0,root:"/root"})}),test("Normalize root - leading slash.",1,function(){Backbone.history.stop(),t.replace("http://example.com/root"),Backbone.history=_.extend(new Backbone.History,{location:t,history:{pushState:function(){},replaceState:function(){}}}),Backbone.history.start({root:"root"}),strictEqual(Backbone.history.root,"/root/")}),test("Transition from hashChange to pushState.",1,function(){Backbone.history.stop(),t.replace("http://example.com/root#x/y"),Backbone.history=_.extend(new Backbone.History,{location:t,history:{pushState:function(){},replaceState:function(e,t,n){strictEqual(n,"/root/x/y")}}}),Backbone.history.start({root:"root",pushState:!0})}),test("#1619: Router: Normalize empty root",1,function(){Backbone.history.stop(),t.replace("http://example.com/"),Backbone.history=_.extend(new Backbone.History,{location:t,history:{pushState:function(){},replaceState:function(){}}}),Backbone.history.start({root:""}),strictEqual(Backbone.history.root,"/")}),test("#1619: Router: nagivate with empty root",1,function(){Backbone.history.stop(),t.replace("http://example.com/"),Backbone.history=_.extend(new Backbone.History,{location:t,history:{pushState:function(e,t,n){strictEqual(n,"/fragment")}}}),Backbone.history.start({pushState:!0,root:"",hashChange:!1}),Backbone.history.navigate("fragment")}),test("Transition from pushState to hashChange.",1,function(){Backbone.history.stop(),t.replace("http://example.com/root/x/y?a=b"),t.replace=function(e){strictEqual(e,"/root/?a=b#x/y")},Backbone.history=_.extend(new Backbone.History,{location:t,history:{pushState:null,replaceState:null}}),Backbone.history.start({root:"root",pushState:!0})}),test("#1695 - hashChange to pushState with search.",1,function(){Backbone.history.stop(),t.replace("http://example.com/root?a=b#x/y"),Backbone.history=_.extend(new Backbone.History,{location:t,history:{pushState:function(){},replaceState:function(e,t,n){strictEqual(n,"/root/x/y?a=b")}}}),Backbone.history.start({root:"root",pushState:!0})}),test("#1746 - Router allows empty route.",1,function(){var e=Backbone.Router.extend({routes:{"":"empty"},empty:function(){},route:function(e){strictEqual(e,"")}});new e}),test("#1794 - Trailing space in fragments.",1,function(){var e=new Backbone.History;strictEqual(e.getFragment("fragment   "),"fragment")}),test("#1820 - Leading slash and trailing space.",1,function(){var e=new Backbone.History;strictEqual(e.getFragment("/fragment "),"fragment")}),test("#1980 - Optional parameters.",2,function(){t.replace("http://example.com#named/optional/y"),Backbone.history.checkUrl(),strictEqual(e.z,undefined),t.replace("http://example.com#named/optional/y123"),Backbone.history.checkUrl(),strictEqual(e.z,"123")}),test("#2062 - Trigger 'route' event on router instance.",2,function(){e.on("route",function(e,t){strictEqual(e,"routeEvent"),deepEqual(t,["x"])}),t.replace("http://example.com#route-event/x"),Backbone.history.checkUrl()}),test("#2255 - Extend routes by making routes a function.",1,function(){var e=Backbone.Router.extend({routes:function(){return{home:"root",index:"index.html"}}}),t=e.extend({routes:function(){var e=t.__super__.routes;return _.extend(e(),{show:"show",search:"search"})}}),n=new t;deepEqual({home:"root",index:"index.html",show:"show",search:"search"},n.routes)})});