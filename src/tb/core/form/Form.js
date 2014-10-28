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

define('form.Form', ['jsclass'], function () {
    'use strict';

    /**
     * Form object
     */
    var Form = new JS.Class({

        /**
         * Initialize of Form
         */
        initialize: function () {
            this.elements = {};
        },

        /**
         * Add an element into the container
         * @param {String} key
         * @param {Object} element
         * @returns {Object} Form
         */
        add: function (key, element) {
            if (!this.elements.hasOwnProperty(key)) {
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

        render: function () {
            var key,
                element;

            for (key in this.elements) {
                if (this.elements.hasOwnProperty(key)) {
                    element = this.elements[key];
                    //load and render
                }
            }
        }
    });

    return Form;
});
