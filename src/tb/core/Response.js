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
define('tb.core.Response', ['jsclass'], function () {
    'use strict';

    /**
     * Response object
     */
    var Response = new JS.Class({

        /**
         * Initialize of Response
         */
        initialize: function () {
            /**
            * Headers of Response
            * @type {Object}
            */
            this.headers = {};

            /**
            * Mixed data value of Response
            * @type {Mixed}
            */
            this.datas = '';

            /**
            * Raw datas of Response
            * @type {String}
            */
            this.rawDatas = '';

            /**
            * Status code of Response
            * @type {Number}
            */
            this.status = 200;

            /**
            * Status text of Response
            * @type {String}
            */
            this.statusText = '';

            /**
            * Error text of Response
            * @type {String}
            */
            this.errorText = '';
        },

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
         * will return datas raw
         * @returns {Mixed}
         */
        getDatas: function () {
            if ('' === this.datas) {
                return this.rawDatas;
            }

            return this.datas;
        },

        /**
         * Return raw datas
         * @returns {String}
         */
        getRawDatas: function () {
            return this.rawDatas;
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
         * Set the raw datas
         * @param {String} rawDatas
         * @returns {Response}
         */
        setRawDatas: function (rawDatas) {
            this.rawDatas = rawDatas;

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