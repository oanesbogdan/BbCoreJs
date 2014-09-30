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

        JS = require('jsclass'),

        underscore = require('underscore'),

        bbApi = require('tb.core.Api'),

        Backbone = require('BackBone'),

        bbUtils = require('tb.core.Utils'),

        ControllerManager = require('tb.core.ControllerManager'),

        AppDefContainer = {},

        currentApplication = null,

        config = null,

        Api = {},

        AppContainer  = bbAppContainer.getInstance(),

        /**
         * AbstractApplication
         */
        AbstractApplication = new JS.Class({
            config : {},

            initialize : function (config) {
                underscore.extend(this, Backbone.Events);
                this.config = $.extend(true, this.config, config);
                this.state = 0;
                this.appControllers = this.registerControllers();
            },


            registerControllers : function () {
                try {
                    return ControllerManager.getAppController();
                } catch (e) {
                    console.log('registerControllers', e);
                }
            },

            getMainRoute: function () {
                return this.config.mainRoute;
            },

            exposeMenu: function () {
                return;
            },

            dispatchToController: function (controller, action, params) {
                ControllerManager.loadController(this.getName(), controller).done(function (controller) {
                    try {
                        controller.invoke(action, params);
                    } catch (e) {
                        console.log('loadController', e);
                    }
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

                instance = new Application(config);

            try {
                config = config || {};

                if (currentApplication && (currentApplication.getName() === appname)) {
                    dfd.resolve(currentApplication);

                } else {
                    /** start or resume the new one */
                    if (!applicationInfos) {
                        /** If app def can't be found */
                        if (!Application) {
                            return; // load(appname); @TODO resolve 'load' was used before it was defined.
                        }
                        /** stop currentApplication */

                        applicationInfos = {
                            instance : instance,
                            name: appname
                        };

                        /** stop current application */
                        if (currentApplication) {
                            currentApplication.onStop();
                        }

                        AppContainer.register(applicationInfos);
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
         * At the stage we are sure that all apps declared in applicationConfigs was loaded
         * And that the router was loaded
         * We can then load the 'active' app
         */
        appsAreLoaded = function () {
            // var mainAppConf = config.applications[config.active];

            return load(config.active, config).then(function (app) {
                Api.trigger('appIsReady', app); //use mediator
            });
        },

        init = function (configuration) {
            /* load apps here  */
            var routePaths = [],

                appPaths = [];

            config = configuration;

            if (!config.hasOwnProperty('appPath')) {
                throw 'InvalidAppConfig appPath is missing';
            }

            if (!config.hasOwnProperty('applications')) {
                throw 'InvalidAppConfig applciations is missing';
            }

            $.each(config.applications, function (appname) {
                appPaths.push(config.appPath + '/' + appname + '/main.js');
                routePaths.push(appname + '.routes');
            });

            bbUtils.requireWithPromise(appPaths)
                /* register app routes --> trigger routesLoaded*/
                .then($.proxy(registerAppRoutes, null, routePaths))
                /* load*/
                .done(appsAreLoaded).fail(handleAppLoadingErrors);
        },

        start = function () {
            console.log('start');
        },

        invoke =  function (actionInfos, params) {
            console.log(params);
            actionInfos = actionInfos.split(':');
            var appPromise = this.lauchApplication(actionInfos[0]);

            /* triger event app is loading */
            appPromise.done(function (application) {
                application.dispatchToController(actionInfos[1], actionInfos[2]);
            }).fail(function (e) {
                console.log(e);
            });
            /* init controller */
        };

    Api = {
        registerApplication: registerApplication,
        invoke: invoke,
        lauchApplication: lauchApplication,
        init: init,
        start: start
    };

    /* application as an Event emitter */
    underscore.extend(Api, Backbone.Events);

    bbApi.register('ApplicationManager', Api);
    return Api;
});