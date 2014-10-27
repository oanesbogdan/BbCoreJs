define('tb.core.ControllerManager', ['require', 'tb.core.Api', 'tb.core.ApplicationContainer', 'jquery', 'jsclass', 'tb.core.Utils'], function (require) {
    'use strict';
    var Api = require('tb.core.Api'),
        jQuery = require('jquery'),
        bbUtils = require('tb.core.Utils'),
        appContainer = require("tb.core.ApplicationContainer"),
        controllerContainer = {},
        controllerInstance = {},
        enabledController = null,
        initController, AbstractController, registerController, loadController, getAppControllers, updateEnabledController, computeControllerName, $ = jQuery,
        ControllerManager;
    AbstractController = new JS.Class({
        initialize: function () {
            this.state = 0;
            this.enabled = false;
            var appInfos = appContainer.getInstance().getByAppInfosName(this.appName);
            this.mainApp = appInfos.instance;
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
    computeControllerName = function (controllerName) {
        var ctlName = "",
            controllerPos;
        controllerPos = controllerName.indexOf("Controller");
        if (controllerPos !== -1) {
            controllerName = controllerName.substring(0, controllerPos);
            ctlName = controllerName.toLowerCase() + '.controller';
        }
        if (ctlName.length === 0) {
            throw "Invalid controller name. Valid name example";
        }
        return ctlName;
    };
    loadController = function (appName, controllerName) {
        var fullControllerName = appName + "." + computeControllerName(controllerName),
            def = jQuery.Deferred(),
            cInstance = '';
        if (!appName || typeof appName !== 'string') {
            throw 'LoadController:appName Can\'t be null';
        }
        cInstance = controllerInstance[fullControllerName];
        if (cInstance) {
            updateEnabledController(cInstance);
            def.resolve(cInstance);
        } else if (!cInstance) {
            if (typeof controllerContainer[appName][controllerName] === 'function') {
                initController(appName, controllerName, def);
            } else {
                bbUtils.requireWithPromise([fullControllerName]).done(function () {
                    initController(appName, controllerName, def);
                }).fail(def.reject);
            }
        }
        return def.promise();
    };
    initController = function (appName, controllerName, def) {
        var currentController, fullControllerName = appName + '.' + computeControllerName(controllerName);
        currentController = new controllerContainer[appName][controllerName]();
        controllerInstance[fullControllerName] = currentController;
        currentController.handleImport().then(function () {
            currentController.onInit(require);
            updateEnabledController(currentController);
            def.resolve(currentController);
        });
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