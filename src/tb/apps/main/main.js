/* Application Déclaration */
require.config({
    paths: {
        'main.routes': 'src/tb/apps/main/routes',
        'main.controller': "src/tb/apps/main/controllers/main.controller"
    }
});

define('app.main', ['tb.core', 'jquery', 'main.controller'], function (core, jQuery) {
    'use strict';

    /**
     * Main application defining default templates and themes
     */
    core.ApplicationManager.registerApplication('main', {
        config: {
            tbElement: null,
            tbSelector: '#bb-toolbar'
        },

        onInit: function () {
            if (!this.config.tbElement && !jQuery(this.config.tbSelector).length) {
                throw 'Selector "' + this.config.tbSelector + '" does not exists, MainApplication cannot be initialized.';
            } else {
                this.config.tbElement = jQuery(jQuery(this.config.tbSelector).get(0));
            }

            console.log(' MainApplication is initialized ');
        },

        onStart: function () {
            console.log(' MainApplication onStart...');
        },

        onStop: function () {
            console.log(' MainApplication onStop...');
        },

        onError: function () {
            console.log(' MainApplication onError...');
        }

    });
});
