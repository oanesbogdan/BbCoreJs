/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBuilder5.
 *
 * BackBuilder5 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBuilder5 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.
 */
define(
    'tb.core.AuthenticationHandler',
    [
        'tb.core.Api',
        'tb.core.DriverHandler',
        'tb.core.RestDriver',
        'jquery',
        'jsclass'
    ],
    function (Api, DriverHandler, RestDriver, jQuery) {

        'use strict';

        /**
         * AuthenticationHandler object
         */
        var AuthenticationHandler = new JS.Class({

            /**
             * Initialize of AuthenticationHandler
             */
            initialize: function () {
                Api.Mediator.subscribe('request:send:before', jQuery.proxy(this.onBeforeSend, this));
                Api.Mediator.subscribe('request:send:done', jQuery.proxy(this.onRequestDone, this));
                Api.Mediator.subscribe('request:send:fail', jQuery.proxy(this.onRequestFail, this));

                this.popinManager = Api.component('popin');
                this.popin = this.popinManager.createPopIn();
                this.formBuilder = Api.component('formbuilder');
            },

            /**
             * This constant define a Key of API KEY
             * @type {String}
             */
            HEADER_API_KEY: 'X-API-KEY',

            /**
             * This constant define a Key of API SIGNATURE
             * @type {String}
             */
            HEADER_API_SIGNATURE: 'X-API-SIGNATURE',

            /**
             * Do the request to rest api with username and password to try authentication.
             * The return will be catch by onRequestDone event.
             * @param {String} username
             * @param {String} password
             */
            authenticate: function (username, password) {
                var self = this;

                this.removeToken();

                RestDriver.setBaseUrl('/rest/1/');
                DriverHandler.addDriver('rest', RestDriver);
                DriverHandler.create('security/authentication', {"username": username, "password": password}, function () {
                    self.popin.unmask();
                    self.popin.hide();
                });
            },

            /**
             * Remove connexion to the Session storage and reload the page.
             */
            logOut: function () {
                this.removeToken();
                document.location.reload();
            },

            /**
             * Remove the token from session storage
             */
            removeToken: function () {
                if (null !== sessionStorage.getItem('bb5-session-auth')) {
                    sessionStorage.removeItem('bb5-session-auth');
                }
            },

            /**
             * Event
             * He check in Session storage if an item with key 'bb5-session-auth' exist and
             * add the headers to the request if he found it.
             * @param {Object} Request
             */
            onBeforeSend: function (Request) {
                var authentication,
                    identifierPos,
                    apiKey,
                    apiSignature;

                authentication = sessionStorage.getItem('bb5-session-auth');
                if (null !== authentication) {
                    identifierPos = authentication.indexOf(';');
                    apiKey = authentication.substring(0, identifierPos).trim();
                    apiSignature = authentication.substring(identifierPos + 1).trim();
                    Request.addHeader(this.HEADER_API_KEY, apiKey);
                    Request.addHeader(this.HEADER_API_SIGNATURE, apiSignature);
                }
            },

            /**
             * Event
             * Update api's key and api's signature with the headers provided by response
             * into the Session storage
             * @param {Object} response
             */
            onRequestDone: function (response) {

                var apiKey = response.getHeader(this.HEADER_API_KEY),
                    apiSignature = response.getHeader(this.HEADER_API_SIGNATURE);

                if (null !== apiKey && null !== apiSignature) {

                    sessionStorage.setItem('bb5-session-auth', apiKey + ';' + apiSignature);

                    Api.Mediator.publish('onSuccessLogin');
                }
            },

            /**
             * Event
             * Check the status of response.
             * If the user is forbidden to acces,
             * an popin will be showed with an forbidden message.
             * If the user require an authentication, an popin will be showed with
             * a authentication form
             * @param {Object} response
             */
            onRequestFail: function (response) {

                if (response.getStatus() === 403) {
                    this.popin.setTitle('Connexion');
                    this.popin.setContent('Permission denied');
                    this.popin.display();

                } else if (response.getStatus() === 401) {

                    Api.set('is_connected', false);

                    this.showForm('Bad credentials');
                }

                return response;
            },

            /**
             * Event
             * Logout the user with logOut
             * @returns {undefined}
             */
            onLogOut: function () {
                this.logOut();
            },

            /**
             * Function called when the form is submit
             * @param {Object} data
             */
            onSubmitForm: function (data) {
                this.popin.mask();
                this.authenticate(data.username, data.password);
            },

            /**
             * Function called when the form is validate
             * @param {Object} form
             * @param {Object} data
             */
            onValidateForm: function (form, data) {
                if (!data.hasOwnProperty('username') || data.username.trim().length === 0) {
                    form.addError('username', 'Username is required');
                }

                if (!data.hasOwnProperty('password') || data.password.trim().length === 0) {
                    form.addError('password', 'Password is required.');
                }
            },

            /**
             * Display the form in a popin
             * @param {String} error
             */
            showForm: function (error) {
                var self = this,
                    configForm = {
                        elements: {
                            username: {
                                type: 'text',
                                label: 'Login'
                            },
                            password:  {
                                type: 'password',
                                label: 'Password'
                            }
                        },
                        form: {
                            submitLabel: 'Connexion',
                            error: error
                        },
                        onSubmit: jQuery.proxy(this.onSubmitForm, this),
                        onValidate: jQuery.proxy(this.onValidateForm, this)
                    };

                this.popin.setTitle('Connexion');
                this.formBuilder.renderForm(configForm).done(function (html) {
                    self.popin.setContent(html);
                    self.popin.display();
                }).fail(function (e) {
                    console.log(e);
                });
            }
        }),
            returnClass = new JS.Singleton(AuthenticationHandler);

        Api.register('authentication', returnClass);

        return returnClass;
    }
);
