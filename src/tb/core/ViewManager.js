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
define('tb.core.ViewManager', ['nunjucks', 'jsclass'], function (Nunjucks) {
    'use strict';

    /**
     * ViewManager object
     */
    var ViewManager = new JS.Class({

        /**
         * Return the rendering engine (Nunjucks today)
         * @returns {Object} Nunjucks
         */
        getRenderer: function () {
            if (!this.renderer) {
                this.renderer = Nunjucks;
            }

            return this.renderer;
        },

        /**
         * Render a template
         * @param {String} html
         * @param {Object} data
         * @returns {String}
         */
        render: function (html, data) {
            return this.getRenderer().renderString(html, data);
        }
    });

    return new JS.Singleton(ViewManager);
});
