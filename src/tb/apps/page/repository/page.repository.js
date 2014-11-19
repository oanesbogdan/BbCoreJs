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

define(['tb.core.DriverHandler', 'tb.core.RestDriver', 'tb.core', 'jquery', 'URIjs/URI', 'jsclass'], function (CoreDriverHandler, CoreRestDriver, Core, jQuery, URI) {
    'use strict';

    var putMandatoriesAttribute = ['title', 'alttitle', 'url', 'target', 'state', 'redirect', 'layout_uid'],

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
            findCurrentPage: function () {
                var dfd =  jQuery.Deferred();

                CoreDriverHandler.read(this.TYPE, {}, {}, 0, 1).done(function (data) {
                    if (data.hasOwnProperty(0)) {
                        data = data[0];
                    }

                    dfd.resolve(data);
                }).fail(function (e) {
                    dfd.reject(e);
                });

                return dfd.promise();
            },

            /**
             * Get the page by uid
             * @param {Function} callback
             */
            find: function (uid) {
                return CoreDriverHandler.read(this.TYPE, {'id': uid}, {}, 0, null);
            },

            save: function (data) {
                var result;

                if (data.hasOwnProperty('uid')) {
                    if (this.isPutMethod(data)) {
                        result = CoreDriverHandler.update(this.TYPE, data, {'id': data.uid}, {}, 0, null);
                    } else {
                        result = CoreDriverHandler.patch(this.TYPE, data, {'id': data.uid});
                    }
                } else {
                    result = CoreDriverHandler.create(this.TYPE, data);
                }

                return result;
            },

            delete: function (uid) {
                return CoreDriverHandler.delete(this.TYPE, {'id': uid}, {}, 0, null);
            },

            clone: function (uid, data) {
                Core.Mediator.subscribe('rest:send:before', function (request) {
                    var url = new URI(request.url);

                    url.segment(uid);
                    url.segment('clone');

                    request.url = url.normalize().toString();
                });

                return CoreDriverHandler.create(this.TYPE, data);
            },

            findLayouts: function (site_uid) {
                return CoreDriverHandler.read('layout', {'site_uid': site_uid}, {}, 0, null);
            }
        });

    return new JS.Singleton(PageRepository);
});
