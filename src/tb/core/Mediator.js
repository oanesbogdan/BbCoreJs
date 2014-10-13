/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define('tb.core.Mediator', ['tb.core.Api'], function (Api) {
    'use strict';

    var Component = function topic(callback, context) {
            this.callback = callback;
            this.context = context;
        },

        Mediator = function mediator() {
            this.topics = {};
            this.publicated = {};
        };

    /**
     * Component execution callback
     * @return {undefined}
     */
    Component.prototype.execute = function componentExecution() {
        if (this.context === undefined) {
            this.callback.apply(undefined, arguments);
        } else {
            this.callback.apply(this.context, arguments);
        }
    };

    /**
     * Subscribe to a topic
     * @param  {String}   topic    [description]
     * @param  {Function} callback [description]
     * @param  {Object}   context  [description]
     * @return {undefined}
     */
    Mediator.prototype.subscribe = function mediatorSubscribe(topic, callback, context) {
        var component = new Component(callback, context);

        if (!this.topics.hasOwnProperty(topic)) {
            this.topics[topic] = [];
        }

        this.topics[topic].push(component);

        if (this.publicated.hasOwnProperty(topic)) {
            component.execute.apply(component, this.publicated[topic].args);
        }
    };

    /**
     * Unsubscribe to a topic
     * @param  {String}   topic    [description]
     * @param  {Function} callback [description]
     * @param  {Object}   context  [description]
     * @return {undefined}
     */
    Mediator.prototype.unsubscribe = function mediatorUnsubscribe(topic, callback) {
        var i;

        if (this.topics.hasOwnProperty(topic)) {
            for (i = 0; i < this.topics[topic].length; i = i + 1) {
                if (this.topics[topic][i].callback === callback) {
                    this.topics[topic].splice(i, 1);
                }
            }
        }
    };

    /**
     * Publish a topic
     * @return {undefined}
     */
    Mediator.prototype.publish = function mediatorPublish() {
        var args = Array.prototype.slice.call(arguments),
            topic = args.shift(),
            i;

        if (this.topics.hasOwnProperty(topic)) {
            for (i = 0; i < this.topics[topic].length; i = i + 1) {
                try {
                    this.topics[topic][i].execute.apply(this.topics[topic][i], args);
                } catch (e) {
                    Api.logger.error('Mediator as catch an error on "' + topic + '" topic with the following message: "' + e + '"');
                }
            }
        }
    };

    /**
     * Publish a topic and keep this topic in memory
     * @return {undefined}
     */
    Mediator.prototype.percistantPublish = function mediatorPercistantPublish() {
        var args = Array.prototype.slice.call(arguments),
            topic = args.shift();

        this.publish.apply(this, arguments);

        this.publicated[topic] = {
            args: args
        };
    };

    /**
     * Remove a topic publish
     * @param  {String} topic [description]
     * @return {undefined}
     */
    Mediator.prototype.removePublish = function mediatorRemovePublication(topic) {
        this.publicated[topic] = null;
        delete this.publicated[topic];
    };

    Api.register('Mediator', new Mediator());
});

