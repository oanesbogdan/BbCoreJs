define('tb.core.RequestHandler', ['jquery', 'underscore', 'BackBone', 'tb.core.Response', 'jsclass'], function (jQuery, Underscore, Backbone, TbResponse) {
    'use strict';

    /**
     * RequestHandler object
     */
    var RequestHandler = new JS.Class({
        /**
         * Initialize of RequestHandler
         */
        initialize: function () {
            Underscore.extend(this, Backbone.Events);
        },
        /**
         * Send the request to the server and build
         * a Response object
         * @returns Response
         */
        send: function (request, callback, context) {
            var self = this;
            context = context || this;

            if (null !== request) {

                self.trigger('request:send:before', request);

                jQuery.ajax({
                    url: request.getUrl(),
                    type: request.getMethod(),
                    data: request.getDatas(),
                    headers: request.getHeaders()
                }).done(function (data, textStatus, xhr) {
                    var response = self.buildResponse(
                            xhr.getAllResponseHeaders(),
                            data,
                            xhr.responseText,
                            xhr.status,
                            textStatus,
                            ''
                        );

                    self.trigger('request:send:done', response);

                    if (callback !== undefined) {
                        callback.call(context || this, response.getDatas(), response);
                    }
                }).fail(function (xhr, textStatus, errorThrown) {
                    var response = self.buildResponse(
                            xhr.getAllResponseHeaders(),
                            '',
                            xhr.responseText,
                            xhr.status,
                            textStatus,
                            errorThrown
                        );

                    self.trigger('request:send:fail', response);

                    if (callback !== undefined) {
                        callback.call(context || this, response.getDatas(), response);
                    }
                });
            }
        },
        /**
         * Build the Response Object
         * @param {String} headers
         * @param {String} datas
         * @param {String} rawDatas
         * @param {Number} status
         * @param {String} statusText
         * @param {String} errorText
         */
        buildResponse: function (headers, datas, rawDatas, status, statusText, errorText) {
            var Response = new TbResponse();

            this.buildHeaders(Response, headers);

            Response.setDatas(datas);
            Response.setRawDatas(rawDatas);
            Response.setStatus(status);
            Response.setStatusText(statusText);
            Response.setErrorText(errorText);

            return Response;
        },
        /**
         * Build String headers, split \r to have all key/value
         * and split each with ":" for have a key and value
         * and use addHeader function to set each header
         * @param {Object} Response
         * @param {String} headers
         */
        buildHeaders: function (Response, headers) {
            var headersSplit,
                header,
                name,
                value,
                key,
                identifierPos;

            headersSplit = headers.split('\r');
            for (key in headersSplit) {
                if (headersSplit.hasOwnProperty(key)) {
                    header = headersSplit[key];
                    identifierPos = header.indexOf(':');
                    if (-1 !== identifierPos) {
                        name = header.substring(0, identifierPos).trim();
                        value = header.substring(identifierPos + 1).trim();
                        Response.addHeader(name, value);
                    }
                }
            }
        }
    });

    return new JS.Singleton(RequestHandler);
});
