define(['tb.core.DriverHandler', 'tb.core.RestDriver', 'jsclass'], function (CoreDriverHandler, CoreRestDriver) {
    'use strict';

    //Build the default parameters
    var criterias = {},
        orderBy = {},
        start = 0,
        limit = null,

        /**
         * Bundle repository class
         * @type {Object} JS.Class
         */
        BundleRepository = new JS.Class({

            TYPE: 'bundle',

            /**
             * Initialize of Bundle repository
             */
            initialize: function () {
                CoreRestDriver.setBaseUrl('/rest/1/');
                CoreDriverHandler.addDriver('rest', CoreRestDriver);
            },

            /**
             * List bundles
             * @param {Function} callback
             */
            list: function (callback) {
                CoreDriverHandler.read(this.TYPE, criterias, orderBy, start, limit, callback);
            },

            /**
             * Set the activation of bundle
             * @param {Boolean} active
             * @param {String} bundleId
             */
            active: function (active, bundleId) {
                CoreDriverHandler.patch(this.TYPE, {'enable': active}, {'id': bundleId});
            }
        });

    return new JS.Singleton(BundleRepository);
});
