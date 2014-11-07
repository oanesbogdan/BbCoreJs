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

define(['tb.core.Api', 'tb.core.DriverHandler', 'tb.core.RestDriver', 'jsclass'], function (Api, CoreDriverHandler, CoreRestDriver) {
    'use strict';

    //Build the default parameters
    var criterias = {},
        orderBy = {},
        start = 0,
        limit = null,

        PageMap = {
            id: 'uid',
            state: {
                key: 'state',
                value: 2
            }


        },

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
             * Get the page by uid
             * @param {Function} callback
             */
            find: function (uid, callback) {
                CoreDriverHandler.read(this.TYPE, {'id': uid}, orderBy, start, limit, callback);
            },

            save: function (data, callback) {
                if (data.hasOwnProperty('uid')) {
                    console.log(data);
                    CoreDriverHandler.patch(this.TYPE, data, {'id': data.uid});
                } else {
                    CoreDriverHandler.create(this.TYPE, data, callback);
                }
            },

            delete: function (uid, callback) {
                CoreDriverHandler.delete(this.TYPE, {'id': uid}, orderBy, start, limit, callback);
            },

            /**
             * Find the current page
             * @todo change this method for get the current page with a rest service
             * @param {Function} callback
             */
            findCurrentPage: function(callback) {
                CoreDriverHandler.read(this.TYPE, criterias, orderBy, 0, 1, callback);
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
