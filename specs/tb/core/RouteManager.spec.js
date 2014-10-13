define(['tb.core', 'tb.core.RouteManager', 'BackBone'], function (Core, Router, BackBone) {
    'use strict';

    describe('RouteManager spec', function () {

        it('Call initRouter will start BackBone history component with config', function () {
            Router.initRouter();
            expect(BackBone.history.options).toEqual({
                root: '/'
            });

            BackBone.history.stop();
            Router.initRouter({silent: true});
            expect(BackBone.history.options).toEqual({
                root: '/',
                silent: true
            });
        });

        it('Register route without giving route config will throw an exception', function () {
            try {
                Router.registerRoute('app', {});
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toEqual('A routes key must be provided');
            }
        });

        it('Register route with a non-object route config will throw an exception', function () {
            try {
                Router.registerRoute('app', {routes: ''});
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toEqual('Routes must be an object');
            }
        });

        it('Register route which is not an object will throw an exception', function () {
            try {
                Router.registerRoute('app', {
                    routes: {
                        'test': '/test'
                    }
                });
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toEqual('test route infos must be an object');
            }
        });

        it('Register route which has no `url` property will throw an exception', function () {
            try {
                Router.registerRoute('app', {
                    routes: {
                        'test': {}
                    }
                });
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toEqual('test route infos must have `url` property');
            }
        });

        it('Register route which has no action `property` will throw an exception', function () {
            try {
                Router.registerRoute('app', {
                    routes: {
                        'test': {
                            'url': '/test'
                        }
                    }
                });
                expect(true).toBe(false);
            } catch (e) {
                expect(e).toEqual('test route infos must have `action` property');
            }
        });
    });
});
