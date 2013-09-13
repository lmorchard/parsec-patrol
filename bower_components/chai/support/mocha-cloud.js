/*!
 * Mocha Cloud (SauceLabs) Test Runner
 */

/*!
 * Module dependencies
 */

/*!
 * Attempt to load saucelabs authentication
 */

/*!
 * Create cloud and test server
 */

/*!
 * Connect Middleware
 */

/*!
 * SauceLabs configuration
 */

/*!
 * Chrome
 */

/*!
 * Firefox
 */

/*!
 * Safari
 */

/*!
 * Internet Explorer
 */

/*!
 * iPad
 */

/*!
 * iPhone
 */

/*!
 * SauceLabs events
 */

/*!
 * Start server
 */

var Cloud=require("mocha-cloud"),connect=require("connect"),http=require("http"),resolve=require("path").resolve,auth;try{auth=require("../test/auth/sauce.json")}catch(ex){console.error('Error loading SauceLabs authentication at "./test/auth/sauce.json"'),process.exit(1)}var app=connect(),cloud=new Cloud("chai.js",auth.username,auth.key),server=http.createServer(app);app.use(connect.static(resolve(__dirname,".."))),cloud.url("http://localhost:3000/test/browser/sauce.html"),cloud.browser("chrome",null,"Mac 10.6"),cloud.browser("chrome",null,"Mac 10.8"),cloud.browser("safari","5","Mac 10.6"),cloud.browser("safari","6","Mac 10.8"),cloud.browser("ipad","4.3","Mac 10.6"),cloud.browser("ipad","5","Mac 10.6"),cloud.browser("ipad","5.1","Mac 10.8"),cloud.browser("ipad","6","Mac 10.8"),cloud.browser("iphone","4.3","Mac 10.6"),cloud.browser("iphone","5","Mac 10.6"),cloud.browser("iphone","5.1","Mac 10.8"),cloud.browser("iphone","6","Mac 10.8"),cloud.on("init",function(e){console.log("  init : %s %s",e.browserName,e.version)}),cloud.on("start",function(e){console.log("  start : %s %s",e.browserName,e.version)}),cloud.on("end",function(e,t){console.log("  end : %s %s : %d failures",e.browserName,e.version,t.failures)}),server.listen(3e3,function(){cloud.start(function(){console.log("done"),server.close()})});