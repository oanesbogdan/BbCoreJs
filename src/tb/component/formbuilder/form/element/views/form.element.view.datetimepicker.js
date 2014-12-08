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

define(['tb.core.Renderer', 'BackBone', 'jquery'], function (Renderer, Backbone, jQuery) {
    'use strict';

    var DatetimepickerView = Backbone.View.extend({

        initialize: function (template, formTag, element) {
            this.el = formTag;
            this.template = template;
            this.element = element;
        },

        bindEvents: function () {
            jQuery('#bb5-ui').on('click', 'form#' + this.el + ' input[name=' + this.element.getKey() + ']', this.manageDatetimepicker);
        },

        manageDatetimepicker: function () {
            var element = jQuery(this);

            element.datetimepicker({
                parentID: '#bb5-ui'
            });

            element.datetimepicker('show');
        },

        /**
         * Render the template into the DOM with the Renderer
         * @returns {String} html
         */
        render: function () {
            this.bindEvents();

            return Renderer.render(this.template, {element: this.element});
        }
    });

    return DatetimepickerView;
});