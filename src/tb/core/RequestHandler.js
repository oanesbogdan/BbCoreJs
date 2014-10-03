define('tb.core.RequestHandler', ['jquery', 'tb.core.Response', 'jsclass'], function (jQuery, Response) {
    'use strict';

    /**
     * RequestHandler object
     */
    var RequestHandler = new JS.Class({

        /**
         * Send the request to the server and build
         * a Response object
         * @returns Response
         */
        send: function (request, callback) {
            var self = this;

            if (null !== request) {
                jQuery.ajax({
                    url: request.getUrl(),
                    type: request.getMethod(),
                    data: request.getDatas()
                }).done(function (data, textStatus, xhr) {
                    var response = self.buildResponse(
                            xhr.getAllResponseHeaders(),
                            data,
                            xhr.responseText,
                            xhr.status,
                            textStatus,
                            ''
                        );

                    callback(response.getDatas());
                }).fail(function (xhr, textStatus, errorThrown) {
                    var response = self.buildResponse(
                            xhr.getAllResponseHeaders(),
                            '',
                            xhr.responseText,
                            xhr.status,
                            textStatus,
                            errorThrown
                        );

                    callback(response.getDatas());
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
            var headersSplit,
                header,
                name,
                value,
                key,
                identifierPos,
                response = new Response();

            headersSplit = headers.split('\r');
            for (key in headersSplit) {
                if (headersSplit.hasOwnProperty(key)) {
                    header = headersSplit[key];
                    identifierPos = header.indexOf(':');
                    if (-1 !== identifierPos) {
                        name = header.substring(0, identifierPos).trim();
                        value = header.substring(identifierPos + 1).trim();
                        response.addHeader(name, value);
                    }
                }
            }

            response.setDatas(datas);
            response.setRawDatas(rawDatas);
            response.setStatus(status);
            response.setStatusText(statusText);
            response.setErrorText(errorText);

            return response;
        }
    });

    return new JS.Singleton(RequestHandler);
});
