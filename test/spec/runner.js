/* global define */
define([
    // All your tests go here.
    'spec/app.test'
], function () {
    'use strict';

    window.console = window.console || function() {};
    window.notrack = true;
    window.mocha.run();
});
