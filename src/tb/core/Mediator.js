/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define('tb.core.Mediator', ['tb.core.Api', 'jquery'], function (Api, jQuery) {
    'use strict';

    var containers = {},

        events = {},

        /**
         * [register description]
         * @param  {[type]} componentName [description]
         * @param  {[type]} component     [description]
         * @return {[type]}               [description]
         */
        register = function (componentName, component) {
            if (containers.hasOwnProperty(componentName)) {
                return;
            }

            containers[componentName] = component;
        },

        /**
         * [invoke description]
         * @param  {[type]} component [description]
         * @param  {[type]} params    [description]
         * @return {[type]}           [description]
         */
        invoke = function (component, params) {
            var dfd = new jQuery.Defered();

            console.log(component);
            console.log(params);

            return dfd.promise();
        },

        Mediator = {
            register: function (topic, callback) {
                console.log(topic);
                console.log(callback);
                return;
            },
            invoke: function () {
                return;
            },
            publish: function (topic, params, save) {
                console.log(topic);
                console.log(params);
                console.log(save);
                return;
            }
        };

    Api.register('Mediator', Mediator);

    console.log(events);
    console.log(register);
    console.log(invoke);

    return Mediator;
});

