define(['require', 'tb.core'], function (require) {
    'use strict';

    var api = require('tb.core'),

        argument = 'not realy',

        fake = {
            withoutThis: function () {
                throw 'Fake error';
            },

            withThis: function (something) {
                return this.withoutThis(something);
            }
        };

    describe('Mediator publish and subscribe spec', function () {
        it('Subscribe without context and publish', function () {
            api.Mediator.subscribe('a fake event', fake.withoutThis);
            spyOn(api.exception, 'silent');

            api.Mediator.publish('a fake event', argument);
            expect(api.exception.silent).toHaveBeenCalledWith('MediatorException', 12201, 'Mediator as catch an error on "' + 'a fake event' + '" topic with the following message: "' + 'Fake error' + '"');

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

        it('Persistent publish an post subscribe', function () {
            api.Mediator.persistentPublish('persistent fake event', argument);

            spyOn(fake, 'withoutThis');

            api.Mediator.subscribe('persistent fake event', fake.withoutThis, fake);

            expect(fake.withoutThis).toHaveBeenCalledWith(argument);

        });

        it('Remove persistent publish an post subscribe', function () {
            api.Mediator.removePublish('persistent fake event');

            spyOn(fake, 'withoutThis');

            api.Mediator.subscribe('persistent fake event', fake.withoutThis, fake);

            expect(fake.withoutThis).not.toHaveBeenCalledWith(argument);

        });
    });
});
