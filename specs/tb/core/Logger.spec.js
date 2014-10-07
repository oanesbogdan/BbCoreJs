define(['require', 'tb.core'], function (require) {
    'use strict';

    var api = require('tb.core');

    describe('Logger spec', function () {
        it('Logs actions', function () {

            api.logger.emergency('Test a emergency log.');
            expect(api.get('logs').length).toBe(1);

            api.logger.info('Test a info log.');
            expect(api.get('logs').length).toBe(1);
        });

        it('Change logs level', function () {

            api.logger.updateLogLevel(6);
            api.logger.notice('Test a notice log with updated log level.');
            expect(api.get('logs').length).toBe(2);

            api.logger.restaureLogLevel();
            api.logger.warning('Test a warning log with reset log level.');
            expect(api.get('logs').length).toBe(2);

            api.logger.updateLogLevel();
            api.logger.debug('Test is a debug log with unvailable updated log level.');
            expect(api.get('logs').length).toBe(2);
        });

        it('Try custom log level', function () {

            api.logger.log(2, 'Test a custom log level 2.');
            expect(api.get('logs').length).toBe(3);

            api.logger.log('information', 'Test a custom log level 9.');
            expect(api.get('logs').length).toBe(3);
        });

        it('Try all miscellious log levels', function () {
            spyOn(console, 'error');
            spyOn(console, 'warn');
            //spyOn(console, 'log');
            spyOn(console, 'info');
            spyOn(console, 'debug');

            api.logger.updateLogLevel(9, 'spec');

            api.logger.emergency('Test is a alert log.');
            expect(console.error).toHaveBeenCalled();

            api.logger.alert('Test is a alert log.');
            expect(console.error).toHaveBeenCalled();

            api.logger.critical('Test is a alert log.');
            expect(console.error).toHaveBeenCalled();

            api.logger.error('Test is a alert log.');
            expect(console.error).toHaveBeenCalled();

            api.logger.warning('Test is a alert log.');
            expect(console.warn).toHaveBeenCalled();

            api.logger.notice('Test is a alert log.');
           // expect(console.log).toHaveBeenCalled();

            api.logger.info('Test is a alert log.');
            expect(console.info).toHaveBeenCalled();

            api.logger.debug('Test is a alert log.');
            expect(console.debug).toHaveBeenCalled();

            api.logger.log('spec', 'Test is a alert log.');
            expect(console.debug).toHaveBeenCalled();

        });
    });
});