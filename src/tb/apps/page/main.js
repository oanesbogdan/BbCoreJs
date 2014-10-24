require.config({
    paths: {
        'page.routes': 'src/tb/apps/page/routes',
        'page.main.controller': 'src/tb/apps/page/controllers/main.controller',
<<<<<<< HEAD
        'page.repository': 'src/tb/apps/page/repository/page.repository',

        //Views
        'page.view.contribution.index': 'src/tb/apps/page/views/page.view.contribution.index',
        'page.view.delete': 'src/tb/apps/page/views/page.view.delete',
        'page.view.new': 'src/tb/apps/page/views/page.view.new',

        //Templates
        'page/tpl/contribution/index': 'src/tb/apps/page/templates/contribution.index.twig',
        'page/tpl/contribution/scheduling_publication': 'src/tb/apps/page/templates/scheduling_publication.dialog.twig'
=======

        //Views
        'bundle.view.contribution.index': 'src/tb/apps/page/views/bundle.view.contribution.index',

        //Templates
        'page/tpl/contribution.index': 'src/tb/apps/page/templates/contribution.index.twig'
>>>>>>> #2353 init page application
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
