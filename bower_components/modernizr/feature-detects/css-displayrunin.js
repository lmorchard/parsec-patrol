Modernizr.testStyles(" #modernizr { display: run-in; } ",function(e,t){var n=window.getComputedStyle?getComputedStyle(e,null).getPropertyValue("display"):e.currentStyle.display;Modernizr.addTest("display-runin",n=="run-in")});