define('tb.core.RequestHandler', ['jquery', 'jsclass'], function (jQuery) {
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
       },

       send: function () {
           if (null !== this.Request) {
               jQuery.ajax({
                   url: this.Request.getUrl(),
                   type: this.Request.getMethod(),
                   data: this.Request.getData()
               }).done(function (data, textStatus, xhr) {
                   console.log(data, textStatus, xhr);
               }).fail(function (xhr, textStatus, errorThrown) {
                   console.log(xhr, textStatus, errorThrown);
               });
           }

           return this.Response;
       }
    });

    return RequestHandler;
});
