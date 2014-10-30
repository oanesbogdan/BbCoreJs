define(['tb.core', 'contribution.view.index', 'contribution.view.testform'], function (Core, IndexView, TestformView) {
    'use strict';

    Core.ControllerManager.registerController('MainController', {

        appName: 'contribution',

        config: {
            imports: []
        },

        /**
         * Initialize of Contribution Controller
         */
        onInit: function () {
            this.mainApp =  Core.get('application.main');
        },

        /**
         * Index action
         * Show the edition toolbar
         */
        indexAction: function () {
            var view = new IndexView();
            view.render();
        },

        testformAction: function () {
            var view = new TestformView();

            view.render();
        }
    });
});
