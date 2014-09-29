
define('tb.core.ApiClient', ['jquery', 'tb.core.Api', 'jsclass', 'tb.core.ApiRequestBuilder', 'tb.core.ApiResource', 'moment'], function (jQuery, Api, jsClass, ApiRequestBuilder, ApiResource, moment) {
    'use strict';

    /**
     * ApiClient Object
     **/
    var ApiClient = new jsClass.Class({

        /**
         * Version of api
         * @type {String}
         */
        version: '0.1.0',

        /**
         * ResourceManager Object
         * @type {Object}
         */
        resourceManager: {},

        /**
         * Configuration object
         * @type {Object}
         */
        config: {
            ajax_timeout: 30000,
            ajax_cache: false,
            resource_default_limit: 100
        },

        /**
         * Authentication object
         * @type {object}
         */
        auth: {
            authenticated : false
        },

        /**
         * ApiClient initialization
         * @param {String} version
         * @param {object} config
         */
        initialize: function (version, config) {
            if (config !== undefined) {
                this.version = version;
            }

            if (config !== undefined) {
                jQuery.extend(this.config, config);
            }

            jQuery.ajaxSetup(this.config);
        },

        /**
         * Send ajax request
         * @param {Object} request
         * @returns {jqXHR}
         */
        send: function (request) {
            request.context = this;

            return jQuery.ajax(request);
        },

        /**
         * Create a new ApiRequestBuilder
         * @param {String} name
         * @returns {object} ApiRequestBuilder
         */
        createRequestBuilder: function (name) {
            var apiRequestBuilder = new ApiRequestBuilder(name, this);

            return apiRequestBuilder;
        },

        /**
         * Create a new Digest with dateFormat
         *
         * @param  {[type]} dateFormat
         * @return {[type]}
         */
        generateDigest: function (dateFormat) {
            // SparkMD5.hash(this.auth.nonce + moment(this.auth.created).format(dateFormat) + SparkMD5.hash(this.auth.password))
            return 'digest' + dateFormat;
        },

        /**
         * @TODO complete the create request builder
         *
         * Connect user to backbee's admin
         * @param {String} username
         * @param {String} password
         */
        connect: function (username, password) {
            var dateFormat = 'YYYY-MM-DD HH:mm:ss',
                digest = '',
                rb = {};

            this.auth.username = username;
            this.auth.password = password;
            this.auth.created = new Date();
            this.auth.nonce = '1234567890';

            digest = this.generateDigest(dateFormat);
            rb = this.createRequestBuilder();

            rb.setUrl('/rest/1/security/auth/bb_area')
                .setData({
                    'created': moment(this.auth.created).format(dateFormat),
                    'digest': digest,
                    'username': this.auth.username,
                    'nonce': this.auth.nonce
                });

            this.send(rb.getRequest()).done(this.connectSuccessHandler).done(this.connectErrorHandler);
        },

        /**
         * Handle connection success
         */
        connectSuccessHandler: function () {
            this.auth.authenticated = true;

            var me = this;

            jQuery.trigger('bb.api_authenticated', {auth: me.auth});
        },

        /**
         * Handle connection error
         */
        connectErrorHandler: function () {
            this.auth.authenticated = false;

            var me = this;

            jQuery.trigger('bb.api_authentication_error', {auth: me.auth});
        },

        /**
         * @TODO
         *
         * Encode request
         * @param {Object} request
         * @returns {undefined}
         */
        encodeRequest: function (request) {
            return JSON.stringify(request);
        },

        /**
         * Constructor request object
         * @param {String} url
         * @param {String} method
         * @param {Object} queryParams
         * @param {Object} data
         * @param {Object} headers
         * @returns {Object} Request
         */
        createRequest: function (url, method, queryParams, data, headers) {
            var request = {'type' : method};

            if (queryParams !== undefined  && '' !== queryParams.trim()) {
                url = url + ((url.indexOf('?') === -1) ? '?' : '&') + jQuery.param(queryParams);
            }

            request.url = url;

            if (data !== undefined) {
                request.data = data;
            }

            if (headers !== undefined) {
                request.headers = headers;
            }

            return request;
        },

        /**
         * Get resource by its name
         * @param {String} name
         * @returns {ApiResource}
         */
        getResource: function (name) {
            if (this.resourceManager.name) {
                var resource = new ApiResource(name, this);

                this.resourceManager.name = resource;
            }

            return this.resourceManager.name;
        }
    });

    Api.register('apiClient', ApiClient);

    return ApiClient;
});
