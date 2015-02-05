define(['tb.core', 'contribution.view.index'], function (Core, IndexView) {
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
            var config = {},
                view;

            if (this.viewIsLoaded !== true) {
                this.viewIsLoaded = true;
            } else {
                config.alreadyLoaded = true;
            }

            view = new IndexView(config);
            view.render();
        }
    });
});
