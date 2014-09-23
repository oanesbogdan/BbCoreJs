define(['bb.Api', 'jquery', 'jsclass', 'bb.Utils'], function (bbApi, jQuery, jsClass, Utils) {

    var _controllerContainer = {}, /* { appName: { }, appName_2:{}, appName_3:{} }; */

        _controllerInstance = {},

        CONTROLLER_PATH = 'src/tb/apps/';

        /**
         * AbstractController Object
         */
        AbstractController = new JS.Class({
            /**
             * Controller initialisation
             */
            initialize : function () {
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
             * @return {[type]}        [description]
             */
            invoke: function (action, params) {
                var actionName = action + 'Action';

                if (typeof this[actionName] !== 'function') {
                    throw 'Action Doesnt Exists : ' + actionName + ' ' + this.getName();
                }
                this[actionName](params);
            }
        }),

        /**
         * Register an Application Controller
         * @param  {string} controllerName [controller name]
         * @param  {object} ControllerDef  [controller defenition]
         */
        _registerController  = function (controllerName, ControllerDef) {
            var appName = ControllerDef.appName,

                Constructor = {},

                appControllers = _controllerContainer[appName];

            if (!ControllerDef.hasOwnProperty('appName')) {
                throw 'Controller Should Be Attached To An App';
            }

            if (ControllerDef.hasOwnProperty('initialize')) {
                delete(ControllerDef.initialize);
            }

            Contructor = new JS.Class(AbstractController, ControllerDef);

            /*define controller name */
            Constructor.define('getName', (function (name) {
                return function () {
                    return name;
                }
            }) (controllerName));

            if (!appControllers) {
                _controllerContainer[appName] = {};
            }

            _controllerContainer[appName][controllerName] = Constructor;
        },

        /**
         * Load a application controller
         * @param  {string} appName        [application name]
         * @param  {string} controllerName [controller name]
         * @return {[type]}                [a promise]
         */
        _loadController = function (appName, controllerName) {
            var def = jQuery.Deferred(),

                cInstance = '';

            if(!appName || (typeof appName !== 'string')) {
                throw 'LoadController:appName Can\'t be null';
            }

            cInstance = _controllerInstance[appName + ':' + controllerName];

            if (cInstance) {
                def.resolve(cInstance);
            } else if (!cInstance) {
                var controller = new _controllerContainer[appName][controllerName]();

                _controllerInstance[appName + ':' + controllerName] = controller;
                def.resolve(controller);
            }

            return def.promise();
        },

        /**
         * Get application controllers
         * @param  {string} appName         [application name]
         * @return {AbstractController}     [description]
         */
        _getAppControllers = function(appName){
            if(_controllerContainer.hasOwnProperty(appName)){
                return _controllerContainer[appName];
            }

            throw 'Controller Not Found';
        },

        /**
         * [Api description]
         * @type {Object}
         */
        Api = {
            registerController: _registerController,
            loadController: _loadController,
            getAppController: _getAppControllers,
            getAllControllers: function () {
                return _controllerContainer;
            }
        };

    bbApi.register('ControllerManager', Api);
    return Api;
})