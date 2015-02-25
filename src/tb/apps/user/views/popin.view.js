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
    ['require', 'jquery', 'tb.core', 'component!dnd', 'component!popin', 'text!user/templates/popin.twig'],
    function (require, jQuery, Core, dnd) {
        'use strict';

        /**
         * View of new page
         * @type {Object} Backbone.View
         */
        return Backbone.View.extend({

            popin_config: {
                id: 'user-popin-picker',
                height: window.innerHeight - 200,
                width: window.innerWidth - 100,
                top: 180
            },

            /**
             * Initialize of PageViewEdit
             */
            initialize: function () {
                this.popinManager = require('component!popin');
                this.popin = this.popinManager.createPopIn(this.popin_config);
                this.popin.setContent(require('text!user/templates/popin.twig'));
                this.popin.display();
                dnd('#toolbar-user-group-popin').addListeners('user');
                this.bindDnd();
            },

            bindDnd: function () {
                var data = {
                    inDropZone: false,
                    popin: this,
                    user: 0,
                    group: 0
                };

                Core.Mediator.subscribe('on:user:dragstart', function (event) {
                    var target = jQuery(event.target);

                    if (target.hasClass('open')) {
                        target.removeClass('open');
                    }

                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text', 'user-add-user');

                    this.user =  target.attr('data-user');
                    this.inDropZone = false;
                }, data);
                Core.Mediator.subscribe('on:user:dragenter', function (event) {
                    if (undefined !== event &&
                            event.target.getAttribute('dropzone')) {

                        this.inDropZone = true;
                        this.group = event.target.getAttribute('data-group');
                    }
                }, data);
                Core.Mediator.subscribe('on:user:dragleave', function (event) {

                    if (undefined !== event &&
                            event.target.getAttribute('dropzone') &&
                            !event.target.hasChildNodes(event.target.toElement)) {

                        this.inDropZone = false;
                        this.group = 0;
                    }
                }, data);
                Core.Mediator.subscribe('on:user:dragover', function (event) {
                    if (undefined !== event &&
                            true === this.inDropZone) {

                        event.preventDefault();
                    }
                }, data);
                Core.Mediator.subscribe('on:user:drop', function (event) {
                    if (undefined !== event) {
                        event.stopPropagation();
                        event.preventDefault();
                    }

                    if (0 !== this.group && 0 !== this.user && true === this.inDropZone) {
                        Core.ApplicationManager.invokeService(
                            'user.user.addGroup',
                            this.popin,
                            this.user,
                            this.group
                        );
                    }
                }, data);
                Core.Mediator.subscribe('on:user:dragend', function () {
                    this.user = 0;
                    this.group = 0;
                    this.inDropZone = false;
                }, data);
            },

            bindUsers: function () {
                var class_name = '.bb5-list-users-item',
                    self = this;
                jQuery(class_name).click(function () {
                    var parent_class = '.bb5-manage-user',
                        user = jQuery(this).find(parent_class),
                        open = 'open';
                    if (user.hasClass(open)) {
                        user.removeClass(open);
                    } else {
                        jQuery(class_name + ' ' + parent_class + '.' + open).removeClass(open);
                        user.addClass(open);
                    }
                });
                jQuery(class_name + ' .btn-edit').click(function () {
                    var user = jQuery(this).parent().attr('data-user');
                    Core.ApplicationManager.invokeService('user.user.edit', self, user);
                });
                jQuery(class_name + ' .btn-delete').click(function () {
                    var user = jQuery(this).parent().attr('data-user');
                    Core.ApplicationManager.invokeService('user.user.delete', self, user);
                });
            },

            bindGroups: function () {
                var self = this;
                jQuery('#toolbar-new-group-action').click(function () {
                    Core.ApplicationManager.invokeService('user.group.new', self);
                });
                jQuery('#group-list .btn-action').click(function () {
                    var clicked = jQuery(this),
                        action = clicked.attr('data-action'),
                        id = clicked.parent().attr('data-group');
                    Core.ApplicationManager.invokeService('user.group.' + action, self, id);
                });
            },

            /**
             * Render the template into the DOM with the ViewManager
             * @returns {Object} PageViewEdit
             */
            addUsers: function (user_list) {
                jQuery('#user-list').html(user_list);
                this.bindUsers();
            },

            addGroups: function (group_list) {
                jQuery('#group-list').html(group_list);
                this.bindGroups();
            }
        });
    }
);