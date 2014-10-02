define('tb.core.RestDriver', ['tb.core.Request', 'tb.core.RequestHandler', 'URIjs/URI', 'jsclass'], function (Request, URI, RequestHandler) {
    'use strict';

    var RestDriver = new JS.Class({
            /**
             * The REST api base url (example: /rest/1/)
             * @type {String}
             */
            baseUrl: '', // retrieve it from core?

            /**
             * Request object used to build every REST request
             * @type {Object}
             */
            request: null,

            /**
             * RestDriver constructor, we initialize the Request object with a default content type
             */
            initialize: function () {
                this.request = new Request();
                this.request.setContentType('application/json');

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
            handle: function (action, type, datas) {
                var url = new URI(this.baseUrl),
                    range;

                url.segment(type);

                if ('read' === action) {
                    this.request.setMethod('GET');
                    this.computeCriterias(url, datas);
                } else if ('update' === action || 'patch' === action || 'link' === action || 'delete' === action) {
                    this.request.setMethod('update' === action ? 'put' : action);
                    this.computeCriterias(url, datas);

                    if (datas.hasOwnProperty('datas')) {
                        this.request.setDatas(datas.datas);
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

                return this.getResult(this.request);
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
             * Use RequestHandler to send request and return the response datas
             * @param  {Object} request [description]
             * @return {Object}         response we get from sent request
             */
            getResult: function (request) {
                var response = RequestHandler.send(request);

                return response.getDatas();
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
        handle: function (action, type, datas) {
            return rest.handle(action, type, datas);
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