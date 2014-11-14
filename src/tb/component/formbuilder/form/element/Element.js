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

define(['tb.core', 'jsclass'], function (Core) {
    'use strict';

    /**
     * ElementText object
     */
    var Element = new JS.Class({

        /**
         * Initialize of Element
         * @param {String} key
         * @param {Object} config
         */
        initialize: function (key, config, formTag) {
            this.key = key;
            this.config = config;
            this.formTag = formTag;

            this.computeMandatoryConfig(config);

            this.computeDefaultValue(config);
        },

        /**
         * Set the default value if is not define in config
         * @param {Object} config
         */
        computeDefaultValue: function (config) {

            this.placeholder = '';
            if (config.hasOwnProperty('placeholder')) {
                this.placeholder = config.placeholder;
            }

            this.value = '';
            if (config.hasOwnProperty('value')) {
                this.value = config.value;
            }

            this.label = '';
            if (config.hasOwnProperty('label')) {
                this.label = config.label;
            }

            this.disabled = false;
            if (config.hasOwnProperty('disabled') && true === config.disabled) {
                this.disabled = true;
            }
        },

        /**
         * Verify a mandatory field and set the type into element
         * @param {Object} config
         */
        computeMandatoryConfig: function (config) {

            if (typeof this.key !== 'string') {
                Core.exception('BadTypeException', 500, 'The key of element must be a string');
            }

            if (config === undefined) {
                Core.exception('MissingConfigException', 500, 'Config must be set');
            }

            if (typeof this.formTag !== 'string') {
                Core.exception('BadTypeException', 500, 'The formTag of element must be a string');
            }

            if (!config.hasOwnProperty('type')) {
                Core.exception('MissingPropertyException', 500, 'Property "type" not found of element: ' + this.key);
            } else {
                this.type = config.type;
            }
        },

        /**
         * Get Config of Element
         * @returns {Object}
         */
        getConfig: function () {
            return this.config;
        },

        /**
         * Get key of Element
         * @returns {String}
         */
        getKey: function () {
            return this.key;
        },

        /**
         * Get type of Element
         * @returns {Object}
         */
        getType: function () {
            return this.type;
        },

        /**
         * Get label of Element
         * @returns {String}
         */
        getLabel: function () {
            return this.label;
        },

        /**
         * Get placeholder of ELement
         * @returns {String}
         */
        getPlaceholder: function () {
            return this.placeholder;
        },

        /**
         * Get value of Element
         * @returns {String}
         */
        getValue: function () {
            return this.value;
        },

        /**
         * Set the value of element
         * @returns {Object} Element
         */
        setValue: function (value) {
            this.value = value;

            return this;
        },

        /**
         * Get disabled of Element
         * @returns {Boolean}
         */
        isDisabled: function () {
            return this.disabled;
        }
    });

    return Element;
});