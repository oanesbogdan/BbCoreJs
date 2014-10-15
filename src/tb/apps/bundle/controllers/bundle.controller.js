define(['tb.core', 'tb.core.ViewManager'], function (Core, ViewManager) {
    'use strict';
    Core.ControllerManager.registerController('BundleController', {
        appName: 'bundle',
        config: {
            imports: ['bundle.repository']
        },

        onInit: function () {
            this.bundleList = {},
            this.bundles = {bundles: this.bundleList},
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
                    self.mainApp.render({data: data, template: template, renderFunctionName: functionName});
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
        }
    });
});
