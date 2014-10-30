require.config({
    paths: {
        'contribution.routes': 'src/tb/apps/contribution/routes',
        'contribution.main.controller': 'src/tb/apps/contribution/controllers/main.controller',

        //Views
        'contribution.view.index': 'src/tb/apps/contribution/views/contribution.view.index',
        'contribution.view.testform': 'src/tb/apps/contribution/views/contribution.view.testform',
        //Templates
        'contribution/tpl/index': 'src/tb/apps/contribution/templates/index.twig'
    }
});

define('app.contribution', ['tb.core'], function (BbCore) {
    'use strict';

    /**
     * Contribution application declaration
     */
    BbCore.ApplicationManager.registerApplication('contribution', {
        /**
         * occurs on initialization of contribution application
         */
        onInit: function () {
            console.log('init contribution application');
        },

        /**
         * occurs on start of contribution application
         */
        onStart: function () {
            console.log('start contribution application');
        },

        /**
         * occurs on stop of contribution application
         */
        onStop: function () {
            console.log('stop contribution application');
        },

        /**
         * occurs on error of contribution application
         */
        onError: function () {
            console.log('error in contribution application');
        }
    });

});
