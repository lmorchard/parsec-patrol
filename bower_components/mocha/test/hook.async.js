describe("async",function(){var e=[];before(function(){e.push("root before all")}),after(function(){e.push("root after all"),e.should.eql(["root before all","before all","parent before","before","one","after","parent after","parent before","before","two","after","parent after","parent before","before","three","after","parent after","after all","root after all"])}),beforeEach(function(){e.push("parent before")}),afterEach(function(){e.push("parent after")}),describe("hooks",function(){before(function(){e.push("before all")}),after(function(){e.push("after all")}),beforeEach(function(t){process.nextTick(function(){e.push("before"),t()})}),it("one",function(t){e.should.eql(["root before all","before all","parent before","before"]),e.push("one"),process.nextTick(t)}),it("two",function(){e.should.eql(["root before all","before all","parent before","before","one","after","parent after","parent before","before"]),e.push("two")}),it("three",function(){e.should.eql(["root before all","before all","parent before","before","one","after","parent after","parent before","before","two","after","parent after","parent before","before"]),e.push("three")}),afterEach(function(t){process.nextTick(function(){e.push("after"),t()})})})});