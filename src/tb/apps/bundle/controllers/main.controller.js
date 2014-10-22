define(['tb.core', 'bundle.view.list', 'bundle.view.index'], function (Core, ListView, IndexView) {
    'use strict';

    Core.ControllerManager.registerController('MainController', {

        appName: 'bundle',

        config: {
            imports: ['bundle.repository']
        },

        /**
         * Initialize of Bundle Controller
         */
        onInit: function () {
            this.bundles = null;
            this.repository = require('bundle.repository');
            this.mainApp =  Core.get('application.main');
        },

        /**
         * Index action
         * Show the first bundle in toolbar
         */
        indexAction: function () {
            this.listAndRender(IndexView);
        },

        /**
         * List action
         * Show all bundle in toolbar
         */
        listAction: function () {

            if (null === this.bundles) {
                this.listAndRender(ListView);
            } else {
                this.renderView(ListView, this.bundles);
            }
        },

        /**
         * Call the driver handler for return the list and
         * use the view for render the html
         *
         * @param {Object} ConstructorView
         * @returns {bundle.controller_L1.bundle.controllerAnonym$1}
         */
        listAndRender: function (ConstructorView) {
            var self = this,
                callback = function (datas) {
                    self.bundles = {bundles: datas};
                    self.renderView(ConstructorView, self.bundles);
                };
            this.repository.list(callback);
        },

        /**
         * Call the view for render data in the DOM
         * @param {Object} ConstructorView
         * @param {Object} datas
         */
        renderView: function (ConstructorView, datas) {
            var view = new ConstructorView({datas: datas});
            view.render();
        }
    });
});
