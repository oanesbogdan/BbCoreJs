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
    ['require', 'jquery', 'tb.core', 'component!popin', 'text!user/templates/popin.twig'],
    function (require, jQuery, Core) {
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
            },

            bindUsers: function () {
                var class_name = '.bb5-list-users-item',
                    self = this;
                jQuery(class_name).click(function () {
                    jQuery(class_name + ' .bb5-manage-user.open').removeClass('open');
                    jQuery(this).find('.bb5-manage-user').addClass('open');
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