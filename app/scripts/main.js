require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore-amd/underscore',
        backbone: '../bower_components/backbone-amd/backbone'
    }
});

require(['app', 'jquery', 'hello'], function (app, $, hello) {
    'use strict';
    // use app here
    console.log(hello);
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
});
