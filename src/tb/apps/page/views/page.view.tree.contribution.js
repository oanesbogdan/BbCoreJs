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
        'tb.core.ApplicationManager',
        'page.view.tree',
        'component!contextmenu',
        'page.repository',
        'jquery'
    ],
    function (ApplicationManager, TreeView, ContextMenu, PageRepository, jQuery) {

        'use strict';

        /**
         * View of page tree contribution With move node, contextmenu.
         * @type {Object} Backbone.View
         */
        var PageViewTreeContribution = Backbone.View.extend({

            /**
             * Initialize of PageViewTreeContribution
             */
            initialize: function (config) {
                this.view = new TreeView(config);
                this.treeView = this.view.treeView;

                this.bindEvents();
            },

            /**
             * Bind events to tree
             */
            bindEvents: function () {
                this.contextMenu = new ContextMenu(this.buildContextMenuConfig());
                this.currentEvent = null;

                this.treeView.on('contextmenu', jQuery.proxy(this.onRightClick, this));
                this.treeView.on('tree.dblclick', this.onDoubleClick);
                this.treeView.on('tree.move', jQuery.proxy(this.onMove, this));
            },

            /**
             * Event trigged on right click in node tree
             * @param {Object} event
             */
            onRightClick: function (event) {
                if (event.node.is_fake === true) {
                    return;
                }

                this.currentEvent = event;
                this.contextMenu.enable();
                this.contextMenu.show(event.click_event);
            },

            /**
             * Event trigged on double click in node tree
             * @param {Object} event
             */
            onDoubleClick: function (event) {
                if (event.node.is_fake === true) {
                    return;
                }

                jQuery(location).attr('href', event.node.url);
            },

            /**
             * Event trigged on drag n drop node tree
             * @param {Object} event
             */
            onMove: function (event) {
                if (event.node.is_fake === true) {
                    return;
                }

                this.doMoveNode(event, true);
            },

            /**
             * Build config for context menu
             * @returns {Object}
             */
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
                                    return;
                                }
                            },
                            {
                                btnCls: "bb5-context-menu-cut",
                                btnLabel: "Cut",
                                btnCallback: function () {
                                    return;
                                }
                            },
                            {
                                btnCls: "bb5-context-menu-flyto",
                                btnLabel: "Browse to",
                                btnCallback: function () {
                                    jQuery(location).attr('href', self.currentEvent.node.url);
                                }
                            }
                        ]
                    };

                return config;
            },

            /**
             * Do move node using tree.move and update data
             * @param {Object} event
             * @param {Boolean} doMove
             */
            doMoveNode: function (event, doMove) {
                if (doMove) {
                    event.move_info.do_move();
                }

                var moveInfo = event.move_info,
                    page_uid = moveInfo.moved_node.id,
                    parent_uid = moveInfo.moved_node.parent.id,
                    next_uid = null;

                if (moveInfo.moved_node.getPreviousSibling() !== null) {
                    next_uid = moveInfo.moved_node.getPreviousSibling().id;
                }

                PageRepository.moveNode(page_uid, parent_uid, next_uid);
            },

            /**
             * Render the template into the DOM with the ViewManager
             * @returns {Object} PageViewClone
             */
            render: function () {
                this.view.render();

                return this;
            }
        });

        return PageViewTreeContribution;
    }
);