/*!
 * Modernizr v2.6.3
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*! HTML5 Shiv v3.6.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed */

window.Modernizr=function(e,t,n){function A(e){f.cssText=e}function O(e,t){return A(p.join(e+";")+(t||""))}function M(e,t){return typeof e===t}function _(e,t){return!!~(""+e).indexOf(t)}function D(e,t){for(var r in e){var i=e[r];if(!_(i,"-")&&f[i]!==n)return t=="pfx"?i:!0}return!1}function P(e,t,r){for(var i in e){var s=t[e[i]];if(s!==n)return r===!1?e[i]:M(s,"function")?s.bind(r||t):s}return!1}function H(e,t,n){var r=e.charAt(0).toUpperCase()+e.slice(1),i=(e+" "+v.join(r+" ")+r).split(" ");return M(t,"string")||M(t,"undefined")?D(i,t):(i=(e+" "+m.join(r+" ")+r).split(" "),P(i,t,n))}function B(){i.input=function(n){for(var r=0,i=n.length;r<i;r++)w[n[r]]=n[r]in l;return w.list&&(w.list=!!t.createElement("datalist")&&!!e.HTMLDataListElement),w}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),i.inputtypes=function(e){for(var r=0,i,s,u,a=e.length;r<a;r++)l.setAttribute("type",s=e[r]),i=l.type!=="text",i&&(l.value=c,l.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(s)&&l.style.WebkitAppearance!==n?(o.appendChild(l),u=t.defaultView,i=u.getComputedStyle&&u.getComputedStyle(l,null).WebkitAppearance!=="textfield"&&l.offsetHeight!==0,o.removeChild(l)):/^(search|tel)$/.test(s)||(/^(url|email)$/.test(s)?i=l.checkValidity&&l.checkValidity()===!1:i=l.value!=c)),b[e[r]]=!!i;return b}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var r="2.6.3",i={},s=!0,o=t.documentElement,u="modernizr",a=t.createElement(u),f=a.style,l=t.createElement("input"),c=":)",h={}.toString,p=" -webkit- -moz- -o- -ms- ".split(" "),d="Webkit Moz O ms",v=d.split(" "),m=d.toLowerCase().split(" "),g={svg:"http://www.w3.org/2000/svg"},y={},b={},w={},E=[],S=E.slice,x,T=function(e,n,r,i){var s,a,f,l,c=t.createElement("div"),h=t.body,p=h||t.createElement("body");if(parseInt(r,10))while(r--)f=t.createElement("div"),f.id=i?i[r]:u+(r+1),c.appendChild(f);return s=["&#173;",'<style id="s',u,'">',e,"</style>"].join(""),c.id=u,(h?c:p).innerHTML+=s,p.appendChild(c),h||(p.style.background="",p.style.overflow="hidden",l=o.style.overflow,o.style.overflow="hidden",o.appendChild(p)),a=n(c,e),h?c.parentNode.removeChild(c):(p.parentNode.removeChild(p),o.style.overflow=l),!!a},N=function(t){var n=e.matchMedia||e.msMatchMedia;if(n)return n(t).matches;var r;return T("@media "+t+" { #"+u+" { position: absolute; } }",function(t){r=(e.getComputedStyle?getComputedStyle(t,null):t.currentStyle)["position"]=="absolute"}),r},C=function(){function r(r,i){i=i||t.createElement(e[r]||"div"),r="on"+r;var s=r in i;return s||(i.setAttribute||(i=t.createElement("div")),i.setAttribute&&i.removeAttribute&&(i.setAttribute(r,""),s=M(i[r],"function"),M(i[r],"undefined")||(i[r]=n),i.removeAttribute(r))),i=null,s}var e={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return r}(),k={}.hasOwnProperty,L;!M(k,"undefined")&&!M(k.call,"undefined")?L=function(e,t){return k.call(e,t)}:L=function(e,t){return t in e&&M(e.constructor.prototype[t],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(t){var n=this;if(typeof n!="function")throw new TypeError;var r=S.call(arguments,1),i=function(){if(this instanceof i){var e=function(){};e.prototype=n.prototype;var s=new e,o=n.apply(s,r.concat(S.call(arguments)));return Object(o)===o?o:s}return n.apply(t,r.concat(S.call(arguments)))};return i}),y.flexbox=function(){return H("flexWrap")},y.flexboxlegacy=function(){return H("boxDirection")},y.canvas=function(){var e=t.createElement("canvas");return!!e.getContext&&!!e.getContext("2d")},y.canvastext=function(){return!!i.canvas&&!!M(t.createElement("canvas").getContext("2d").fillText,"function")},y.webgl=function(){return!!e.WebGLRenderingContext},y.touch=function(){var n;return"ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch?n=!0:T(["@media (",p.join("touch-enabled),("),u,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=e.offsetTop===9}),n},y.geolocation=function(){return"geolocation"in navigator},y.postmessage=function(){return!!e.postMessage},y.websqldatabase=function(){return!!e.openDatabase},y.indexedDB=function(){return!!H("indexedDB",e)},y.hashchange=function(){return C("hashchange",e)&&(t.documentMode===n||t.documentMode>7)},y.history=function(){return!!e.history&&!!history.pushState},y.draganddrop=function(){var e=t.createElement("div");return"draggable"in e||"ondragstart"in e&&"ondrop"in e},y.websockets=function(){return"WebSocket"in e||"MozWebSocket"in e},y.rgba=function(){return A("background-color:rgba(150,255,150,.5)"),_(f.backgroundColor,"rgba")},y.hsla=function(){return A("background-color:hsla(120,40%,100%,.5)"),_(f.backgroundColor,"rgba")||_(f.backgroundColor,"hsla")},y.multiplebgs=function(){return A("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(f.background)},y.backgroundsize=function(){return H("backgroundSize")},y.borderimage=function(){return H("borderImage")},y.borderradius=function(){return H("borderRadius")},y.boxshadow=function(){return H("boxShadow")},y.textshadow=function(){return t.createElement("div").style.textShadow===""},y.opacity=function(){return O("opacity:.55"),/^0.55$/.test(f.opacity)},y.cssanimations=function(){return H("animationName")},y.csscolumns=function(){return H("columnCount")},y.cssgradients=function(){var e="background-image:",t="gradient(linear,left top,right bottom,from(#9f9),to(white));",n="linear-gradient(left top,#9f9, white);";return A((e+"-webkit- ".split(" ").join(t+e)+p.join(n+e)).slice(0,-e.length)),_(f.backgroundImage,"gradient")},y.cssreflections=function(){return H("boxReflect")},y.csstransforms=function(){return!!H("transform")},y.csstransforms3d=function(){var e=!!H("perspective");return e&&"webkitPerspective"in o.style&&T("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(t,n){e=t.offsetLeft===9&&t.offsetHeight===3}),e},y.csstransitions=function(){return H("transition")},y.fontface=function(){var e;return T('@font-face {font-family:"font";src:url("https://")}',function(n,r){var i=t.getElementById("smodernizr"),s=i.sheet||i.styleSheet,o=s?s.cssRules&&s.cssRules[0]?s.cssRules[0].cssText:s.cssText||"":"";e=/src/i.test(o)&&o.indexOf(r.split(" ")[0])===0}),e},y.generatedcontent=function(){var e;return T(["#",u,"{font:0/0 a}#",u,':after{content:"',c,'";visibility:hidden;font:3px/1 a}'].join(""),function(t){e=t.offsetHeight>=3}),e},y.video=function(){var e=t.createElement("video"),n=!1;try{if(n=!!e.canPlayType)n=new Boolean(n),n.ogg=e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),n.h264=e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),n.webm=e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(r){}return n},y.audio=function(){var e=t.createElement("audio"),n=!1;try{if(n=!!e.canPlayType)n=new Boolean(n),n.ogg=e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),n.mp3=e.canPlayType("audio/mpeg;").replace(/^no$/,""),n.wav=e.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),n.m4a=(e.canPlayType("audio/x-m4a;")||e.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(r){}return n},y.localstorage=function(){try{return localStorage.setItem(u,u),localStorage.removeItem(u),!0}catch(e){return!1}},y.sessionstorage=function(){try{return sessionStorage.setItem(u,u),sessionStorage.removeItem(u),!0}catch(e){return!1}},y.webworkers=function(){return!!e.Worker},y.applicationcache=function(){return!!e.applicationCache},y.svg=function(){return!!t.createElementNS&&!!t.createElementNS(g.svg,"svg").createSVGRect},y.inlinesvg=function(){var e=t.createElement("div");return e.innerHTML="<svg/>",(e.firstChild&&e.firstChild.namespaceURI)==g.svg},y.smil=function(){return!!t.createElementNS&&/SVGAnimate/.test(h.call(t.createElementNS(g.svg,"animate")))},y.svgclippaths=function(){return!!t.createElementNS&&/SVGClipPath/.test(h.call(t.createElementNS(g.svg,"clipPath")))};for(var j in y)L(y,j)&&(x=j.toLowerCase(),i[x]=y[j](),E.push((i[x]?"":"no-")+x));return i.input||B(),i.addTest=function(e,t){if(typeof e=="object")for(var r in e)L(e,r)&&i.addTest(r,e[r]);else{e=e.toLowerCase();if(i[e]!==n)return i;t=typeof t=="function"?t():t,typeof s!="undefined"&&s&&(o.className+=" "+(t?"":"no-")+e),i[e]=t}return i},A(""),a=l=null,function(e,t){function l(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function c(){var e=g.elements;return typeof e=="string"?e.split(" "):e}function h(e){var t=a[e[o]];return t||(t={},u++,e[o]=u,a[u]=t),t}function p(e,n,s){n||(n=t);if(f)return n.createElement(e);s||(s=h(n));var o;return s.cache[e]?o=s.cache[e].cloneNode():i.test(e)?o=(s.cache[e]=s.createElem(e)).cloneNode():o=s.createElem(e),o.canHaveChildren&&!r.test(e)?s.frag.appendChild(o):o}function d(e,n){e||(e=t);if(f)return e.createDocumentFragment();n=n||h(e);var r=n.frag.cloneNode(),i=0,s=c(),o=s.length;for(;i<o;i++)r.createElement(s[i]);return r}function v(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return g.shivMethods?p(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+c().join().replace(/\w+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(g,t.frag)}function m(e){e||(e=t);var n=h(e);return g.shivCSS&&!s&&!n.hasCSS&&(n.hasCSS=!!l(e,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),f||v(e,n),e}var n=e.html5||{},r=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,i=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,s,o="_html5shiv",u=0,a={},f;(function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",s="hidden"in e,f=e.childNodes.length==1||function(){t.createElement("a");var e=t.createDocumentFragment();return typeof e.cloneNode=="undefined"||typeof e.createDocumentFragment=="undefined"||typeof e.createElement=="undefined"}()}catch(n){s=!0,f=!0}})();var g={elements:n.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:n.shivCSS!==!1,supportsUnknownElements:f,shivMethods:n.shivMethods!==!1,type:"default",shivDocument:m,createElement:p,createDocumentFragment:d};e.html5=g,m(t)}(this,t),i._version=r,i._prefixes=p,i._domPrefixes=m,i._cssomPrefixes=v,i.mq=N,i.hasEvent=C,i.testProp=function(e){return D([e])},i.testAllProps=H,i.testStyles=T,i.prefixed=function(e,t,n){return t?H(e,t,n):H(e,"pfx")},o.className=o.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(s?" js "+E.join(" "):""),i}(this,this.document);