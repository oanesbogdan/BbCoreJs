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

define('form.Form', ['tb.core', 'underscore', 'BackBone', 'jsclass'], function (Core, us, Backbone) {
    'use strict';

    /**
     * Form object
     */
    var Form = new JS.Class({

        AVAILABLE_METHOD: ['POST', 'GET'],

        /**
         * Initialize of Form
         */
        initialize: function (config) {

            us.extend(this, Backbone.Events);

            this.elements = {};
            this.config = config;

            this.computeMandatoryConfig(config);

            this.computeDefaultValue(config);
        },

        /**
         * Verify a mandatory field and set the view and template in form
         * @param {Object} config
         */
        computeMandatoryConfig: function (config) {

            if (config === undefined) {
                Core.exception('MissingConfigException', 500, 'Config must be set');
            }

            if (!config.hasOwnProperty('onSubmit')) {
                Core.exception('MissingPropertyException', 500, 'Property "onSubmit" not found in form');
            }
            this.onSubmit = config.onSubmit;

            if (!config.hasOwnProperty('template')) {
                Core.exception('MissingPropertyException', 500, 'Property "template" not found in form');
            } else {
                this.template = config.template;
            }

            if (!config.hasOwnProperty('view')) {
                Core.exception('MissingPropertyException', 500, 'Property "view" not found in form');
            } else {
                this.view = config.view;
            }
        },

        /**
         * Set the default value if is not define in config
         * @param {Object} config
         */
        computeDefaultValue: function (config) {

            this.id = 'toto';
            //this.id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

            this.method = 'POST';
            if (config.hasOwnProperty('method') && us.contains(this.AVAILABLE_METHOD, config.method)) {
                this.method = config.method;
            }

            this.action = null;
            if (config.hasOwnProperty('action')) {
                this.action = config.action;
            }

            this.submitLabel = 'Submit';
            if (config.hasOwnProperty('submit_label')) {
                this.submitLabel = config.submit_label;
            }
        },

        /**
         * Get the method of form
         * @returns {String}
         */
        getMethod: function () {
            return this.method;
        },

        /**
         * Get the action of form
         * @returns {String}
         */
        getAction: function () {
            return this.action;
        },

        /**
         * Get the label of button submit
         * @returns {String}
         */
        getSubmitLabel: function () {
            return this.submitLabel;
        },

        /**
         * Get the unique id
         * @returns {String}
         */
        getId: function () {
            return this.id;
        },

        /**
         * Add an element into the container
         * @param {String} key
         * @param {Object} element
         * @returns {Object} Form
         */
        add: function (key, element) {
            if (!this.elements.hasOwnProperty(key)) {

                if (!element.hasOwnProperty('class') ||
                    !element.hasOwnProperty('view') ||
                    !element.hasOwnProperty('template')) {

                    Core.exception('MissingPropertyException', 500, 'One or more property not found on add element in form for: ' + key);
                }
                this.elements[key] = element;
            }

            return this;
        },

        /**
         * Remove an element to the container
         * @param {String} key
         * @returns {Object} Form
         */
        remove: function (key) {
            if (this.elements.hasOwnProperty(key)) {
                delete this.elements[key];
            }

            return this;
        },

        /**
         * Get the element by this key
         * @param {String} key
         * @returns {Object} Form
         */
        get: function (key) {
            if (this.elements.hasOwnProperty(key)) {
                return this.elements[key];
            }

            return null;
        },

        /**
         * Get all elements of the container
         * @returns {Object} Form
         */
        getElements: function () {
            return this.elements;
        },

        /**
         * Render each element in form
         * @returns {String} HTML
         */
        render: function () {
            var key,
                items = [],
                View,
                view,
                template,
                elementConfig,
                elementClass,
                elementView,
                elementTemplate;

            View = require(this.view);
            template = require('text!' + this.template);

            for (key in this.elements) {
                if (this.elements.hasOwnProperty(key)) {
                    elementConfig = this.elements[key];

                    elementClass = require(elementConfig.class);
                    elementTemplate = require('text!' + elementConfig.template);
                    elementView = require(elementConfig.view);

                    items.push((new elementClass(key,  elementConfig, this.id, elementView, elementTemplate)).render());
                }
            }
            view = new View(template, items, this);

            return view.render();
        }
    });

    return Form;
});
