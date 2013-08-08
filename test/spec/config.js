'use strict';

require.config({
    baseUrl: '../../scripts/',
    deps: ['runner'],
    paths: {
        spec: '../test/spec',
        runner: '../test/spec/runner',
        appConfig: 'config'
    },
    shim: {
        runner: ['appConfig']
    }
});
