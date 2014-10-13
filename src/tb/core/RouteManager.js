define('tb.core.RouteManager', ['jquery', 'tb.core.Api', 'BackBone', 'tb.core.ApplicationManager', 'jsclass'], function (jQuery, Api, BackBone) {
    'use strict';
    var bbApplicationManager = require('tb.core.ApplicationManager'),
        //use the mediator to avoid a circular dependency
        routesCollections = {},
        /**
         * Router handle routes -> dispatch to application manager
         * Application manager
         **/
        Router = new JS.Class({

            initialize: function () {
                this.routes = {};
                var ExtRouter = BackBone.Router.extend({
                    execute: function (callback, args) {
                        if (typeof callback === 'function') {
                            callback.apply(this, args);
                        }
                    }
                });
                this.mainRouter = new ExtRouter({});
                this.handleApplicationLinks();
            },

            handleApplicationLinks: function () {
                /* si href ne rien faire */
                var self = this,
                    url,
                    routeInfos;
                jQuery("body").delegate("a", "click", function (e) {
                    var action = jQuery(this).data("action");
                    if ("string" === typeof action) {
                        e.preventDefault();
                        routeInfos = routesCollections[action]; // layout:home
                        if (!jQuery.isPlainObject(routeInfos)) {
                            throw "RouteManager:handleApplicationLinks route " + action + " can't be found";
                        }

                        url = self.buildLink(action);
                        self.navigate(url);
                    }
                });
            },

            buildLink: function (routeName, linkParams) {
                var routeInfos,
                    link;
                routeInfos = routesCollections[routeName] || {};
                if (!jQuery.isPlainObject(routeInfos)) {
                    throw "RouteManager:buildLink routeInfos can't be found";
                }

                linkParams = linkParams || routeInfos.defaults;
                link = routeInfos.url;
                if (routeInfos.hasOwnProperty("defaults")) {
                    jQuery.each(routeInfos.defaults, function (key, value) {
                        link = link.replace(key, value);
                    });
                }

                return link;
            },

            navigate: function (path, triggerEvent, updateRoute) {
                var conf = {
                    trigger: triggerEvent || true,
                    replace: updateRoute || true
                };
                this.mainRouter.navigate(path, conf);
            },

            genericRouteHandler: function (actionInfos) {
                var params = jQuery.merge([], arguments);
                params.pop();
                bbApplicationManager.invoke(actionInfos, params);
            },

            registerRoute: function (routeInfos) {
                var actionsName = routeInfos.completeName.split(':');
                console.log(routeInfos);
                actionsName = actionsName[0];
                this.mainRouter.route(routeInfos.url, routeInfos.completeName, jQuery.proxy(this.genericRouteHandler, this, actionsName + ':' + routeInfos.action));
            }

        }),
        routerInstance = new Router(),
        RouteManager = {

            initRouter: function (conf) {
                conf = conf || {};
                BackBone.history.start(conf);

                return this;
            },

            registerRoute: function (appname, routeConf) {
                var self = this,
                    routes = routeConf.routes,
                    prefix = '',
                    url = '';

                if (!routeConf.hasOwnProperty('routes')) {
                    throw 'A routes key must be provided';
                }

                if (!jQuery.isPlainObject(routeConf.routes)) {
                    throw 'Routes must be an object';
                }

                if (typeof routeConf.prefix === 'string') {
                    prefix = routeConf.prefix;
                }

                jQuery.each(routes, function (name, routeInfos) {
                    if (!jQuery.isPlainObject(routeInfos)) {
                        throw name + ' route infos must be an object';
                    }

                    if (!routeInfos.hasOwnProperty('url')) {
                        throw name + ' route infos must have `url` property';
                    }

                    if (!routeInfos.hasOwnProperty('action')) {
                        throw name + ' route infos must have `action` property';
                    }

                    if (prefix.length !== 0) {
                        url = (routeInfos.url.indexOf('/') === 0) ? routeInfos.url.substring(1) : routeInfos.url;
                        routeInfos.url = prefix + '/' + url;
                    }

                    routeInfos.completeName = appname + ':' + name;
                    /*register r*/
                    routesCollections[routeInfos.completeName] = routeInfos;
                    routerInstance.registerRoute(routeInfos);
                });
            },

            navigate: function (path, triggerEvent, updateRoute) {
                routerInstance.navigate(path, triggerEvent, updateRoute);
            }
        };

    Api.register('RouteManager', RouteManager);

    return RouteManager;
});