define(['require', 'tb.core', 'tb.core.Api', 'tb.core.Logger'], function (require) {
    'use strict';

    var logger = require('tb.core.Logger'),
        api = require('tb.core.Api');

    describe('Logger spec', function () {
        it('Logs actions', function () {

            logger.emergency('Test a emergency log.');
            expect(api.get('logs').length).toBe(1);

            logger.info('Test a info log.');
            expect(api.get('logs').length).toBe(1);
        });

        it('Change logs level', function () {

            logger.updateLogLevel(6);
            logger.notice('Test a notice log with updated log level.');
            expect(api.get('logs').length).toBe(2);

            logger.restaureLogLevel();
            logger.warning('Test a warning log with reset log level.');
            expect(api.get('logs').length).toBe(2);

            logger.updateLogLevel();
            logger.debug('Test is a debug log with unvailable updated log level.');
            expect(api.get('logs').length).toBe(2);
        });

        it('Try custom log level', function () {

            logger.log(2, 'Test a custom log level 2.');
            expect(api.get('logs').length).toBe(3);

            logger.log('information', 'Test a custom log level 9.');
            expect(api.get('logs').length).toBe(3);
        });

        it('Try all miscellious log levels', function () {

            logger.alert('Test is a alert log.');
            expect(api.get('logs').length).toBe(4);

            logger.critical('Test is a critical log.');
            expect(api.get('logs').length).toBe(5);

            logger.error('Test is a error log.');
            expect(api.get('logs').length).toBe(6);
        });
    });
});