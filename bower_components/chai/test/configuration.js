suite("configuration",function(){function t(){e.equal("foo","bar")}var e=chai.assert;test("Assertion.includeStack is true",function(){var n=chai.Assertion.includeStack;chai.Assertion.includeStack=!0;try{t(),e.ok(!1,"should not get here because error thrown")}catch(r){chai.Assertion.includeStack=n,"undefined"!=typeof r.stack&&e.include(r.stack,"fooThrows","should have stack trace in error message")}}),test("Assertion.includeStack is false",function(){var n=chai.Assertion.includeStack;chai.Assertion.includeStack=!1;try{t(),e.ok(!1,"should not get here because error thrown")}catch(r){chai.Assertion.includeStack=n,"undefined"!=typeof Error.captureStackTrace&&e.ok(!r.stack||r.stack.indexOf("at fooThrows")===-1,"should not have stack trace in error message")}}),test("AssertionError Properties",function(){var t=new chai.AssertionError({message:"Chai!"});e.equal(t.toString(),"Chai!")})});