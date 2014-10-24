define(['tb.core', 'page.view.contribution.index', 'page.view.delete', 'page.view.new'], function (Core, ContributionIndexView, DeleteView, NewView) {
    'use strict';

    Core.ControllerManager.registerController('MainController', {

        appName: 'page',

        config: {
            imports: ['page.repository']
        },

        /**
         * Initialize of Page Controller
         */
        onInit: function () {
            this.mainApp =  Core.get('application.main');
            this.repository = require('page.repository');
        },

        /**
         * Index action
         * Show the index in the edit contribution toolbar
         */
        contributionIndexAction: function () {
            var callback = function (data) {
                if (data.hasOwnProperty(0)) {
                    data = data[0];
                }

                var view = new ContributionIndexView({'data': data});
                view.render();
            };

            this.repository.findCurrentPage(callback);
        },

        /**
         * Delete action
         * Delete page with uid
         * @param {String} uid
         */
        deleteAction: function (uid) {
            var view = new DeleteView(uid);
            view.render();
        },

        newAction: function () {
            var view = new NewView();
            view.render();
        }
    });
});
