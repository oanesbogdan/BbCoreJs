define(['require', 'tb.core', 'tb.core.Api', 'tb.core.Logger'], function (require) {
    'use strict';

    var logger = require('tb.core.Logger'),
        api = require('tb.core.Api');

    describe('Exceptions spec', function () {
        it('Logs actions', function () {
            logger.emergency('This is an emergency.');
            expect(api.get('logs')).toBeDefined();

            if (api.get('logs')) {           
                expect(api.get('logs').length).toBe(1);

                logger.info('This is an info.');
                expect(api.get('logs').length).toBe(1);
            }
        });
    });
});