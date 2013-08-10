require.config({
    deps: ['main'],
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore-amd/underscore',
        backbone: '../bower_components/backbone-amd/backbone',
        pubsub: '../bower_components/pubsub-js/src/pubsub',
        async: '../app/bower_components/async/lib/async'
    },
    shim: {
        async: {
            exports: 'async'
        }
    }
});
