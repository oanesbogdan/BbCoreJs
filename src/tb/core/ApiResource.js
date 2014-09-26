define("tb.core.ApiResource", ["tb.core.Api", "jsclass"], function (Api) {

    /**
     * ApiResource object
     */
    var ApiResource = new JS.Class({

        /**
         * Client of ApiResource
         * @type {Object}
         */
        client: {},

        /**
         * Headers of ApiResource
         * @type {Object}
         */
        headers: {},

        /**
         * Base url of ApiResource
         * @type {String}
         */
        baserUrl: '',

        /**
         * ApiResource initialization
         * @param {String} baserUrl
         * @param {Object} client
         */
        initialize: function (baserUrl, client) {
            this.baserUrl = baserUrl;
            this.client = client;
        },

        /**
         * Post resource
         * @param {type} data
         * @returns {Object} ApiRequest
         */
        post: function (data) {
            var requestBuilder = this.client.createRequestBuilder();
            requestBuilder.setMethod('POST')
                          .setData(data)
                          .setContentType('application/json')
                          .setUrl(this.baserUrl);

            return requestBuilder.getRequest();
        },

        /**
         * Put resource
         * @param {String} id
         * @param {Mixed} data
         * @returns {Object} ApiRequest
         */
        put: function (id, data) {
            var requestBuilder = this.client.createRequestBuilder();
            requestBuilder.setMethod('PUT')
                          .setData(data)
                          .setContentType('application/json')
                          .setUrl(this.baserUrl + '/' + id);

            return requestBuilder.getRequest();
        },

        /**
         * Patch resource
         * @param {String} id
         * @param {Mixed} data
         * @returns {Object} ApiRequest
         */
        patch: function (id, data) {
            var requestBuilder = this.client.createRequestBuilder();
            requestBuilder.setMethod('PATCH')
                          .setData(data)
                          .setContentType('application/json')
                          .setUrl(this.baserUrl + '/' + id);

            return requestBuilder.getRequest();
        },

        /**
         * Delete resource
         * @param {String} id
         * @returns {Object} ApiRequest
         */
        delete: function (id) {
            var requestBuilder = this.client.createRequestBuilder();
            requestBuilder.setMethod('DELETE')
                          .setUrl(this.baserUrl + '/' + id);

            return requestBuilder.getRequest();
        },

        /**
         * Link resource
         * @param {String} id
         * @param {Mixed} data
         * @returns {Object} ApiRequest
         */
        link: function (id, data) {
            var requestBuilder = this.client.createRequestBuilder();
            requestBuilder.setMethod('LINK')
                          .setUrl(this.baserUrl + '/' + id)
                          .setData(data)
                          .setContentType('application/json');

            return requestBuilder.getRequest();
        },

        /**
         * Get resource
         * @param {String} id
         * @returns {Object} ApiRequest
         */
        get: function (id) {
            var requestBuilder = this.client.createRequestBuilder();
            requestBuilder.setMethod('GET')
                          .setUrl(this.baserUrl + '/' + id);

            return requestBuilder.getRequest();
        },

        /**
         * Get collection of resource
         * @param {String} filters
         * @param {Number} start
         * @param {Number} limit
         * @returns {Object} ApiRequest
         */
        getCollection: function (filters, start, limit) {
            var requestBuilder = this.client.createRequestBuilder();
            requestBuilder.setMethod('GET')
                          .setUrl(this.baserUrl)
                          .setQueryParams(filters);

            if (start === undefined) {
                start = 0;
            }

            if (limit === undefined) {
                limit = this.client.config.resource_default_limit;
            }

            requestBuilder.setPagination(start, limit);

            return requestBuilder.getRequest();
        }

    });

    Api.register("ApiResource", ApiResource);

    return ApiResource;
});
