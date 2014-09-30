define('tb.core.ControllerManager', ['tb.core.Api', 'jquery', 'jsclass', 'tb.core.Utils'], function (Api, jQuery) {
    'use strict';

    var controllerContainer = {}, /* { appName: { }, appName_2:{}, appName_3:{} }; */
        controllerInstance = {},
        AbstractController,
        registerController,
        loadController,
        getAppControllers,
        ControllerManager;

    /**
     * AbstractController Object
     */
    AbstractController = new JS.Class({
        /**
         * Controller initialisation
         */
        initialize: function () {
            this.state = 0;
        },

        /**
         * handle import with
         */
        handleImport: function () {
            console.log('config', this.config);
        },

        /**
         * Envent onEnabled
         */
        onEnabled: function () {
            console.log('inside I\'m there onStart');
        },

        /**
         * Envent onDisabled
         */
        onDisabled: function () {
            console.log('inside onResume');
        },

        /**
         * Invoke action
         * @param  {string} action [Action called]
         * @param  {array}  params [Action parameters]
         */
        invoke: function (action, params) {
            var actionName = action + 'Action';

            if (typeof this[actionName] !== 'function') {
                throw 'Action Doesnt Exists : ' + actionName + ' ' + this.getName();
            }
            this[actionName](params);
        }
    });

    /**
     * Register an Application Controller
     * @param  {string} controllerName [controller name]
     * @param  {object} ControllerDef  [controller defenition]
     */
    registerController = function (controllerName, ControllerDef) {
        if (false === ControllerDef.hasOwnProperty('appname')) {
            throw 'Controller Should Be Attached To An App';
        }

        var appName = ControllerDef.appName,
            Constructor = {},
            appControllers = controllerContainer[appName];

        if (ControllerDef.hasOwnProperty('initialize')) {
            delete (ControllerDef.initialize);
        }

        Constructor = new JS.Class(AbstractController, ControllerDef);

        /*define controller name */
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

    /**
     * Load a application controller
     * @param  {string} appName        [application name]
     * @param  {string} controllerName [controller name]
     * @return {[type]}                [a promise]
     */
    loadController = function (appName, controllerName) {
        var def = jQuery.Deferred(),
            cInstance = '',
            controller;

        if (!appName || (typeof appName !== 'string')) {
            throw 'LoadController:appName Can\'t be null';
        }

        cInstance = controllerInstance[appName + ':' + controllerName];

        if (cInstance) {
            def.resolve(cInstance);
        } else if (!cInstance) {
            controller = new controllerContainer[appName][controllerName]();
            controllerInstance[appName + ':' + controllerName] = controller;
            def.resolve(controller);
        }

        return def.promise();
    };

    /**
     * Get application controllers
     * @param  {string} appName         [application name]
     * @return {AbstractController}     [description]
     */
    getAppControllers = function (appName) {
        if (controllerContainer.hasOwnProperty(appName)) {
            return controllerContainer[appName];
        }

        throw 'Controller Not Found';
    };

    /**
     * [Api description]
     * @type {Object}
     */
    ControllerManager = {
        registerController: registerController,
        loadController: loadController,
        getAppController: getAppControllers,
        getAllControllers: function () {
            return controllerContainer;
        }
    };

    Api.register('ControllerManager', ControllerManager);
    return ControllerManager;
});