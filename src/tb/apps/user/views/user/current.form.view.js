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
    ['require', 'jquery', 'component!popin'],
    function (require, jQuery) {
        'use strict';

        /**
         * View of new page
         * @type {Object} Backbone.View
         */
        return Backbone.View.extend({

            popin_config: {
                id: 'new-user-subpopin',
                width: 250,
                top: 180
            },

            /**
             * Initialize of PageViewEdit
             */
            initialize: function (data, action) {
                var self = this,
                    form;
                this.popinManager = require('component!popin');
                this.popin = this.popinManager.createPopIn({id: 'current-user-popin'});
                this.user = data.user;

                form = require('user/form/' + action + '.user.form');
                form.construct(self, data.errors);
            },

            display: function () {
                this.dfd = jQuery.Deferred();
                this.popin.display();
                return this.dfd.promise();
            },

            destroy: function () {
                this.popinManager.destroy(this.popin);
            }
        });
    }
);