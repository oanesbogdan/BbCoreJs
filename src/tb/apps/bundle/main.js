require.config({
    paths: {
        'bundle.routes': 'src/tb/apps/bundle/routes',
        'bundle.main.controller': 'src/tb/apps/bundle/controllers/main.controller',
        'bundle.repository': 'src/tb/apps/bundle/repository/bundle.repository',

        //Views
        'bundle.view.list': 'src/tb/apps/bundle/views/bundle.view.list',
        'bundle.view.index': 'src/tb/apps/bundle/views/bundle.view.index',

        //Templates
        'bundle/tpl/list': 'src/tb/apps/bundle/templates/list.twig',
        'bundle/tpl/index': 'src/tb/apps/bundle/templates/index.twig'
    }
});

define('app.bundle', ['tb.core'], function (BbCore) {
    'use strict';

    /**
     * bundle application declaration
     */
    BbCore.ApplicationManager.registerApplication('bundle', {
        /**
         * occurs on initialization of bundle application
         */
        onInit: function () {
            console.log('init bundle application');
        },

        /**
         * occurs on start of bundle application
         */
        onStart: function () {
            console.log('start bundle application');
        },

        /**
         * occurs on stop of bundle application
         */
        onStop: function () {
            console.log('stop bundle application');
        },

        /**
         * occurs on error of bundle application
         */
        onError: function () {
            console.log('error in bundle application');
        }
    });

});
