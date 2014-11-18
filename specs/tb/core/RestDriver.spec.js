
define(['tb.core.RestDriver', 'jquery'], function (Rest, jQuery) {
    'use strict';

    var baseUrl = '127.0.0.1:8080/rest/1/',
        type = 'page',
        uid = '123456789',
        callback = function () { return; },
        fakeXhr = {
            responseText: '',
            status: '',
            getAllResponseHeaders: function () {
                return '';
            }
        },
        datas = {
            title: 'Test RestDriver'
        };

    describe('RestDriver spec', function () {

        beforeEach(function () {
            Rest.setBaseUrl(baseUrl);
        });

        it('Get page\'s collection', function () {
            spyOn(jQuery, 'ajax').and.callFake(function (req) {
                var d = jQuery.Deferred();
                expect(req.url).toEqual(baseUrl + type + '?parent_uid=abcdef1234567890');
                expect(req.type).toEqual('GET');
                expect(req.data).toEqual(null);
                expect(req.headers).toEqual({'Content-Type': 'application/json', 'Range': '5,10'});
                d.resolve('', '', fakeXhr);

                return d.promise();
            });

            Rest.handle('read', 'page', {
                criterias: {
                    parent_uid: 'abcdef1234567890'
                },
                start: 5,
                limit: 10
            }, callback);
        });

        it('Get page by uid', function () {
            spyOn(jQuery, 'ajax').and.callFake(function (req) {
                var d = jQuery.Deferred();
                expect(req.url).toEqual(baseUrl + type + '/' + uid);
                expect(req.type).toEqual('GET');
                expect(req.data).toEqual(null);
                expect(req.headers).toEqual({'Content-Type': 'application/json'});
                d.resolve('', '', fakeXhr);

                return d.promise();
            });

            Rest.handle('read', 'page', {criterias: {uid: uid}}, callback);
        });

        it('Create a page', function () {
            spyOn(jQuery, 'ajax').and.callFake(function (req) {
                var d = jQuery.Deferred();
                expect(req.url).toEqual(baseUrl + type);
                expect(req.type).toEqual('POST');
                expect(req.data).toEqual(JSON.stringify(datas));
                expect(req.headers).toEqual({'Content-Type': 'application/json'});
                d.resolve('', '', fakeXhr);

                return d.promise();
            });

            Rest.handle('create', 'page', {datas: datas}, callback);
        });

        it('Update a page', function () {
            spyOn(jQuery, 'ajax').and.callFake(function (req) {
                var d = jQuery.Deferred();
                expect(req.url).toEqual(baseUrl + type + '/' + uid + '?parent_uid=abcdef1234567890');
                expect(req.type).toEqual('PUT');
                expect(req.data).toEqual(JSON.stringify(datas));
                expect(req.headers).toEqual({'Content-Type': 'application/json'});
                d.resolve('', '', fakeXhr);

                return d.promise();
            });

            Rest.handle('update', 'page', {
                datas: datas,
                criterias: {
                    uid: uid,
                    parent_uid: 'abcdef1234567890'
                }
            }, callback);
        });

        it('Delete a page', function () {
            spyOn(jQuery, 'ajax').and.callFake(function (req) {
                var d = jQuery.Deferred();
                expect(req.url).toEqual(baseUrl + type + '?parent_uid=abcdef1234567890');
                expect(req.type).toEqual('DELETE');
                expect(req.data).toEqual(null);
                expect(req.headers).toEqual({'Content-Type': 'application/json', 'Range': '0,10'});
                d.resolve('', '', fakeXhr);

                return d.promise();
            });

            Rest.handle('delete', 'page', {
                criterias: {
                    parent_uid: 'abcdef1234567890'
                },
                limit: 10
            }, callback);
        });

        it('Patch a page', function () {
            spyOn(jQuery, 'ajax').and.callFake(function (req) {
                var d = jQuery.Deferred();
                expect(req.url).toEqual(baseUrl + type + '/' + uid);
                expect(req.type).toEqual('PATCH');
                expect(req.data).toEqual(JSON.stringify([
                    {
                        op: 'replace',
                        path: '/title',
                        value: 'Test RestDriver'

                    }
                ]));
                expect(req.headers).toEqual({'Content-Type': 'application/json'});
                d.resolve('', '', fakeXhr);

                return d.promise();
            });

            Rest.handle('patch', 'page', {
                datas: datas,
                criterias: {
                    uid: uid
                }
            }, callback);
        });

        it('Link a page', function () {
            spyOn(jQuery, 'ajax').and.callFake(function (req) {
                var d = jQuery.Deferred();
                expect(req.url).toEqual(baseUrl + type + '/' + uid);
                expect(req.type).toEqual('LINK');
                expect(req.data).toEqual(JSON.stringify({'next_node': 'abcdef1234567890'}));
                expect(req.headers).toEqual({'Content-Type': 'application/json'});
                d.resolve('', '', fakeXhr);

                return d.promise();
            });

            Rest.handle('link', 'page', {
                datas: {
                    'next_node': 'abcdef1234567890'
                },
                criterias: {
                    uid: uid
                }
            }, callback);
        });
    });
});
