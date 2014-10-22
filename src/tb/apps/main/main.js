/* Application Déclaration */
require.config({
    paths: {
        'main.routes': 'src/tb/apps/main/routes',
        'main.controller': "src/tb/apps/main/controllers/main.controller",

        //Templates
        'main/tpl/toolbar': 'src/tb/apps/main/templates/toolbar.twig',

        //Views
        'main.view.index': 'src/tb/apps/main/views/main.view.index'
    }
});

define('app.main', ['tb.core', 'main.view.index', 'jquery'], function (core, MainViewIndex, jQuery) {

    'use strict';

    /**
     * Main application defining default templates and themes
     */
    core.ApplicationManager.registerApplication('main', {

        /**
         * occurs on initialization of main application
         */
        onInit: function () {
            this.config = {
                tbSelector: '#bb5-ui'
            };

            if (!jQuery(this.config.tbSelector).length) {
                throw 'Selector "' + this.config.tbSelector + '" does not exists, MainApplication cannot be initialized.';
            }

            core.set('application.main', this);

            console.log(' MainApplication is initialized ');
        },

        /**
         * occurs on start of main application
         */
        onStart: function () {
            var view = new MainViewIndex(this.config);
            view.render();

            console.log(' MainApplication onStart...');
        },

        /**
         * occurs on stop of main application
         */
        onStop: function () {
            console.log(' MainApplication onStop...');
        },

        /**
         * occurs on error of main application
         */
        onError: function () {
            console.log(' MainApplication onError...');
        }
    });
});
