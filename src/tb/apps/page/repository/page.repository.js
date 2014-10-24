define(['tb.core.DriverHandler', 'tb.core.RestDriver', 'jsclass'], function (CoreDriverHandler, CoreRestDriver) {
    'use strict';

    //Build the default parameters
    var criterias = {},
        orderBy = {},
        start = 0,
        limit = null,

        /**
         * Page repository class
         * @type {Object} JS.Class
         */
        PageRepository = new JS.Class({

            TYPE: 'page',

            /**
             * Initialize of Page repository
             */
            initialize: function () {
                CoreRestDriver.setBaseUrl('/rest/1/');
                CoreDriverHandler.addDriver('rest', CoreRestDriver);
            },

            /**
             * Find the current page
             * @todo change this method for get the current page with a rest service
             * @param {Function} callback
             */
            findCurrentPage: function(callback) {
                CoreDriverHandler.read(this.TYPE, criterias, orderBy, 0, 1, callback);
            },

            /**
             * Get the page by uid
             * @param {Function} callback
             */
            find: function (uid, callback) {
                CoreDriverHandler.read(this.TYPE, {'id': uid}, orderBy, start, limit, callback);
            },

            create: function (data, callback) {
                CoreDriverHandler.create(this.TYPE, data, callback);
            },

            /**
             * Change the state of page
             * @param {String} uid
             * @param {Number} state
             */
            state: function (uid, state) {
                CoreDriverHandler.patch(this.TYPE, {'state': state}, {'id': uid});
            },

            delete: function (uid, callback) {
                CoreDriverHandler.delete(this.TYPE, {'id': uid}, orderBy, start, limit, callback);
            },

            findLayouts: function (callback) {
                this.findCurrentPage(function (data) {
                    if (data.hasOwnProperty(0)) {
                        data = data[0];
                    }

                    CoreDriverHandler.read('layout', {'site_uid': data.site_uid}, orderBy, start, limit, callback);
                });
            }
        });

    return new JS.Singleton(PageRepository);
});
