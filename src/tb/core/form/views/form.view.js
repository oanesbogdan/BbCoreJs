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

define(['tb.core.ViewManager', 'BackBone', 'jquery'], function (ViewManager, Backbone, jQuery) {
    'use strict';

    var FormView = Backbone.View.extend({

        initialize: function (template, elements, form) {
            this.el = '#bb5-ui';
            this.template = template;
            this.elements = elements;
            this.form = form;
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {String} html
         */
        render: function () {
            return ViewManager.render(this.template, {elements: this.elements, form: this.form});
        }
    });

    return FormView;
});