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
