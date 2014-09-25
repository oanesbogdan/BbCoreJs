/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define('tb.core.Mediator', ['tb.core.Api'], function (bbCore) {

    var _containers = {},

        _events = {},

        /**
         * [_register description]
         * @param  {[type]} componentName [description]
         * @param  {[type]} component     [description]
         * @return {[type]}               [description]
         */
        _register = function (componentName, component) {
            if (componentName in _containers) {
                return;
            }
            _containers[componentName] = component;
        },

        /**
         * [_invoke description]
         * @param  {[type]} component [description]
         * @param  {[type]} params    [description]
         * @return {[type]}           [description]
         */
        _invoke = function (component, params) {
            var dfd = new jQuery.Defered();

            return dfd.promise();
        },

        Api = {
            register: function (topic, callback) {},
            invoke: function () {},
            publish: function (topic, params ,save) {}
        };

    bbCore.register('Mediator', Api);

    return Api;
});

