/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBuilder5.
 *
 * BackBuilder5 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBuilder5 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * bb.ApplicationManager
 * Responsability
 *  - provide an application skeleton
 *  - What is an application
 *  Application handle views
 *  [-View 1]
 *  [-View 2]
 *  [-View 3]
 *  [-View 4]
 *  application recieves requests via route
 *
 *  /#layout/create ---> route is handled by Application Route
 *                      ---> Then controller is called
 *                          ---> Then the right method is invoked
 *                              --> The right template
 *
 *  Application can déclare many controller BackBone Controllers
 *  Application Manager
 **/
define('tb.core.ApplicationManager', ['require', 'BackBone', 'jsclass', 'jquery', 'underscore', 'tb.core.Utils', 'tb.core.ApplicationContainer', 'tb.core.Api', 'tb.core.ControllerManager'], function (require) {
    'use strict';
    /* Abstract Application with Interface */
    /* dependence */
    var $ = require('jquery'),
        bbAppContainer = require('tb.core.ApplicationContainer'),
        underscore = require('underscore'),
        bbApi = require('tb.core.Api'),
        Backbone = require('BackBone'),
        bbUtils = require('tb.core.Utils'),
        ControllerManager = require('tb.core.ControllerManager'),
        AppDefContainer = {},
        currentApplication = null,
        config = null,
        Api = {},
        AppContainer = bbAppContainer.getInstance(),
        /**
         * AbstractApplication
         */
        AbstractApplication = new JS.Class({
            initialize: function (config) {
                this.config = {};
                this.state = 0;
                underscore.extend(this, Backbone.Events);
                this.config = $.extend(true, this.config, config);
                //this.appControllers = this.registerControllers();
                this.onInit();
            },

          /*  registerControllers: function () {
                try {
                    return ControllerManager.getAppControllers();
                } catch (e) {
                    console.log('registerControllers', e);
                }
            },*/
            getMainRoute: function () {
                return this.config.mainRoute;
            },
            exposeMenu: function () {
                return;
            },
            dispatchToController: function (controller, action, params) {
                ControllerManager.loadController(this.getName(), controller).done(function (controller) {
                    try {
                        params = underscore.rest(params); //# cf http://underscorejs.org/#rest
                        controller.invoke(action, params);
                    } catch (e) {
                        console.log('loadController', e);
                    }
                }).fail(function (reason) {
                    bbApi.exception("LoadControllerException", "5000", reason.message);
                });
            },
            /**
             * @TODO finalise setter
             *
             * [setControllerMng description]
             * @param {[type]} controllerMng [description]
             */
            setControllerMng: function (controllerMng) {
                return controllerMng;
            },
            onInit: function () {
                console.log('application init is called');
            },
            onStart: function () {
                this.trigger(this.getName() + ':onStart');
            },
            onStop: function () {
                //dispatch to controller
                console.log('on ... stop is called');
            },
            onResume: function () {
                console.log('on ... resume is called');
            },
            onError: function (e) {
                console.log('error in[' + this.name + '] application', e);
            }
        }),
        /**
         * @TODO Unused At Remove ?
         * clean app definition by removing
         */
        // cleanDefinition = function (definition) {
        //     var forbidenActions = [],
        //         prop = '';

        //     for (prop in definition) {
        //         if (definition.hasOwnProperty(prop)) {
        //             console.log('ok');
        //         }
        //     }
        //     console.log(forbidenActions);
        // },
        /*url --> router --> appManager --> controller --> action*/
        /**
         * var app = getAppByRoute(route)
         * app.invoke(controller:action)
         *  - controller.init execute ation
         *
         **/
        registerApplication = function (appname, AppDef) {
            if ('string' !== typeof appname) {
                throw "ApplicationManager :appname should be a string";
            }
            if ('object' !== typeof AppDef) {
                throw 'ApplicationManager : appDef Is undefined';
            }
            var ApplicationConstructor = new JS.Class(AbstractApplication, AppDef);
            /**
             *
             */
            ApplicationConstructor.define('getName', (function (name) {
                return function () {
                    this.name = name;
                    return name;
                };
            }(appname)));
            if (AppDefContainer[appname]) {
                throw 'AppAlreadyExists';
            }
            AppDefContainer[appname] = ApplicationConstructor;
        },
        registerAppRoutes = function (routes) {
            var def = new $.Deferred();
            return bbUtils.requireWithPromise(routes).done(function () {
                Api.trigger('routesLoaded');
                def.resolve.apply(this, arguments);
            }).fail(function (reason) {
                throw new Error('Error while Loading application routes' + reason);
            });
        },
        lauchApplication = function (appname, config) {
            var dfd = new $.Deferred(),
                applicationInfos = AppContainer.getByAppInfosName(appname),
                Application = AppDefContainer[appname],
                instance;
            try {
                config = config || {};
                if (currentApplication && (currentApplication.getName() === appname)) {
                    dfd.resolve(currentApplication);
                } else {
                    /** start or resume the new one */
                    if (!applicationInfos) {
                        /** If app def can't be found */
                        if (!Application) {
                            return load(appname, config); //@TODO resolve 'load' was used before it was defined.
                        }
                        instance = new Application(config);
                        /** stop currentApplication */
                        applicationInfos = {
                            instance: instance,
                            name: appname
                        };
                        /** stop current application */
                        if (currentApplication) {
                            currentApplication.onStop();
                        }
                        AppContainer.register(applicationInfos);
                        applicationInfos.instance.onInit();
                        applicationInfos.instance.onStart();
                        instance = applicationInfos.instance;
                    } else {
                        currentApplication.onStop();
                        /** application already exists call resume */
                        applicationInfos.instance.onResume();
                        instance = applicationInfos.instance;
                    }
                    currentApplication = instance;
                    dfd.resolve(currentApplication);
                }
            } catch (e) {
                console.log(e);
            }
            return dfd.promise();
        },
        /* load the app */
        load = function (appname, config) {
            var def = new $.Deferred(),
                completeAppname = ['app.' + appname];
            bbUtils.requireWithPromise(completeAppname).done(function () {
                lauchApplication(appname, config).done(def.resolve);
            }).fail(function () {
                throw 'Application[' + completeAppname + '] can\'t be found';
            });
            return def.promise();
        },
        handleAppLoadingErrors = function (e) {
            console.log('... handle specific app Error here ...', e);
        },
        /**
         * At this stage we are sure that all apps declared in applicationConfigs was loaded
         * And that the router was loaded
         * We can then load the 'active' app
         */
        appsAreLoaded = function () {
            var activeAppConf = config.applications[config.active] || {};
            if (activeAppConf.hasOwnProperty("config")) {
                activeAppConf = activeAppConf.config;
            }
            return load(config.active, activeAppConf).then(function (app) {
                Api.trigger('appIsReady', app); //use mediator
            });
        },
        init = function (configuration) {
            /* load apps here  */
            var routePaths = [],
                appPaths = [];
            config = configuration;
            if (!config.hasOwnProperty('appPath')) {
                throw 'InvalidAppConfig [appPath] key is missing';
            }
            if (!config.hasOwnProperty('applications')) {
                throw 'InvalidAppConfig [applications] key is missing';
            }
            if (!config.hasOwnProperty("active")) {
                throw "InvalidAppConfig [active] key is missing";
            }
            $.each(config.applications, function (appname) {
                appPaths.push(config.appPath + '/' + appname + '/main.js');
                routePaths.push(appname + '.routes');
            });
            bbUtils.requireWithPromise(appPaths).then($.proxy(registerAppRoutes, null, routePaths)).done(appsAreLoaded).fail(handleAppLoadingErrors);
        },
        start = function () {
            console.log('start');
        },
        invoke = function (actionInfos, params) {
            actionInfos = actionInfos.split(':');
            var appPromise = this.lauchApplication(actionInfos[0]);
            /* triger event app is loading */
            appPromise.done(function (application) {
                application.dispatchToController(actionInfos[1], actionInfos[2], params);
            }).fail(function (e) {
                console.log("AppManager:invoke", e);
            });

        },

        getAppByName = function (appName) {
            return AppContainer.getByAppInfosName(appName);
        };
    Api = {
        registerApplication: registerApplication,
        invoke: invoke,
        lauchApplication: lauchApplication,
        init: init,
        start: start,
        getAppByName: getAppByName
    };
    /* application as an Event emitter */
    underscore.extend(Api, Backbone.Events);
    bbApi.register('ApplicationManager', Api);
    return Api;
});