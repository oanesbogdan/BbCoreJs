define(['tb.core', 'tb.core.ViewManager'], function (Core, ViewManager) {
    'use strict';
    Core.ControllerManager.registerController('BundleController', {
        appName: 'bundle',
        config: {
            imports: ['bundle.repository']
        },

        repository: null,

        onInit: function () {
            this.repository = require('bundle.repository');
        },

        listAction: function () {
            var callback = function(data, response) {
                console.log(response);
            };
            this.repository.list(callback);
        }
    });
});
