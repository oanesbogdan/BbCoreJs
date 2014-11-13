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
define('tb.core.RestDriver', ['tb.core.Request', 'tb.core.RequestHandler', 'URIjs/URI', 'jsclass'], function (Request, RequestHandler, URI) {
    'use strict';

    var RestDriver = new JS.Class({
            /**
             * RestDriver constructor, we initialize the Request object with a default content type
             */
            initialize: function () {
                /**
                 * The REST api base url (example: /rest/1/)
                 * @type {String}
                 */
                this.baseUrl = ''; // retrieve it from core?

                /**
                 * Request object used to build every REST request
                 * @type {Object}
                 */
                this.request = null;

                // Lack of authentification process to add to request header
            },

            /**
             * BaseUrl property setter
             * @param {String} baseUrl the driver new base url
             */
            setBaseUrl: function (baseUrl) {
                this.baseUrl = baseUrl;
            },

            /**
             * Handle every user request and decide what kind of HTTP request to build depending on action and return
             * the response provided by server
             * @param  {String} action the action to execute ('read', 'create', 'delete', 'update', 'patch', 'link')
             * @param  {String} type   your entity namespace
             * @param  {Object} datas  datas contains request limit, start, criterias and datas
             * @return {Object}        the response data provided by performing your request
             */
            handle: function (action, type, datas, callback) {
                var url = new URI(this.baseUrl),
                    range;

                this.request = new Request();
                this.request.headers = {};
                this.request.setContentType('application/json');

                url.segment(type);

                if ('read' === action) {
                    this.request.setMethod('GET');
                    this.computeCriterias(url, datas);
                } else if ('update' === action || 'patch' === action || 'link' === action || 'delete' === action) {
                    this.request.setMethod('update' === action ? 'put' : action);
                    this.computeCriterias(url, datas);

                    if (datas.hasOwnProperty('datas')) {
                        if ('patch' === action) {
                            this.request.setDatas(this.computePatchOperations(datas.datas));
                        } else {
                            this.request.setDatas(datas.datas);
                        }
                    }
                } else if ('create' === action) {
                    this.request.setMethod('POST');
                    this.computeCriterias(url, datas);

                    if (datas.hasOwnProperty('datas')) {
                        this.request.setDatas(datas.datas);
                    }
                }

                if (datas.hasOwnProperty('limit') && null !== datas.limit) {
                    range = (datas.hasOwnProperty('start') ? datas.start : '0') + ',' + datas.limit;
                    this.request.addHeader('Range',  range);
                }

                this.request.setUrl(url.normalize().toString());

                if (null !== this.request.getDatas()) {
                    this.request.setDatas(JSON.stringify(this.request.getDatas()));
                }

                RequestHandler.send(this.request, callback);
            },

            /**
             * Checks if datas has criterias and add them to url
             * @param  {Object} url   object which must be type of URI which represent the request url
             * @param  {Object} datas
             * @return {Object}       self
             */
            computeCriterias: function (url, datas) {
                var criterias = datas.hasOwnProperty('criterias') ? datas.criterias : null,
                    criteria;

                if (null === criterias) {
                    return this;
                }

                for (criteria in criterias) {
                    if (criterias.hasOwnProperty(criteria)) {
                        if ('uid' === criteria || 'id' === criteria) {
                            url.segment(criterias[criteria]);
                        } else {
                            url.addSearch(criteria, criterias[criteria]);
                        }
                    }
                }

                return this;
            },

            /**
             * Format request datas to match with path operations standard (RFC 6902: http://tools.ietf.org/html/rfc6902)
             * @param  {Object} datas patch raw datas
             * @return {Object}       formatted patch datas
             */
            computePatchOperations: function (datas) {
                var operations = [],
                    key;

                for (key in datas) {
                    if (datas.hasOwnProperty(key)) {
                        operations.push({
                            op: 'replace',
                            path: '/' + key,
                            value: datas[key]
                        });
                    }
                }

                return operations;
            }
        }),
        rest = new RestDriver();

    return {
        /**
         * Handle every user request and decide what kind of HTTP request to build depending on action and return
         * the response provided by server
         * @param  {String} action the action to execute ('read', 'create', 'delete', 'update', 'patch', 'link')
         * @param  {String} type   your entity namespace
         * @param  {Object} datas  datas contains request limit, start, criterias and datas
         * @return {Object}        the response data provided by performing your request
         */
        handle: function (action, type, datas, callback) {
            rest.handle(action, type, datas, callback);
        },

        /**
         * BaseUrl property setter
         * @param {String} baseUrl the new base url
         */
        setBaseUrl: function (baseUrl) {
            rest.setBaseUrl(baseUrl);

            return this;
        }
    };
});