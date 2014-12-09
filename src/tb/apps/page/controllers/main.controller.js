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
        'page.view.manage',
        'page.view.tree.contribution'
    ],
    function (Core,
              ContributionIndexView,
              DeleteView,
              NewView,
              EditView,
              CloneView,
              ManageView,
              PageTreeViewContribution
            ) {

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
             * Show tree with pages
             */
            treeAction: function () {
                var config = {
                    do_loading: true,
                    do_pagination: true
                };

                this.repository.findCurrentPage().done(function (data) {
                    if (data.hasOwnProperty(0)) {
                        data = data[0];
                    }

                    config.site_uid = data.site_uid;

                    var view = new PageTreeViewContribution(config);
                    view.render();
                });
            },

            /**
             * Delete action
             * Delete page with uid
             * @param {String} uid
             */
            deletePageService: function (config) {
                try {
                    var view = new DeleteView(config);
                    view.render();
                } catch (e) {
                    console.log(e);
                }
            },

            findCurrentPageService: function () {
                return this.repository.findCurrentPage();
            },

            clonePageService: function (config) {
                try {
                    var view = new CloneView(config);
                    view.render();
                } catch (e) {
                    console.log(e);
                }
            },

            newPageService: function (config) {

                try {
                    var view = new NewView(config);
                    view.render();
                } catch (e) {
                    console.log(e);
                }
            },

            editPageService: function (config) {
                try {
                    var view = new EditView(config);
                    view.render();
                } catch (e) {
                    console.log(e);
                }
            },

            /**
             * Manage pages action
             */
            manageAction: function () {
                try {
                    var view = new ManageView();
                    view.render();
                } catch (e) {
                    console.log(e);
                }
            }
        });
    }
);
