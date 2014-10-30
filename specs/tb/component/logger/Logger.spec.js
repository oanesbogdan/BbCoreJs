define(['require', 'tb.core'], function (require) {
    'use strict';

    var api = require('tb.core');

    describe('Logger spec', function () {
        it('Logs actions', function () {

            api.component('logger').emergency('Test a emergency log.');
            expect(api.get('logs').length).toBe(1);

            api.component('logger').info('Test a info log.');
            expect(api.get('logs').length).toBe(1);
        });

        it('Change logs level', function () {

            api.component('logger').updateLogLevel(6);
            api.component('logger').notice('Test a notice log with updated log level.');
            expect(api.get('logs').length).toBe(2);

            api.component('logger').restaureLogLevel();
            api.component('logger').warning('Test a warning log with reset log level.');
            expect(api.get('logs').length).toBe(2);

            api.component('logger').updateLogLevel();
            api.component('logger').debug('Test is a debug log with unvailable updated log level.');
            expect(api.get('logs').length).toBe(2);
        });

        it('Try custom log level', function () {

            api.component('logger').log(2, 'Test a custom log level 2.');
            expect(api.get('logs').length).toBe(3);

            api.component('logger').log('information', 'Test a custom log level 9.');
            expect(api.get('logs').length).toBe(3);
        });

        it('Try all miscellious log levels', function () {
            spyOn(console, 'error');
            spyOn(console, 'warn');
            spyOn(console, 'log');
            spyOn(console, 'info');
            spyOn(console, 'debug');

            api.component('logger').updateLogLevel(9, 'spec');

            api.component('logger').emergency('Test is a alert log.');
            expect(console.error).toHaveBeenCalled();

            api.component('logger').alert('Test is a alert log.');
            expect(console.error).toHaveBeenCalled();

            api.component('logger').critical('Test is a alert log.');
            expect(console.error).toHaveBeenCalled();

            api.component('logger').error('Test is a alert log.');
            expect(console.error).toHaveBeenCalled();

            api.component('logger').warning('Test is a alert log.');
            expect(console.warn).toHaveBeenCalled();

            api.component('logger').notice('Test is a alert log.');
           // expect(console.log).toHaveBeenCalled();

            api.component('logger').info('Test is a alert log.');
            expect(console.info).toHaveBeenCalled();

            api.component('logger').debug('Test is a alert log.');
            expect(console.debug).toHaveBeenCalled();

            api.component('logger').log('spec', 'Test is a alert log.');
            expect(console.debug).toHaveBeenCalled();

        });
    });
});