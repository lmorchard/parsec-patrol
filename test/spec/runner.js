/* global define */
define([
    // All your tests go here.
    'spec/test-app',
    'spec/test-hello'
], function () {
    'use strict';

    window.console = window.console || function() {};
    window.notrack = true;
    window.mocha.run();
});
