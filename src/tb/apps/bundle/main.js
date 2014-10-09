require.config({
    paths: {
        'bundle.routes': 'src/tb/apps/bundle/routes',
        'bundle.controller': 'src/tb/apps/bundle/controllers/bundle.controller',
        'bundle.repository': 'src/tb/apps/bundle/repository/bundle.repository'
    }
});

define('app.bundle', ['tb.core', 'bundle.controller'], function (BbCore) {
    'use strict';

    /**
     * bundle application declaration
     */
    BbCore.ApplicationManager.registerApplication('bundle', {
        /**
         * occurs on initialization of bundle application
         */
        onInit: function () {
            console.log(' BundleApplication is initialized ');
        },

        /**
         * occurs on start of bundle application
         */
        onStart: function () {
            console.log('onStart [BundleApplication] ...');
        },

        /**
         * occurs on stop of bundle application
         */
        onStop: function () {
            console.log('BundleApplication onStop is called...');
        },

        /**
         * occurs on error of bundle application
         */
        onError: function () {
            console.log('BundleApplication onError...');
        }
    });

});
