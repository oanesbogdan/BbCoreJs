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
    ['require', 'tb.core.Renderer', 'jquery', 'text!user/templates/group/delete.twig'],
    function (require, Renderer, jQuery) {
        'use strict';

        /**
         * View of new page
         * @type {Object} Backbone.View
         */
        return Backbone.View.extend({

            popin_config: {
                id: 'new-group-subpopin',
                width: 250,
                top: 180
            },

            bindAction: function () {
                var self = this;
                jQuery('#bb-group-validate').click(function () {
                    self.dfd.resolve();
                });
                jQuery('#bb-group-cancel').click(function () {
                    self.dfd.reject();
                });

            },

            /**
             * Initialize of PageViewEdit
             */
            initialize: function (data) {
                this.mainPopin = data.popin;
                this.group = data.group;
                this.popin = this.mainPopin.popinManager.createSubPopIn(this.mainPopin.popin, this.popin_config);
                this.tpl = Renderer.render(require('text!user/templates/group/delete.twig'), {group: this.group});
                this.popin.setContent(this.tpl);
            },


            display: function () {
                this.dfd = jQuery.Deferred();
                this.popin.display();
                this.bindAction();
                return this.dfd.promise();
            },

            destruct: function () {
                this.mainPopin.popinManager.destroy(this.popin);
            }
        });
    }
);