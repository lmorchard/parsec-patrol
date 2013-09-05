/* jshint -W079, -W098 */
var require = {
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore-amd/underscore',
        backbone: '../bower_components/backbone-amd/backbone',
        pubsub: '../bower_components/pubsub-js/src/pubsub',
        async: '../bower_components/async/lib/async',
        Hammer: '../bower_components/hammerjs/dist/hammer',
        'THREEx.KeyboardState': '../bower_components/threex.keyboardstate/threex.keyboardstate',
        'Stats': '../bower_components/stats.js/src/Stats'
    },
    shim: {
        async: { exports: 'async' },
        'Hammer': { exports: 'Hammer' },
        'THREEx.KeyboardState': { exports: 'THREEx.KeyboardState' },
        'Stats': { exports: 'Stats' }
    }
};
