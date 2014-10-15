define(['tb.core', 'tb.core.ViewManager'], function (Core, ViewManager) {
    'use strict';
    Core.ControllerManager.registerController('BundleController', {
        appName: 'bundle',
        config: {
            imports: ['bundle.repository']
        },

        repository: null,
<<<<<<< Updated upstream

        onInit: function () {
            this.repository = require('bundle.repository');
        },

        listAction: function () {
            var callback = function(data, response) {
                console.log(response);
            };
            this.repository.list(callback);
=======
        mainApp: null,
        bundleList: {},
        bundles: {bundles: bundleList},

        onInit: function () {
            console.log('la'); 
            this.repository = require('bundle.repository');
            this.mainApp =  Core.get('application.main');
        },

        indexAction: function () {
            this.listAndRender('src/tb/apps/bundle/templates/index', 'renderInMainContent');
        },

        listAndRender: function (template, functionName) {
            var self = this,
                callback = function(data, response) {
                    self.bundleList = data;
                    this.mainApp.render(data, template, functionName);
                };
            this.repository.list(callback);
        },

        listAction: function () {
            var template = 'src/tb/apps/bundle/templates/index',
                functionName = 'renderInDialogContainer';

            if (null === this.bundleList) {
                this.listAndRender(template, functionName);
            } else {
                this.mainApp.render(this.bundles, template, functionName);
            }
>>>>>>> Stashed changes
        }
    });
});
