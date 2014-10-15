define(['tb.core', 'tb.core.ViewManager'], function (Core, ViewManager) {
    'use strict';
    Core.ControllerManager.registerController('BundleController', {
        appName: 'bundle',
        config: {
            imports: ['bundle.repository']
        },

        onInit: function () {
            this.bundles = null,
            this.repository = require('bundle.repository');
            this.mainApp =  Core.get('application.main');
        },

        indexAction: function () {
            this.listAndRender('src/tb/apps/bundle/templates/index', 'renderInMainContent');
        },

        listAndRender: function (template, functionName) {
            var self = this,
                callback = function(data, response) {
                    self.bundles = {bundles: data};
                    self.mainApp.render({data: self.bundles, template: template, renderFunctionName: functionName});
                };
            this.repository.list(callback);
        },

        listAction: function () {
            var template = 'src/tb/apps/bundle/templates/list',
                functionName = 'renderInDialogContainer';

            if (null === this.bundles) {
                this.listAndRender(template, functionName);
            } else {
                this.mainApp.render({data: this.bundles, template: template, renderFunctionName: functionName});
            }
        }
    });
});
