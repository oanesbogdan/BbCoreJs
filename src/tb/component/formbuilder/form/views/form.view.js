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

        /**
         * Initialize of FormView
         * @param {String} template
         * @param {Object} elements
         * @param {Object} form
         */
        initialize: function (template, elements, form) {
            this.el = '#bb5-ui';
            this.form_button_id = '#bb-submit-form';
            this.template = template;
            this.elements = elements;
            this.form = form;
        },

        /**
         * Events of view
         */
        bindUiEvents: function () {
            jQuery(this.el).on('click', this.form_button_id, jQuery.proxy(this.computeForm, this));
        },

        /**
         * Compute the data of form and build Object
         * @param {Object} form
         * @returns {unresolved}
         */
        computeData: function (form) {
            var paramObj = {},
                formSerialized = form.serializeArray();

            jQuery.each(formSerialized, function (i) {
                if (paramObj.hasOwnProperty(formSerialized[i].name)) {
                    paramObj[formSerialized[i].name] = jQuery.makeArray(paramObj[formSerialized[i].name]);
                    paramObj[formSerialized[i].name].push(formSerialized[i].value);
                } else {
                    paramObj[formSerialized[i].name] = formSerialized[i].value;
                }
            });

            return paramObj;
        },

        /**
         * Compute the form
         */
        computeForm: function () {
            var jqueryForm = jQuery('form#' + this.form.id),
                data = this.computeData(jqueryForm);

            this.form.onSubmit(data);
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {String} html
         */
        render: function () {
            this.bindUiEvents();

            return ViewManager.render(this.template, {elements: this.elements, form: this.form});
        }
    });

    return FormView;
});