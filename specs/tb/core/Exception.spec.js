define(['require', 'tb.core', 'tb.core.Exception', 'tb.core.Api'], function (require) {
    'use strict';

    var expected,
        Exception = require('tb.core.Exception');

    describe('Exceptions spec', function () {
        it('Raise new Exception', function () {
            try {
                Exception('test', 'test message');
                expect(false).toBe(true);
            } catch (err) {
                expect(err).toBe('test: test message');
            }
        });

        it('Retreive log error', function () {
            var api = require('tb.core.Api'),
                errors = api.get('errors');

            expect(api.get('lastError')).not.toBe(null);;

            expect(errors.length).toBe(1);
        });

        it('Retreive multi log errors', function () {
            var api = require('tb.core.Api'),
                errors = api.get('errors');

            try {
                Exception('test2', 'test message');
                expect(false).toBe(true);
            } catch (err) {
                expect(err).toBe('test2: test message');
            }

            expect(api.get('lastError')).not.toBe(null);;

            expect(errors.length).toBe(2);
            expect(errors[errors.length - 1]).toBe(api.get('lastError'));
        });
    });
});
