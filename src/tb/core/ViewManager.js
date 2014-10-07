define('tb.core.ViewManager', ['jsclass'], function () {
    'use strict';

    /**
     * ViewManager object
     */
    var ViewManager = new JS.Class({
        config: {
            baseUrl: require.toUrl('./'),
            extension: '.tpl'
        },

        /**
         * Return the rendering engine (Handlebars today)
         * @returns {base.HandlebarsEnvironment}
         */
        getRenderer: function () {
            if (!this.renderer) {
                require('handlebars');
                this.renderer = Handlebars.create();
            }
            return this.renderer;
        },

        /**
         * Load template source
         * @param {String} template
         * @param {Function} callback
         */
        loadTemplate: function (template, callback) {
            var self = this;
            callback = callback || this.compile;

            require(['tb.core.Request', 'tb.core.RequestHandler'], function (Request, RequestHandler) {
                var request = new Request();
                request.setContentType('text/plain')
                        .setMethod('GET')
                        .setUrl(self.config.baseUrl + template + self.config.extension);

                RequestHandler.send(request, callback, self);
            });
        },

        /**
         * Compile and execute a template
         * @param {String} templateSpec
         * @returns {String}
         */
        compile: function (templateSpec) {
            var tpl = this.getRenderer().compile(templateSpec, this.options),
                html = tpl(this.data);

            this.context = this.context || this;
            if ('function' === typeof this.callback) {
                return this.callback.call(this.context, html);
            }

            return html;
        },

        /**
         * Render a template against the provided context
         * @param {Object} data
         * @param {String} relative path to the template
         * @param {Object} options pass to rendering engine
         * @param {Function} callback
         * @param {Object} context optional context for callback
         * @returns {String}
         */
        render: function (data, template, options, callback, context) {
            this.data = data;
            this.options = options;
            this.callback = callback;
            this.context = context;

            this.loadTemplate(template);
        }
    });

    return new JS.Singleton(ViewManager);
});
