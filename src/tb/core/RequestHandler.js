define('tb.core.RequestHandler', ['jquery', 'tb.core.Response', 'jsclass'], function (jQuery, Response) {
    'use strict';

    /**
     * RequestHandler object
     */
    var RequestHandler = new JS.Class({

        /**
         * Request object
         * @type {Object}
         */
        Request: null,

        /**
         * Response object
         * @type {Object}
         */
        Response: null,

        /**
         * Initialize of RequestHandler
         * @param {Object} Request
         */
        initialize: function (Request) {
            this.Request = Request;
            this.Response = new Response();
        },

        /**
         * Send the request to the server and build
         * a Response object
         * @returns Response
         */
        send: function () {
            var self = this;

            if (null !== this.Request) {
                jQuery.ajax({
                    url: this.Request.getUrl(),
                    type: this.Request.getMethod(),
                    data: this.Request.getDatas()
                }).done(function (data, textStatus, xhr) {
                    self.buildResponse(xhr.getAllResponseHeaders(),
                            data,
                            xhr.responseText,
                            xhr.status,
                            textStatus,
                            '');
                }).fail(function (xhr, textStatus, errorThrown) {
                    self.buildResponse(xhr.getAllResponseHeaders(),
                            '',
                            xhr.responseText,
                            xhr.status,
                            textStatus,
                            errorThrown);
                });
            }

            return this.Response;
        },

        /**
         * Build the Response Object
         * @param {String} headers
         * @param {String} datas
         * @param {String} rowDatas
         * @param {Number} status
         * @param {String} statusText
         * @param {String} errorText
         */
        buildResponse: function (headers, datas, rowDatas, status, statusText, errorText) {
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
                        this.Response.addHeader(name, value);
                    }
                }
            }

            this.Response.setDatas(datas);
            this.Response.setRowDatas(rowDatas);
            this.Response.setStatus(status);
            this.Response.setStatusText(statusText);
            this.Response.setErrorText(errorText);
        }
    });

    return RequestHandler;
});
