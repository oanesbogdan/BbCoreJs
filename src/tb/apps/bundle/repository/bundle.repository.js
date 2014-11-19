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

            DEFAULT_DRIVER_KEY: 'rest',

            /**
             * Initialize of Bundle repository
             */
            initialize: function () {
                CoreRestDriver.setBaseUrl('/rest/1/');
                CoreDriverHandler.addDriver(this.DEFAULT_DRIVER_KEY, CoreRestDriver);
            },

            /**
             * List bundles
             * @param {Function} callback
             */
            list: function () {
                return CoreDriverHandler.read(this.TYPE, criterias, orderBy, start, limit);
            },

            /**
             * Set the activation of bundle
             * @param {Boolean} active
             * @param {String} bundleId
             */
            active: function (active, bundleId) {
                return CoreDriverHandler.patch(this.TYPE, {'enable': active}, {'id': bundleId});
            }
        });

    return new JS.Singleton(BundleRepository);
});
