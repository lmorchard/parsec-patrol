var require = {
    baseUrl: '../scripts',
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore-amd/underscore',
        backbone: '../bower_components/backbone-amd/backbone',
        pubsub: '../bower_components/pubsub-js/src/pubsub',
        async: '../app/bower_components/async/lib/async',
        Hammer: '../app/bower_components/hammerjs/dist/hammer',
        KeyboardJS: '../app/scripts/vendor/KeyboardJS-master/keyboard',
        'THREEx.KeyboardState': '../app/bower_components/threex.keyboardstate/threex.keyboardstate'
    },
    shim: {
        async: { exports: 'async' },
        'Hammer': { exports: 'Hammer' },
        'THREEx.KeyboardState': { exports: 'THREEx.KeyboardState' }
    }
};
