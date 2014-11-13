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

define(['tb.core.DriverHandler', 'tb.core.RestDriver', 'URIjs/URI', 'jsclass'], function (CoreDriverHandler, CoreRestDriver , URI) {
    'use strict';

    var putMandatoriesAttribute = ['title', 'alttitle', 'url', 'target', 'state', 'redirect', 'layout_uid'],

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

            isPutMethod: function (data) {
                var key,
                    mandatory,
                    isValid = true;

                for (key in putMandatoriesAttribute) {
                    if (putMandatoriesAttribute.hasOwnProperty(key)) {
                        mandatory = putMandatoriesAttribute[key];
                        if (!data.hasOwnProperty(mandatory)) {
                            isValid = false;
                            break;
                        }
                    }
                }

                return isValid;
            },

            /**
             * Find the current page
             * @todo change this method for get the current page with a rest service
             * @param {Function} callback
             */
            findCurrentPage: function (callback) {
                CoreDriverHandler.read(this.TYPE, {}, {}, 0, 1, callback);
            },

            /**
             * Get the page by uid
             * @param {Function} callback
             */
            find: function (uid, callback) {
                CoreDriverHandler.read(this.TYPE, {'id': uid}, {}, 0, null, callback);
            },

            save: function (data, callback) {
                if (data.hasOwnProperty('uid')) {
                    if (this.isPutMethod(data)) {
                        CoreDriverHandler.update(this.TYPE, data, {'id': data.uid}, {}, 0, null, callback);
                    } else {
                        CoreDriverHandler.patch(this.TYPE, data, {'id': data.uid}, callback);
                    }
                } else {
                    CoreDriverHandler.create(this.TYPE, data, callback);
                }
            },

            delete: function (uid, callback) {
                CoreDriverHandler.delete(this.TYPE, {'id': uid}, {}, 0, null, callback);
            },

            clone: function (uid, data, callback) {
                var callbacks = {
                    beforeSend: function (request) {
                        var url = new URI(request.url);
                        url.segment(uid);
                        url.segment('clone');

                        request.url = url.normalize().toString();
                    },
                    onSend: callback
                };

                CoreDriverHandler.create(this.TYPE, data, callbacks);
            },

            findLayouts: function (callback) {
                this.findCurrentPage(function (data) {

                    if (data.hasOwnProperty(0)) {
                        data = data[0];
                    }
                    CoreDriverHandler.read('layout', {'site_uid': data.site_uid}, {}, 0, null, callback);
                });
            }
        });

    return new JS.Singleton(PageRepository);
});
