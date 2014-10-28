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
define('tb.core.FormBuilder', ['tb.core', 'form.Form', 'jsclass'], function (Core, FormConstructor) {
    'use strict';

    /**
     * FormBuilder object
     */
    var FormBuilder = new JS.Class({

        /**
         * Initialize of FormBuilder
         */
        initialize: function () {
            this.container = {};
        },

        /**
         *
         * config.elements:
         *      name:
         *          type: 'text'
         *          label: 'My name'
         *          value: ''
         *
         * @param {type} config
         * @returns {undefined}
         */
        createForm: function (config) {

            var key,
                elements,
                element,
                template,
                view;

            if (!config.hasOwnProperty('elements')) {
                Core.exception('MissingPropertyException', 500, 'Property "elements" not found');
            }

            //Load form in config or a default form
            if (config.hasOwnProperty('form')) {
                if (config.form.hasOwnProperty('template')) {
                    //Load the template
                }
                if (config.form.hasOwnProperty('view')) {
                    //Load the view
                }
            }

            //Set the config (template/view)
            this.form = new FormConstructor();

            elements = config.elements;
            for (key in elements) {
                if (elements.hasOwnProperty(key)) {
                    element = elements[key];
                    this.form.add(key, element);
                }
            }

            return this.form;
        }
    });

    return new JS.Singleton(FormBuilder);
});
