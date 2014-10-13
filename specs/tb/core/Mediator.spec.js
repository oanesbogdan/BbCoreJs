define(['require', 'tb.core'], function (require) {
    'use strict';

    var api = require('tb.core'),

        argument = 'not realy',

        fake = {
            withoutThis: function (something) {
                throw 'Fake error';
            },

            withThis: function (something) {
                return this.withoutThis(something);
            },

            withThrow: function () {
                throw 'Fake error';
            }
        };

    describe('Mediator publish and subscribe spec', function () {
        it('Subscribe without context and publish', function () {
            api.Mediator.subscribe('a fake event', fake.withoutThis);
            spyOn(api.logger, 'error');

            api.Mediator.publish('a fake event', argument);
            expect(api.logger.error).toHaveBeenCalledWith('Mediator as catch an error on "' + 'a fake event' + '" topic with the following message: "' + 'Fake error' + '"');

            api.Mediator.unsubscribe('a fake event', fake.withoutThis);
        });

        it('Subscribe with context them publish and unsubscribe', function () {
            api.Mediator.subscribe('another fake event', fake.withThis, fake);
            spyOn(fake, 'withoutThis');

            api.Mediator.publish('another fake event', argument);
            expect(fake.withoutThis).toHaveBeenCalledWith(argument);

            spyOn(console, 'info');
            api.Mediator.unsubscribe('another fake event', fake.withThis);

            api.Mediator.publish('another fake event', argument);
            expect(console.info).not.toHaveBeenCalled();
        });

        it ('Percistant publish an post subscribe', function () {
            api.Mediator.percistantPublish('percistant fake event', argument);

            spyOn(fake, 'withoutThis');

            api.Mediator.subscribe('percistant fake event', fake.withoutThis, fake);

            expect(fake.withoutThis).toHaveBeenCalledWith(argument);

        });

        it ('Remove percistant publish an post subscribe', function () {
            api.Mediator.removePublish('percistant fake event');

            spyOn(fake, 'withoutThis');

            api.Mediator.subscribe('percistant fake event', fake.withoutThis, fake);

            expect(fake.withoutThis).not.toHaveBeenCalledWith(argument);

        });
    });
});
