define(['tb.core.Api', 'tb.core.AuthenticationHandler', 'tb.core.Request', 'tb.core.Response', 'jquery'], function (Api, AuthenticationHandler, Request, Response, jQuery) {
    'use strict';

    var request = new Request(),
        apiKey = '12345jtf6',
        apiSignature = '548zeeaT',
        fakeXhr = {
            responseText: '',
            status: '',
            getAllResponseHeaders: function () {
                return '';
            }
        };

    sessionStorage.clear();

    describe('Authentication handler test', function () {

        it('Testing onBeforeSend event', function () {
            AuthenticationHandler.onBeforeSend(request);
            expect(request.getHeader('X-API-KEY')).toBe(null);
            expect(request.getHeader('X-API-SIGNATURE')).toBe(null);

            sessionStorage.setItem('bb5-session-auth', apiKey + ';' + apiSignature);

            AuthenticationHandler.onBeforeSend(request);
            expect(request.getHeader('X-API-KEY')).toEqual(apiKey);
            expect(request.getHeader('X-API-SIGNATURE')).toEqual(apiSignature);
        });

        it('Testing authentication function', function () {
            var username = 'foo',
                password = 'bar',
                callback = jasmine.createSpy(),
                data = {
                    username: username,
                    password: password
                };

            spyOn(jQuery, 'ajax').and.callFake(function () {
                var d = jQuery.Deferred();

                d.resolve(data, '', fakeXhr);
                expect(data).toEqual(data);

                callback();

                return d.promise();
            });

            AuthenticationHandler.authenticate(username, password);
            expect(callback).toHaveBeenCalled();
        });

        it('Testing onRequestDone event', function () {
            var response = new Response();

            response.addHeader('X-API-KEY', apiKey);
            response.addHeader('X-API-SIGNATURE', apiSignature);

            sessionStorage.clear();

            AuthenticationHandler.onRequestDone(response);
            expect(sessionStorage.getItem('bb5-session-auth')).toEqual(apiKey + ';' + apiSignature);
        });

        it('Testing onRequestFail event', function () {
            var response = new Response();

            response.setStatus(401);
            AuthenticationHandler.onRequestFail(response);
            expect(Api.get('is_connected')).toEqual(false);

            response.setStatus(403);
            AuthenticationHandler.onRequestFail(response);
        });

        it('Testing logOut function', function () {
            sessionStorage.setItem('bb5-session-auth', apiKey + ';' + apiSignature);

            window.onbeforeunload = function () {
                return false;
            };

            AuthenticationHandler.logOut();
            expect(sessionStorage.getItem('bb5-session-auth')).toEqual(null);
        });

        it('Testing onLogOut event', function () {
            sessionStorage.setItem('bb5-session-auth', apiKey + ';' + apiSignature);

            window.onbeforeunload = function () {
                return false;
            };

            AuthenticationHandler.onLogOut();
            expect(sessionStorage.getItem('bb5-session-auth')).toEqual(null);
        });
    });
});
