define('tb.core.Response', ['jsclass'], function () {
    'use strict';

    /**
     * Response object
     */
    var Response = new JS.Class({

        /**
         * Headers of Response
         * @type {Object}
         */
        headers: {},

        /**
         * Mixed data value of Response
         * @type {Mixed}
         */
        datas: '',

        /**
         * Row datas of Response
         * @type {String}
         */
        rowDatas: '',

        /**
         * Status code of Response
         * @type {Number}
         */
        status: 200,

        /**
         * Status text of Response
         * @type {String}
         */
        statusText: '',

        /**
         * Error text of Response
         * @type {String}
         */
        errorText: '',

        /**
         * return all headers of Response
         * @returns {Object}
         */
        getHeaders: function () {
            return this.headers;
        },

        /**
         * Return one header by key
         * @param {String} key
         * @returns {String|null}
         */
        getHeader: function (key) {
            return this.headers[key] || null;
        },

        /**
         * Return datas, if datas not set it 
         * will return datas row
         * @returns {Mixed}
         */
        getData: function () {
            if ('' === this.datas) {
                return this.row_datas;
            }

            return this.datas;
        },

        /**
         * Return row datas
         * @returns {String}
         */
        getRowDatas: function () {
            return this.rowDatas;
        },

        /**
         * Return status code
         * @returns {Number}
         */
        getStatus: function () {
            return this.status;
        },

        /**
         * Return status text
         * @returns {String}
         */
        getStatusText: function () {
            return this.statusText;
        },

        /**
         * Return error text
         * @returns {String}
         */
        getErrorText: function () {
            return this.errorText;
        },

        /**
         * Set all headers as object
         * @param {Object} headers
         * @returns Response
         */
        setHeaders: function (headers) {
            this.headers = headers;

            return this;
        },

        /**
         * Add one header by name and value
         * @param {String} name
         * @param {String} value
         * @returns {Response}
         */
        addHeader: function (name, value) {
            this.headers[name] = value;

            return this;
        },

        /**
         * Set the datas
         * @param {String} datas
         * @returns {Response}
         */
        setDatas: function (datas) {
            this.datas = datas;

            return this;
        },

        /**
         * Set the row datas
         * @param {String} rowDatas
         * @returns {Response}
         */
        setRowDatas: function (rowDatas) {
            this.rowDatas = rowDatas;

            return this;
        },

        /**
         * Set the status code
         * @param {Number} status
         * @returns {Response}
         */
        setStatus: function (status) {
            this.status = status;

            return this;
        },

        /**
         * Set the status text
         * @param {String} statusText
         * @returns {Response}
         */
        setStatusText: function (statusText) {
            this.statusText = statusText;

            return this;
        },

        /**
         * Set the error text
         * @param {String} errorText
         * @returns {Response}
         */
        setErrorText: function (errorText) {
            this.errorText = errorText;

            return this;
        }
    });

    return Response;
});
