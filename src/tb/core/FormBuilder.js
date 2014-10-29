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
define('tb.core.FormBuilder', ['tb.core', 'form.Form', 'tb.core.Utils', 'jsclass'], function (Core, FormConstructor, Utils) {
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
        renderForm: function (config, callback) {

            var key,
                elements,
                elementConfig,
                view,
                typeFormated,
                self = this,
                requireArray = [];

            if (!config.hasOwnProperty('elements')) {
                Core.exception('MissingPropertyException', 500, 'Property "elements" not found');
            }

            //Load form in config or a default form
            if (!config.hasOwnProperty('form')) {
                config.form = {};
            }

            if (!config.form.hasOwnProperty('template')) {
                config.form.template = 'text!src/tb/core/form/templates/form.twig';
            }

            if (!config.form.hasOwnProperty('view')) {
                config.form.view = 'form.view';
            }

            //Set the config (template/view)
            requireArray.push(config.form.template).push(config.form.view);
            this.form = new FormConstructor(config.form);

            elements = config.elements;
            for (key in elements) {
                if (elements.hasOwnProperty(key)) {
                    elementConfig = elements[key];

                    typeFormated = elementConfig.type.substr(0, 1).toUpperCase() + elementConfig.type.substr(1);
                    elementConfig.class = 'form.element.' + typeFormated;
                    requireArray.push(elementConfig.view);

                    elementConfig.template = 'text!src/tb/core/form/element/templates/' + elementConfig.type + '.twig';
                    requireArray.push(elementConfig.template);

                    elementConfig.view = 'form.element.view.' + elementConfig.type;
                    requireArray.push(elementConfig.view);

                    this.form.add(key, elementConfig);
                }
            }

            Utils.requireWithPromise(requireArray).done(function () {
                //callback(self.form.render());
                self.form.render();
            }).fail(function (e) {
                console.log(e);
            });
        }
    });

    return new JS.Singleton(FormBuilder);
});
