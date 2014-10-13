/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define('tb.core.Mediator', ['tb.core.Api'], function (Api) {
    'use strict';

    var Component = function topic (callback, context) {
            this.callback = callback;
            this.context = context;
        },

        Mediator = function mediator () {
            this.topics = {};
            this.publicated = {};
        };

    Component.prototype.execute = function componentExecution () {
        if (this.context === undefined) {
            this.callback.apply(undefined, arguments);
        } else {
            this.callback.apply(this.context, arguments);
        }
    };

    Mediator.prototype.subscribe = function mediatorSubscribe (topic, callback, context) {
        var component = new Component(callback, context);

        if (!this.topics.hasOwnProperty(topic)) {
            this.topics[topic] = [];
        }

        this.topics[topic].push(component);

        if (this.publicated.hasOwnProperty(topic)) {
            component.execute(this.publicated[topic].args);
        }
    };

    Mediator.prototype.unsubscribe = function mediatorUnsubscribe (topic, callback, context) {
        var component = new Component(callback, context),
            i;

        if (this.topics.hasOwnProperty(topic)) {
            for (var i = 0; i < this.topics[topic].length; i = i + 1) {
                if(this.topics[topic][i] === component) {
                    this.topics[topic].splice(i, 1);
                }
            }
        }
    };

    Mediator.prototype.publish = function mediatorPublish () {
        var args = Array.prototype.slice.call(arguments),
            topic = args.shift(),
            i;

        if(!this.topics.hasOwnProperty(topic)) {
            for(i = 0; i < this.topics[topic].length; i = i + 1) {
                try {
                    this.topics[topic][i].execute(args);
                } catch {
                    Api.logger.warning();
                }
            }
        }
    };

    Mediator.prototype.percistantPublish = function mediatorPublish () {
        var args = Array.prototype.slice.call(arguments),
            topic = args.shift();

        this.publish.apply(this, arguments);

        this.publicated[topic] = {
            args: args
        };
    };

    Mediator.prototype.removePublish = function mediatorRemovePublication (topic) {
        this.publicated[topic] = null;
        delete this.publicated[topic];
    };

    Api.register('Mediator', Mediator);

    return Mediator;
});

