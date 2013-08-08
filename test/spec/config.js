'use strict';

require.config({
    baseUrl: '../../app/scripts/',
    deps: ['runner'],
    paths: {
        spec: '../../test/spec',
        runner: '../../test/spec/runner',
        appConfig: '../../app/scripts/config'
    },
    shim: {
        runner: ['appConfig']
    }
});
