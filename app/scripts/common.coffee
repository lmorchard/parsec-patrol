# The build will inline common dependencies into this file.

requirejs.config
    baseUrl: 'scripts'
    paths:
        jquery: '../bower_components/jquery/jquery'
        underscore: '../bower_components/underscore-amd/underscore'
        backbone: '../bower_components/backbone-amd/backbone'
        pubsub: '../bower_components/pubsub-js/src/pubsub'
        async: '../bower_components/async/lib/async'
        Hammer: '../bower_components/hammerjs/dist/hammer'
        Stats: '../bower_components/stats.js/src/Stats'
        'THREEx.KeyboardState': '../bower_components/threex.keyboardstate/threex.keyboardstate'
        dat: 'vendor/dat.gui'
    shim:
        async:
            exports: 'async'
        Hammer:
            exports: 'Hammer'
        Stats:
            exports: 'Stats'
        'THREEx.KeyboardState':
            exports: 'THREEx.KeyboardState'
        dat:
            exports: 'dat'
