describe("uncaught",function(){beforeEach(function(e){process.nextTick(function(){e()})}),it("should report properly",function(e){process.nextTick(function(){e()})})});