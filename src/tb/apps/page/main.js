require.config({
    paths: {
        'page.routes': 'src/tb/apps/page/routes',
        'page.main.controller': 'src/tb/apps/page/controllers/main.controller',

        //Views
        'bundle.view.contribution.index': 'src/tb/apps/page/views/bundle.view.contribution.index',

        //Templates
        'page/tpl/contribution.index': 'src/tb/apps/page/templates/contribution.index.twig'
    }
});

define('app.page', ['tb.core'], function (BbCore) {
    'use strict';

    /**
     * page application declaration
     */
    BbCore.ApplicationManager.registerApplication('page', {
        /**
         * occurs on initialization of page application
         */
        onInit: function () {
            console.log('init page application');
        },

        /**
         * occurs on start of page application
         */
        onStart: function () {
            console.log('start page application');
        },

        /**
         * occurs on stop of page application
         */
        onStop: function () {
            console.log('stop page application');
        },

        /**
         * occurs on error of page application
         */
        onError: function () {
            console.log('error in page application');
        }
    });

});
