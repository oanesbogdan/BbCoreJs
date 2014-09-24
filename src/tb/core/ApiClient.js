define("tb.core.ApiClient", ["jquery","tb.core.Core", "jsclass", "tb.core.ApiRequestBuilder"], function($, bbCore,jsClass, requestBuilder){

    /**
     * BB Api Client
     **/
    var ApiClient = new jsClass.Class({
        version: 1,
        resourceManager: {},
        // global config
        config: {
            ajax_timeout: 30000,
            ajax_cache: false,
            resource_default_limit: 100
        },
        auth: {
            authenticated : false
        },

        initialize: function(version, config) {
            if(typeof config !== "undefined") {
                this.version = version;
            }

            if(typeof config !== "undefined") {
                $.extend(this.config, config);
            }

            $.ajaxSetup(this.config);
        },

        send: function (request) {
            request.context = this;

            return $.ajax(request);
        },

        createRequestBuilder: function(name) {
            var rb = new requestBuilder(name, this);

            return rb;
        },

        connect: function(username, password) {
            var dateFormat = 'YYYY-MM-DD HH:mm:ss';

            this.auth.username = username;
            this.auth.password = password;
            this.auth.created = new Date();
            this.auth.nonce = "1234567890";

            var digest = SparkMD5.hash(this.auth.nonce + moment(this.auth.created).format(dateFormat) + SparkMD5.hash(this.auth.password));

            // TODO
            var rb = this.createRequestBuilder();
            rb
                .setUrl('/rest/1/security/auth/bb_area')
                .setData({
                    "created" : moment(this.auth.created).format(dateFormat),
                    "digest" : digest,
                    "username" : this.auth.username,
                    "nonce" : this.auth.nonce
                })
            ;

            this.send(rb.getRequest()).done(this.connectSuccessHandler).done(this.connectErrorHandler);
        },

        connectSuccessHandler: function(data) {
            this.auth.authenticated = true;
            var me = this;
            $.trigger( "bb.api_authenticated", {auth: me.auth} );
        },

        connectErrorHandler: function(data) {
            this.auth.authenticated = false;
            var me = this;
            $.trigger( "bb.api_authentication_error", {auth: me.auth} );
        },


        encodeRequest: function(request) {
            // TODO
        },

        /**
         * Construct request object
         *
         * @param String url
         * @param String method
         * @param PlainObject queryParams
         * @param PlainObject data
         * @param PlainObject headers
         * @returns PlainObject
         */
        createRequest: function(url, method, queryParams, data, headers) {
            var request = {"type" : method};

            if (typeof queryParams !== "undefined"  && "" !== queryParams.trim()) {
                url += ((url.indexOf('?') == -1) ? '?' : '&') + $.param(queryParams);
            }

            request["url"] = url;

            if (typeof data !== "undefined") {
                request["data"] = data;
            }

            if (typeof headers !== "undefined") {
                request["headers"] = headers;
            }

            return request;
        },

        /**
         * Get resource by its name
         *
         * @param string name
         * @returns bb.ApiResource
         */
        getResource: function(name) {
            if(this.resourceManager[name]) {
                var resource = new ApiResource(name, this);

                this.resourceManager[name] = resource;
            }

            return this.resourceManager[name];
        }

    });

    bbCore.register("apiClient", ApiClient);

    return ApiClient;
});