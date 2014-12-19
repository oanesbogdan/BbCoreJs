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
    ['require', 'jquery', 'tb.core.Renderer', 'tb.core', 'text!user/templates/toolbar.twig'],
    function (require, jQuery, Renderer, Core) {
        'use strict';

        /**
         * View of new page
         * @type {Object} Backbone.View
         */
        return Backbone.View.extend({

            /**
             * Initialize of PageViewEdit
             */
            initialize: function () {
                var self = this;
                self.zone = jQuery('#bb5-maintabsContent');
                self.tpl = Renderer.render(require('text!user/templates/toolbar.twig'));
                Core.ApplicationManager.invokeService('main.main.toolbarManager').done(function (Service) {
                    Service.append('bb-user-app', Renderer.render(self.tpl), true);
                    self.bindAction();
                });
            },

            newUser: function () {
                Core.ApplicationManager.invokeService('user.user.new', Core.get('application.user').popin);
            },

            bindAction: function () {
                this.zone.find('#toolbar-new-user-action').click(this.newUser);
            },

            destruct: function () {
                this.zone.html('');
            }
        });
    }
);