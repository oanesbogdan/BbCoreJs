define('tb.core.RouteManager', ['jquery', 'tb.core.Api', 'BackBone', 'tb.core.ApplicationManager', 'jsclass'], function (jQuery, Api, BackBone) {

    'use strict';

    var bbApplicationManager = require('tb.core.ApplicationManager'),

        //use the mediator to avoid a circular dependency
        routerInstance = null,

        /**
         * Router handle routes -> dispatch to application manager
         * Application manager
         **/
        Router = new JS.Class({

            initialize: function () {
                this.routes = {};
                var ExtRouter = BackBone.Router.extend({
                    execute: function (callback, args) {
                        console.log('this is it');
                        /*trigger sont event here*/
                        if (typeof callback === 'function') {
                            callback.apply(this, args);
                        }
                    }
                });
                this.mainRouter = new ExtRouter({});
            },

            handleApplicationLinks : function () {
                return;
            },

            navigate: function (path, triggerEvent, updateRoute) {
                var conf = {
                    trigger: triggerEvent || true,
                    replace: updateRoute || true
                };
                this.mainRouter.navigate(path, conf);
            },

            genericRouteHandler: function (actionInfos, params) {
                console.log(params);
                /* handle action here */
                bbApplicationManager.invoke(actionInfos);
            },

            registerRoute: function (routeInfos) {
                var actionsName =  routeInfos.completeName.split(':');
                actionsName = actionsName[0];
                console.log(routeInfos.url);
                this.mainRouter.route(routeInfos.url, routeInfos.completeName, jQuery.proxy(this.genericRouteHandler, this, actionsName + ':' + routeInfos.action));
            }
        }),

        RouteManager = {
            registerRoute: function (appname, routeConf) {
                var self = this,
                    routes = routeConf.routes,
                    prefix = '',
                    router = null,
                    url = '';
                if (!routeConf.hasOwnProperty('routes')) {
                    throw 'A Routes Key Must Be Provided';
                }
                if (!jQuery.isPlainObject(routeConf.routes)) {
                    throw 'Routes Should Be An Object';
                }
                if (typeof routeConf.prefix === 'string') {
                    prefix = routeConf.prefix;
                }
                jQuery.each(routes, function (name, routeInfos) {
                    router = self.getRouter();
                    if (prefix.length !== 0) {
                        url = (routeInfos.url.indexOf('/') === 0) ? routeInfos.url.substring(1) : routeInfos.url;
                        routeInfos.url = prefix + '/' + url;
                    }
                    routeInfos.completeName = appname + ':' + name;
                    router.registerRoute(routeInfos);
                });
            },

            initRouter : function (conf) {
                conf = conf || {};
                var router = this.getRouter();
                BackBone.history.start(conf);

                return router;
            },

            startRouter: function () {
                if (!routerInstance) {
                    routerInstance = new Router();
                }
                return routerInstance;
            },

            getRouter: function () {
                return this.startRouter();
            }

        };

    Api.register('RouteManager', RouteManager);
    return RouteManager;
});