define('tb.core.Request', ['jquery', 'jsclass'], function (jQuery) {
    'use strict';

    /**
     * Request object
     */
    var Request = new JS.Class({

        /**
         * Schema of request
         * @type {String}
         */
        scheme: 'http',

        /**
         * Domain of request
         * @type {String}
         */
        domain: '',

        /**
         * Uri of request
         * @type {String}
         */
        uri: '',

        /**
         * Base uri of request
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
        datas: null,

        /**
         * Headers of request
         * @type {Object}
         */
        headers: {
            'Content-Type': 'application/x-www-form-uriencoded'
        },

        /**
         * Set the scheme of request
         * @param {String} scheme
         * @returns {Object} Request
         */
        setScheme: function (scheme) {
            this.scheme = scheme;

            return this;
        },

        /**
         * Set the domain of request
         * @param {String} domain
         * @returns {Object} Request
         */
        setDomain: function (domain) {
            this.domain = domain;

            return this;
        },

        /**
         * Set the base url of request
         * @param {String} baseUrl
         * @returns {Object} Request
         */
        setBaseUrl: function (baseUrl) {
            this.baseUrl = baseUrl;

            return this;
        },

        /**
         * Set the uri of request
         * @param {String} uri
         * @returns {Object} Request
         */
        setUri: function (uri) {
            this.uri = uri;

            return this;
        },

        /**
         * Set the method of request
         * @param {String} method
         * @returns {Object} Request
         */
        setMethod: function (method) {
            this.method = method.toUpperCase();

            return this;
        },

        /**
         * Set one query param with name and value
         * @param {String} name
         * @param {String} value
         * @returns {Object} Request
         */
        setQueryParam: function (name, value) {
            this.queryParams[name] = value;

            return this;
        },

        /**
         * Set query params of request
         * @param {Object} queryParams
         * @returns {Object} Request
         */
        setQueryParams: function (queryParams) {
            this.queryParams = queryParams;

            return this;
        },

        /**
         * @param {Mixed} data
         * @returns {Object} Request
         */
        setDatas: function (datas) {
            this.datas = datas;

            return this;
        },

        /**
         * Set one header with name and value
         * @param {String} name
         * @param {String} value
         * @returns {Object} Request
         */
        addHeader: function (name, value) {
            this.headers[name] = value;

            return this;
        },

        /**
         * Set content type of request
         * @param {String} contentType
         * @returns {Object} Request
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
         * Get the scheme of request
         * @returns {String}
         */
        getScheme: function () {
            return this.scheme;
        },

        /**
         * Get the domain of request
         * @returns {String}
         */
        getDomain: function () {
            return this.domain;
        },

        /**
         * Get the uri of request
         * @returns {String}
         */
        getUri: function () {
            return this.uri;
        },

        /**
         * Get the base url of request
         * @returns {String}
         */
        getBaseUrl: function () {
            return this.baseUrl;
        },

        /**
         * GEt the method of request
         * @returns {String}
         */
        getMethod: function () {
            return this.method;
        },

        /**
         * Get the query param with key
         * @param {String} key
         * @returns {Object|null}
         */
        getQueryParam: function (key) {
            return this.queryParams[key] || null;
        },

        /**
         * Get the query params of request
         * @returns {Object}
         */
        getQueryParams: function () {
            return this.queryParams;
        },

        /**
         * Get the data of request
         * @returns {Mixed}
         */
        getDatas: function () {
            return this.datas;
        },

        /**
         * Get the headers of request
         * @returns {Object}
         */
        getHeaders: function () {
            return this.headers;
        },

        /**
         * Get the url with query params
         * @returns {String} url builded 
         */
        getUrl: function () {
            var url = '';
            if (false === jQuery.empty(this.domain)) {
                url = url + this.scheme + '://' +  this.domain;
            }
            url =  '/' + url + this.baseUrl + '/' + this.uri + '/';

            if (false === jQuery.isEmptyObject(this.queryParams)) {
                url = url + ((url.indexOf('?') === -1) ? '?' : '&') + jQuery.param(this.queryParams);
            }

            return url;
        }
    });

    return Request;
});
