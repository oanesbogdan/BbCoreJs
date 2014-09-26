define('tb.core.ApiClient', ['jquery','tb.core.Api', 'jsclass', 'tb.core.ApiRequestBuilder'], function($, Api, jsClass, ApiRequestBuilder){

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
        initialize: function(version, config) {
            if (typeof config !== 'undefined') {
                this.version = version;
            }

            if (typeof config !== 'undefined') {
                $.extend(this.config, config);
            }

            $.ajaxSetup(this.config);
        },

        /**
         * Send ajax request
         * @param {Object} request
         * @returns {jqXHR}
         */
        send: function (request) {
            request.context = this;

            return $.ajax(request);
        },

        /**
         * Create a new ApiRequestBuilder
         * @param {String} name
         * @returns {object} ApiRequestBuilder
         */
        createRequestBuilder: function(name) {
            var apiRequestBuilder = new ApiRequestBuilder(name, this);

            return apiRequestBuilder;
        },
        
        /**
         * Connect user to backbee's admin
         * @param {String} username
         * @param {String} password
         */
        connect: function(username, password) {
            var dateFormat = 'YYYY-MM-DD HH:mm:ss';

            this.auth.username = username;
            this.auth.password = password;
            this.auth.created = new Date();
            this.auth.nonce = '1234567890';

            var digest = SparkMD5.hash(this.auth.nonce + moment(this.auth.created).format(dateFormat) + SparkMD5.hash(this.auth.password));

            /**
             * @TODO
             */
            var rb = this.createRequestBuilder();
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
        connectSuccessHandler: function() {
            this.auth.authenticated = true;
            
            var me = this;
            
            $.trigger('bb.api_authenticated', {auth: me.auth});
        },

        /**
         * Handle connection error
         */
        connectErrorHandler: function() {
            this.auth.authenticated = false;
            
            var me = this;
            
            $.trigger('bb.api_authentication_error', {auth: me.auth});
        },

        /**
         * Encode request 
         * @param {Object} request
         * @returns {undefined}
         */
        encodeRequest: function(request) {
            /**
             * @TODO
            */
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
        createRequest: function(url, method, queryParams, data, headers) {
            var request = {'type' : method};

            if (typeof queryParams !== 'undefined'  && '' !== queryParams.trim()) {
                url += ((url.indexOf('?') == -1) ? '?' : '&') + $.param(queryParams);
            }

            request['url'] = url;

            if (typeof data !== 'undefined') {
                request['data'] = data;
            }

            if (typeof headers !== 'undefined') {
                request['headers'] = headers;
            }

            return request;
        },

        /**
         * Get resource by its name
         * @param {String} name
         * @returns {ApiResource}
         */
        getResource: function(name) {
            if (this.resourceManager[name]) {
                var resource = new ApiResource(name, this);

                this.resourceManager[name] = resource;
            }

            return this.resourceManager[name];
        }

    });

    Api.register('apiClient', ApiClient);

    return ApiClient;
});