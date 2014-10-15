define('tb.core.ControllerManager', ['require', 'tb.core.Api', 'jquery', 'jsclass', 'tb.core.Utils'], function (require) {
    'use strict';
    var Api = require('tb.core.Api'),
        jQuery = require('jquery'),
        bbUtils = require('tb.core.Utils'),
        controllerContainer = {},
        controllerInstance = {},
        enabledController = null,
        AbstractController,
        registerController,
        loadController,
        getAppControllers,
        updateEnabledController,
        $ = jQuery,
        ControllerManager;
    AbstractController = new JS.Class({
        initialize: function () {
            this.state = 0;
            this.enabled = false;
            /* at this stage app is available */
        },
        handleImport: function () {
            var def = new $.Deferred();
            if ($.isArray(this.config.imports) && this.config.imports.length) {
                bbUtils.requireWithPromise(this.config.imports).done(def.resolve).fail(function (reason) {
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
        onEnabled: function () {
            this.enabled = true;
            // console.log('inside core onEnabled');
        },
        onDisabled: function () {
            this.enabled = false;
            // console.log('inside core onDisabled');
        },
        invoke: function (action, params) {
            var actionName = action + 'Action';
            if (typeof this[actionName] !== 'function') {
                throw 'Action Doesnt Exists : ' + actionName + ' ' + this.getName();
            }
            try {
                this[actionName].apply(this, params);
            } catch (e) {
                throw "Controller:invoke error while executing [" + actionName + "] in " + this.getName() + " controller " + e;
            }
        }
    });
    registerController = function (controllerName, ControllerDef) {
        if (false === ControllerDef.hasOwnProperty('appName')) {
            throw 'Controller Should Be Attached To An App';
        }
        var appName = ControllerDef.appName,
            Constructor = {},
            appControllers = controllerContainer[appName];
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
        if (!appControllers) {
            controllerContainer[appName] = {};
        }
        controllerContainer[appName][controllerName] = Constructor;
    };
    loadController = function (appName, controllerName) {
        var def = jQuery.Deferred(),
            cInstance = '',
            currentController;
        if (!appName || typeof appName !== 'string') {
            throw 'LoadController:appName Can\'t be null';
        }
        cInstance = controllerInstance[appName + ':' + controllerName];
        if (cInstance) {
            updateEnabledController(cInstance);
            def.resolve(cInstance);
        } else if (!cInstance) {
            
            currentController = new controllerContainer[appName][controllerName]();
            controllerInstance[appName + ':' + controllerName] = currentController;
            currentController.handleImport().then(function () {
                currentController.onInit(require);
                updateEnabledController(currentController);
                def.resolve(currentController);
            }).fail(def.reject);
        }
        return def.promise();
    };
    updateEnabledController = function (currentController) {
        if (currentController === enabledController) {
            return;
        }
        if (enabledController) {
            enabledController.onDisabled();
        }
        enabledController = currentController;
        enabledController.onEnabled();
    };
    getAppControllers = function (appName) {
        if (controllerContainer.hasOwnProperty(appName)) {
            return controllerContainer[appName];
        }
        throw 'Controller Not Found';
    };
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