/* global define */
define([
    'spec/test-app',
    'spec/test-maps',
    'spec/test-entities'
], function () {
    window.console = window.console || function() {};
    window.notrack = true;
    window.mocha.run();
});
