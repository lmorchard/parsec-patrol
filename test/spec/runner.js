/* global define */
'use strict';
define([
    'spec/test-app',
    'spec/test-worlds',
    'spec/test-maps',
    'spec/test-systems',
    'spec/test-components',
    'spec/test-entities'
], function () {
    window.console = window.console || function() {};
    window.notrack = true;
    window.mocha.run();
});
