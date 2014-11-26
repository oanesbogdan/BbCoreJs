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
        'tb.core.Api',
        'jquery',
        'page.repository',
        'component!treeview'
    ],
    function (Api, jQuery, PageRepository, Tree) {

    'use strict';

    /**
     * View of new page
     * @type {Object} Backbone.View
     */
    var PageViewClone = Backbone.View.extend({

        /**
         * Initialize of PageViewClone
         */
        initialize: function (site_uid) {
            if (typeof site_uid !== 'string') {
                Api.exception('MissingPropertyException', 500, 'Property "site_uid" must be set to constructor');
            }

            this.site_uid = site_uid;

            this.initializeTree();
        },

        initializeTree: function () {
            var self = this,
                config = {};

            this.formatedData = [];
            config.open = function () {
                this.getTreeView().setData(self.formatedData);
            };
            this.tree = Tree.createPopinTreeView(config);

            this.bindTreeEvents();
        },

        bindTreeEvents: function () {
            this.tree.treeView.on('contextmenu', function (event) {
               console.log(event.node);
            });
        },

        formateData: function (data) {
            var list = [],
                key,
                page,
                root;

            if (Array.isArray(data)) {
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        page = data[key];
                        if (page.url === "/") {
                            root = jQuery.merge({}, page);
                            root.label = page.title;
                            root.children = [];
                            root.id = page.uid;
                        } else {
                            page.id = page.uid;
                            page.label = page.title;
                            page.children = [];
                            root.children.push(page);
                        }
                    }
                }

                list.push(root);
            }

            return list;
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} PageViewClone
         */
        render: function () {
            var self = this,
                config = {
            };

            PageRepository.findPageWithChildren().done(function (data) {
                self.formatedData = self.formateData(data);
                self.tree.display();
            });

            return this;
        }
    });

    return PageViewClone;
});