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
        'tb.core.ApplicationManager',
        'jquery',
        'page.repository',
        'component!treeview',
        'component!contextmenu'
    ],
    function (Api, ApplicationManager, jQuery, PageRepository, Tree, ContextMenu) {

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
                config = {
                    dragAndDrop: true
                };

            this.formatedData = [];
            config.open = function () {
                this.getTreeView().setData(self.formatedData);
            };
            this.tree = Tree.createPopinTreeView(config);

            this.bindTreeEvents();
        },

        contextMenuConfig: {

        },

        buildContextMenuConfig: function () {
            var self = this,
                config = {
                    domTag: '#bb5-ui',
                    menuActions : [
                        {
                            btnCls: "bb5-context-menu-add",
                            btnLabel: "Create",
                            btnCallback: function () {
                                ApplicationManager.invokeService('page.main.newPage', self.currentEvent.node.id);
                            }
                        },

                        {
                            btnCls: "bb5-context-menu-edit",
                            btnLabel: "Edit",
                            btnCallback: function () {
                                ApplicationManager.invokeService('page.main.editPage', self.currentEvent.node.id);
                            }
                        },
                        {
                            btnCls: "bb5-context-menu-remove",
                            btnLabel: "Remove",
                            btnCallback: function () {
                                ApplicationManager.invokeService('page.main.deletePage', self.currentEvent.node.id);
                            }
                        },
                        {
                            btnCls: "bb5-context-menu-copy",
                            btnLabel: "Copy",
                            btnCallback: function () {
                            }
                        },
                        {
                            btnCls: "bb5-context-menu-cut",
                            btnLabel: "Cut",
                            btnCallback: function () {
                            }
                        },
                        {
                            btnCls: "bb5-context-menu-flyto",
                            btnLabel: "Browse to",
                            btnCallback: function () {
                            }
                        }
                    ]
                };

            return config;
        },

        bindTreeEvents: function () {
            var self = this,
                contextMenu = new ContextMenu(this.buildContextMenuConfig());

            this.currentEvent = null;
            this.tree.treeView.on('contextmenu', function (event) {
                self.currentEvent = event;
                contextMenu.enable();
                contextMenu.show(event.click_event);
            });

            this.tree.treeView.on('tree.move', function (event) {

                event.move_info.do_move();

                var moveInfo = event.move_info,
                    page_uid = moveInfo.moved_node.id,
                    parent_uid = moveInfo.moved_node.parent.id,
                    next_uid = null;

                if (moveInfo.position !== 'inside') {
                    next_uid = moveInfo.target_node.id;
                }

                PageRepository.moveNode(page_uid, parent_uid, next_uid);
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