define('tb.core.ApiRequestBuilder', ['jquery', 'tb.core.Api' 'jsclass'], function (jQuery, Api) {

    /**
     * ApiRequestBuilder object
     */
    var ApiRequestBuilder = new JS.Class({

        /**
         * Url of request
         * @type {String}
         */
        url: '',

        /**
         * Base url of request
         * @type {String}
         */
        baseUrl: '',

        /**
         * Method of request
         * @type {String}
         */
        method: 'GET',

        /**
         * Query params of request
         * @type {Object}
         */
        queryParams: {},

        /**
         * Data of request
         * @type {Mixed}
         */
        data: null,

        /**
         * Headers of request
         * @type {Object}
         */
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },

        /**
         * Configuration
         * @type {Object}
         */
        config: {},

        /**
         * ApiRequestBuilder initialization
         * @param {String} baserUrl
         */
        initialize: function (baseUrl){
            this.baseUrl = baseUrl;
        },

        /**
         * Set the url of request
         * @param {String} url
         * @returns {Object} ApiRequestBuilder
         */
        setUrl: function (url) {
            this.url = url;

            return this;
        },

        /**
         * Set the method of request
         * @param {String} method
         * @returns {Object} ApiRequestBuilder
         */
        setMethod: function (method) {
            this.method = method;

            return this;
        },

        /**
         * Set one query param with name and value
         * @param {String} name
         * @param {String} value
         * @returns {Object} ApiRequestBuilder
         */
        setQueryParam: function (name, value) {
            this.queryParams.name = value;

            return this;
        },

        /**
         * Set query params of request
         * @param {Object} queryParams
         * @returns {Object} ApiRequestBuilder
         */
        setQueryParams: function (queryParams) {
            this.queryParams = queryParams;

            return this;
        },

        /**
         * Set the pagination on the header of request
         * @param {Number} start
         * @param {Number} limit
         */
        setPagination: function (start, limit) {
            this.setHeader('Range', start + ',' + limit);
        },

        /**
         * @param {Mixed} data
         * @returns {Object} ApiRequestBuilder
         */
        setData: function (data) {
            this.data = data;

            return this;
        },

        /**
         * Set one header with name and value
         * @param {String} name
         * @param {String} value
         * @returns {Object} ApiRequestBuilder
         */
        setHeader: function (name, value) {
            this.headers.name = value;

            return this;
        },

        /**
         * Set content type of request
         * @param {String} contentType
         * @returns {Object} ApiRequestBuilder
         */
        setContentType: function (contentType) {
            this.setHeader('Content-Type', contentType);
            return this;
        },

        /**
         * Get the content type of request
         * @returns {String}
         */
        getContentType: function () {
            return this.headers['Content-Type'];
        },

        /**
         * Get the request object
         * @returns {Object} Request
         */
        getRequest: function () {
            var self = this,

                /**
                 * Request object
                 * @type {Object}
                 */
                request = {},

                /**
                 * Used for query string
                 * @type {String}
                 */
                url = this.url;

            // set the header to xhr object
            request.beforeSend = function (xhr) {
                for (header in self.headers) {
                    xhr.setRequestHeader(header, self.headers[header]);
                }
            };

            if ('application/x-www-form-urlencoded' !== this.getContentType()) {
                request.processData = false;
            }

            // Set the data to request
            request.data = this.data;
            if ('application/json' === this.getContentType()) {
                // encode json data
                if ('string' !== typeof request.data) {
                    /**
                     * @TODO: Affiliate to data seems not work
                     */
                    data = JSON.stringify(request.data);
                }
            }

            if (false === jQuery.isEmptyObject(this.queryParams)) {
                url += ((url.indexOf('?') == -1) ? '?' : '&') + jQuery.param(this.queryParams);
            }

            return request;
        },

        /**
         * POST method of request
         * @param {String} url
         * @param {Mixed} data
         * @param {String} contentType
         * @returns {Object} ApiRequestBuilder
         */
        post: function (url, data, contentType) {
            this.setUrl(url)
                .setData(data)
                .setContentType(contentType)
                .setMethod('POST');

            return this;
        },

        /**
         * GET method of request
         * @param {String} url
         * @param {Object} queryParams
         * @returns {Object} ApiRequestBuilder
         */
        get: function (url, queryParams) {
            this.setUrl(url)
                .setQueryParams(queryParams)
                .setMethod('GET');

            return this;
        },

        /**
         * PUT method of request
         * @param {String} url
         * @param {Mixed} data
         * @param {String} contentType
         * @returns {Object} ApiRequestBuilder
         */
        put: function (url, data, contentType) {
            this.setUrl(url)
                .setData(data)
                .setContentType(contentType)
                .setMethod('PUT');

            return this;
        },

        /**
         * PATCH method of request
         * @param {String} url
         * @param {Mixed} data
         * @param {String} contentType
         * @returns {Object} ApiRequestBuilder
         */
        patch: function (url, data, contentType) {
            this.setUrl(url)
                .setData(data)
                .setContentType(contentType)
                .setMethod('PATCH');

            return this;
        },

        /**
         * DELETE method of request
         * @param {String} url
         * @returns {Object} ApiRequestBuilder
         */
        delete: function (url) {
            this.setUrl(url)
                .setMethod('DELETE');

            return this;
        },

        /**
         * DELETE method with link of request
         * @param {String} url
         * @param {Mixed} data
         * @param {String} contentType
         * @returns {Object} ApiRequestBuilder
         */
        link: function (url, data, contentType) {
            this.setUrl(url)
                .setMethod('DELETE')
                .setData(data)
                .setContentType(contentType);

            return this;
        }
    });

    Api.register('ApiRequestBuilder', ApiRequestBuilder);

    return ApiRequestBuilder;
});
