function Spec(e){function s(){return Array(r).join("  ")}Base.call(this,e);var t=this,n=this.stats,r=0,i=0;e.on("start",function(){console.log()}),e.on("suite",function(e){++r,console.log(color("suite","%s%s"),s(),e.title)}),e.on("suite end",function(e){--r,1==r&&console.log()}),e.on("test",function(e){process.stdout.write(s()+color("pass","  ◦ "+e.title+": "))}),e.on("pending",function(e){var t=s()+color("pending","  - %s");console.log(t,e.title)}),e.on("pass",function(e){if("fast"==e.speed){var t=s()+color("checkmark","  "+Base.symbols.ok)+color("pass"," %s ");cursor.CR(),console.log(t,e.title)}else{var t=s()+color("checkmark","  "+Base.symbols.ok)+color("pass"," %s ")+color(e.speed,"(%dms)");cursor.CR(),console.log(t,e.title,e.duration)}}),e.on("fail",function(e,t){cursor.CR(),console.log(s()+color("fail","  %d) %s"),++i,e.title)}),e.on("end",t.epilogue.bind(t))}var Base=require("./base"),cursor=Base.cursor,color=Base.color;exports=module.exports=Spec,Spec.prototype.__proto__=Base.prototype;