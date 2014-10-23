define('tb.core.ControllerManager', ['require', 'tb.core.Api', 'tb.core.ApplicationContainer', 'jquery', 'jsclass', 'tb.core.Utils'], function (require) {
    'use strict';

    var Api = require('tb.core.Api'),

        jQuery = require('jquery'),

        utils = require('tb.core.Utils'),

        appContainer = require('tb.core.ApplicationContainer'),

        controllerContainer = {},

        controllerInstance = {},

        enabledController = null,

        exception = function (code, message) {
            Api.exception('ControllerManagerException', code, message);
        },

        /**
         *  Controller abstract class
         *  @type {Object}
         */
        AbstractController = new JS.Class({

            /**
             * Controller contructor
             * @return {AbstractController} [description]
             */
            initialize: function () {
                this.state = 0;
                this.enabled = false;
                var appInfos = appContainer.getInstance().getByAppInfosName(this.appName);
                this.mainApp = appInfos.instance;
            },

            /**
             * Depencies loader
             * @return {promise}
             */
            handleImport: function () {
                var def = new jQuery.Deferred();

                if (jQuery.isArray(this.config.imports) && this.config.imports.length) {
                    utils.requireWithPromise(this.config.imports).done(def.resolve).fail(function (reason) {
                        var error = {
                            method: 'ControllerManager:handleImport',
                            message: reason
                        };
                        def.reject(error);
                    });
                } else {
                    def.resolve();
                }

                return def.promise();
            },

            /**
             * Action automaticly call when the Controller is Enabled
             * @return {false}
             */
            onEnabled: function () {
                this.enabled = true;
            },

            /**
             * Action automaticly call when the Controller is Disabled
             * @return {false}
             */
            onDisabled: function () {
                this.enabled = false;
            },

            /**
             * Function used to call controller action
             * @param  {String} action
             * @param  {Mixed} params
             * @return {false}
             */
            invoke: function (action, params) {
                var actionName = action + 'Action';

                if (typeof this[actionName] !== 'function') {
                    exception(15001, actionName + ' Action Doesnt Exists in ' + this.getName() + ' Cotroller');
                }

                try {
                    this[actionName].apply(this, params);
                } catch (e) {
                    exception(15002, 'Error while executing [' + actionName + '] in ' + this.getName() + ' controller with message: ' + e);
                }
            }
        }),

        /**
         * Change the current controller
         * @param  {AbstractController} currentController
         * @return {false}
         */
        updateEnabledController = function (currentController) {
            if (currentController === enabledController) {
                return;
            }

            if (enabledController) {
                enabledController.onDisabled();
            }

            enabledController = currentController;
            enabledController.onEnabled();
        },

        /**
         * Compute the controller name used into ControllerContainer
         * @param  {String} controllerName
         * @return {String}
         */
        computeControllerName = function (controllerName) {
            var ctlName = '',

                controllerPos = -1;

            if ('string' === typeof controllerName) {
                controllerPos = controllerName.indexOf('Controller');
            }

            if (controllerPos !== -1) {
                controllerName = controllerName.substring(0, controllerPos);
                ctlName = controllerName.toLowerCase() + '.controller';
            }

            if (ctlName.length === 0) {
                exception(15004, 'Controller name do not respect {name}Controller style declaration');
            }

            return ctlName;
        },

        /**
         * Automatique controller initialiser before action call execution
         * @param  {String} appName
         * @param  {String} controllerName
         * @param  {jQuery.Deferred} def
         * @return {False}
         */
        initController = function (appName, controllerName, def) {
            var currentController,
                fullControllerName = appName + '.' + computeControllerName(controllerName);

            currentController = new controllerContainer[appName][controllerName]();
            controllerInstance[fullControllerName] = currentController;

            currentController.handleImport().then(function () {
                currentController.onInit(require);
                updateEnabledController(currentController);
                def.resolve(currentController);
            });
        },

        /**
         * Register a new controller
         * @param  {String} controllerName
         * @param  {Object} ControllerDef
         * @return {False}
         */
        registerController = function (controllerName, ControllerDef) {

            if (false === ControllerDef.hasOwnProperty('appName')) {
                exception(15003, 'Controller should be attached to an App');
            }

            var appName = ControllerDef.appName,

                Constructor = {};

            if (ControllerDef.hasOwnProperty('initialize')) {
                delete ControllerDef.initialize;
            }

            Constructor = new JS.Class(AbstractController, ControllerDef);

            Constructor.define('initialize', (function (config) {
                return function () {
                    this.callSuper(config);
                };
            }(ControllerDef.config)));

            Constructor.define('getName', (function (name) {
                return function () {
                    return name;
                };
            }(controllerName)));

            if (!controllerContainer[appName]) {
                controllerContainer[appName] = {};
            }

            controllerContainer[appName][controllerName] = Constructor;
        },

        /**
         * Load controller and retrieve it if is allready loaded
         * @param  {String} appName
         * @param  {String} controllerName
         * @return {Object}
         */
        loadController = function (appName, controllerName) {
            var fullControllerName = appName + '.' + computeControllerName(controllerName),

                def = jQuery.Deferred(),

                cInstance = '';

            if (!appName || typeof appName !== 'string') {
                exception(15005, 'appName have to be defined as String');
            }

            cInstance = controllerInstance[fullControllerName];

            if (cInstance) {
                updateEnabledController(cInstance);
                def.resolve(cInstance);
            } else {
                utils.requireWithPromise([fullControllerName]).done(function () {
                    initController(appName, controllerName, def);
                }).fail(def.reject);
            }

            return def.promise();
        },

        /**
         * Return the controler corresponding at the current application actualy launched
         * @param  {String} appName
         * @return {False}
         */
        getAppControllers = function (appName) {
            if (controllerContainer.hasOwnProperty(appName)) {
                return controllerContainer[appName];
            }

            exception(15006, 'Controller Not Found');
        },

        /**
         * Controller manager api exposition
         * @type {Object}
         */
        ControllerManager = {
            registerController: registerController,

            loadController: loadController,

            getAppControllers: getAppControllers,

            getAllControllers: function () {
                return controllerContainer;
            }
        };


    Api.register('ControllerManager', ControllerManager);

    return ControllerManager;
});