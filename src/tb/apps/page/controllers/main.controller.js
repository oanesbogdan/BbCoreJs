define(['tb.core'], function (Core) {
    'use strict';

    Core.ControllerManager.registerController('MainController', {

        appName: 'page',

        config: {
            imports: []
        },

        /**
         * Index action
         * Show the index in the edit contribution toolbar
         */
        contributionIndexAction: function () {
            console.log('page contribution index action');
        }
    });
});
