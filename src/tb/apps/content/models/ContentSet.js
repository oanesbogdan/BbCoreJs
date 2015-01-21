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

define(['content.models.AbstractContent', 'jquery', 'jsclass'], function (AbstractContent, jQuery) {

    'use strict';

    var ContentSet = new JS.Class(AbstractContent, {

        contentClass: 'bb-content',

        /**
         * Initialize Content
         *
         * @param {Object} config
         */
        initialize: function (config) {
            this.callSuper(config);
        },

        /**
         * Add content html from parent with and position
         * If position is not provided, html will be at the first
         * @param {String} html
         * @param {Number} position
         * @returns {Promise}
         */
        append: function (content, position) {
            var self = this,
                done = false,
                dfd = jQuery.Deferred(),
                children = this.getNodeChildren();

            content.getHtml().done(function (html) {
                if (position === 'last') {
                    self.jQueryObject.append(html);
                    done = true;
                } else {
                    children.each(function (key) {
                        if (key === position) {
                            jQuery(this).before(html);
                            done = true;

                            return false;
                        }
                    });
                }

                if (done === false) {
                    self.jQueryObject.prepend(html);
                }

                self.setUpdated(true);

                dfd.resolve();
            });

            return dfd.promise();
        },

        /**
         * Return children of contentSet
         * @returns {Object}
         */
        getNodeChildren: function () {
            return this.jQueryObject.children('.' + this.contentClass);
        },

        /**
         * Verify if contentSet accept this element name
         * @param {String} accept
         * @returns {Boolean}
         */
        accept: function (accept) {
            var accepts = this.getDefinition('accept'),
                key,
                result = false;

            if (accepts.length === 0) {
                result = true;
            } else {
                for (key in accepts) {
                    if (accepts.hasOwnProperty(key)) {
                        if (accepts[key] === accept) {
                            result = true;
                            break;
                        }
                    }
                }
            }

            return result;
        },

        /**
         * Verify if contentSet is children of an other contentSet
         * @param {String} contentSetId
         * @returns {Boolean}
         */
        isChildrenOf: function (contentSetId) {
            var parents = this.jQueryObject.parents('[data-bb-id]'),
                result = false;

            parents.each(function () {
                var currentTarget = jQuery(this);

                if (currentTarget.attr('data-bb-id') === contentSetId) {
                    result = true;

                    return false;
                }
            });

            return result;
        }
    });

    return ContentSet;
});
