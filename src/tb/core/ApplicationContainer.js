define("tb.core.ApplicationContainer", ["jquery", "jsclass", "tb.core.Api"], function (jQuery, JS) {
    'use strict';

    var instance = null,
        AppContainer;

    /**
     * AppContainer object
     */
    AppContainer = new JS.Class({
        /**
         * Container initialisation
         */
        initialize: function () {
            this.container = [];
        },

        /**
         * Register a new application
         * @param {object} applicationInfos  { 
         *                                       name:"appname",
         *                                       instance:"",
         *                                       state
         *                                   }
         */
        register: function (applicationInfos) {
            this.container.push(applicationInfos);
        },

        /**
         * Gets application info by its name
         * @param {type} name
         * @returns {appInfos}
         */
        getByAppInfosName: function (name) {
            var result = null;
            jQuery.each(this.container, function (i, appInfos) {
                if (appInfos.name === name) {
                    result = appInfos;
                    return false;
                }
                i = i + 1;
            });

            return result;
        }
    });

    return {
        getInstance: function () {
            if (!instance) {
                instance = new AppContainer();
            }
            return instance;
        }

    };
});