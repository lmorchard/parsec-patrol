/* global define */
'use strict';
define([
    'spec/test-games',
    'spec/test-maps',
    'spec/test-entities'
], function () {
    window.console = window.console || function() {};
    window.notrack = true;
    window.mocha.run();
});
