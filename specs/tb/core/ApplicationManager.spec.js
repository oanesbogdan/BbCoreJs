define(['require', 'tb.core'], function (require) {
    'use strict';

    var api = require('tb.core'),

        application = {
            getName: function () {
                return false;
            },

            onInit: function () {
                return 'Initialisation';
            },

            onStart: function () {
                return 'Stating';
            },

            onResume: function () {
                return 'Resuming';
            },

            onStop: function () {
                return 'Stoping';
            },

            onError: function () {
                return 'Fail';
            }
        };

    describe('Application manager spec', function () {
        it('Follow new Application life cycle.', function () {
            spyOn(application, 'onInit');
            spyOn(application, 'onStart');
            spyOn(application, 'onResume');
            spyOn(application, 'onStop');
            spyOn(application, 'onError');

            api.ApplicationManager.registerApplication('spec', application);

            //expect(application.onInit).toHaveBeenCalled();
        });

        it('Test register a new Application fail.', function () {
            try {
                api.ApplicationManager.registerApplication({});
                expect(false).toBe(true);
            } catch (err) {
                expect(err).toBe('ApplicationManager : appname have to be a string');
            }

            try {
                api.ApplicationManager.registerApplication('test');
                expect(false).toBe(true);
            } catch (err) {
                expect(err).toBe('ApplicationManager : appDef Is undefined');
            }

            try {
                api.ApplicationManager.registerApplication('test', {});
                api.ApplicationManager.registerApplication('test', {});
                expect(false).toBe(true);
            } catch (err) {
                expect(err).toBe('AppAlreadyExists');
            }
        });
    });
});