define(['require', 'tb.core'], function (require) {
    'use strict';

    var api = require('tb.core');

    describe('Application manager spec', function () {
        it('Test register a new Application fail.', function () {
            api.ApplicationManager.registerApplication('test');
        });

        it('Register a new Application.', function () {
            api.ApplicationManager.registerApplication();
        });
    });
});