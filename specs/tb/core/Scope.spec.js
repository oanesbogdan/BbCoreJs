define(['require', 'tb.core'], function () {
    'use strict';

    var api = require('tb.core'),

        mock = {
            specCallbackOpening: function () {
                return;
            },

            specCallbackClosing: function () {
                return;
            },

            testCallbackOpening: function () {
                return;
            },

            testCallbackClosing: function () {
                return;
            },

            slugCallbackOpening: function () {
                throw 'Spec test error';
            },

            slugCallbackClosing: function () {
                return;
            }
        };

    describe('Scope spec', function () {
        it('test scope registring', function () {
            spyOn(mock, 'specCallbackOpening');
            api.Scope.subscribe('spec', mock.specCallbackOpening, mock.specCallbackClosing);
            api.Scope.register('spec', 'test');
            expect(mock.specCallbackOpening).toHaveBeenCalled();
        });

        it('test scope closing', function () {
            spyOn(mock, 'testCallbackOpening');
            spyOn(mock, 'testCallbackClosing');

            api.Scope.subscribe('test', mock.testCallbackOpening, mock.testCallbackClosing);
            expect(mock.testCallbackOpening).toHaveBeenCalled();

            api.Scope.register('spec', 'slug');
            expect(mock.testCallbackClosing).toHaveBeenCalled();
        });
    });
});