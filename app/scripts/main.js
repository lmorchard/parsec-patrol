require(['app', 'hello', 'jquery'], function (app, hello, $) {
    'use strict';
    // use app here
    console.log(app);
    console.log(hello);
    console.log('Running jQuery %s', $().jquery);
});
