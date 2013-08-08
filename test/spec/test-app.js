/* global define, describe, it, should */
define(['app'], function (app) {
    'use strict';

    var should = chai.should();

    describe('app', function () {
        it('should exist', function() {
            should.exist(app);
        });
    });
});
