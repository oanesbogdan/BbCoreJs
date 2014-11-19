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

define(
    [
        'tb.core',
        'page.view.contribution.index',
        'page.view.delete',
        'page.view.new',
        'page.view.edit',
        'page.view.clone',
        'jquery'
    ],
    function (Core, ContributionIndexView, DeleteView, NewView, EditView, CloneView, jQuery) {

        'use strict';

        Core.ControllerManager.registerController('MainController', {

            appName: 'page',

            config: {
                imports: ['page.repository']
            },

            /**
             * Initialize of Page Controller
             */
            onInit: function () {
                this.mainApp =  Core.get('application.main');
                this.repository = require('page.repository');
            },

            /**
             * Index action
             * Show the index in the edit contribution toolbar
             */
            contributionIndexAction: function () {
                this.repository.findCurrentPage().done(function (data) {
                    if (data.hasOwnProperty(0)) {
                        data = data[0];
                    }

                    var view = new ContributionIndexView({'data': data});
                    view.render();
                });
            },

            /**
             * Delete action
             * Delete page with uid
             * @param {String} uid
             */
            deletePageService: function (page_uid) {
                try {
                    var view = new DeleteView(page_uid);
                    view.render();
                } catch (e) {
                    console.log(e);
                }
            },

            findCurrentPageService: function () {
                var dfd = jQuery.Deferred();
                this.repository.findCurrentPage().done(function (data) {
                    dfd.resolve(data);
                }).fail(function (e) {
                    dfd.reject(e);
                });

                return dfd.promise();
            },

            clonePageService: function (page_uid) {
                try {
                    var view = new CloneView(page_uid);
                    view.render();
                } catch (e) {
                    console.log(e);
                }
            },

            newPageService: function (parent) {

                try {
                    var view = new NewView(parent);
                    view.render();
                } catch (e) {
                    console.log(e);
                }
            },

            editPageService: function (page_uid) {
                try {
                    var view = new EditView(page_uid);
                    view.render();
                } catch (e) {
                    console.log(e);
                }
            }
        });
    }
);
