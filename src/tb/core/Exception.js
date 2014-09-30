require(['Backbone', 'tb.core.Api'], function (Backbone, Api) {
    'use strict';

    var Exception, throwException;

    /**
     * Exception is the base class for all BackBee toolbar exceptions
     */
    Exception = Backbone.Model.extend({
        /**
         * Default properties
         */
        defaults: {
            name: '',
            message: '',
            params: {},
            stack: this.getStack()
        },

        /**
         * Construct the exception
         */
        constructor: function () {
            this.exception = new Exception();
            this.name = '';
            this.message = '';
            this.params = {};
            this.stack = this.getStack();
        },

        /**
         * Set the properties of the exception
         * @param {string} name
         * @param {string} message
         * @param {object} params
         */
        raise: function (name, message, params) {
            this.name = name;
            this.message = message;
            this.params = params || {};
        },

        /**
         * Gets the stack trace
         * @returns {array}
         */
        getStack: function () {
            var err = new Error(),
                stack = err.stack.split("\n"),
                cleanStack = stack.slice(4),
                key;

            for (key in cleanStack) {
                if (cleanStack.hasOwnProperty(key)) {
                    cleanStack[key] = this.parseStackLine(cleanStack[key]);
                }
            }

            return cleanStack;
        },

        /**
         * Function to stock the Exception in Api.get('errors') and Api.get('lastError')
         * @param {Exception} error
         */
        pushError: function (error) {
            if (undefined === Api.get('errors')) {
                Api.register('errors', []);
            }

            Api.get('errors').push(error);
            Api.register('lastError', error);
        },

        /**
         * Function to parse a stak trace line
         * @param {string} line  Should be something like <call>@<file>:<lineNumber>
         * @returns {object}
         */
        parseStackLine: function (line) {
            var splitedLine = line.split('@'),
                call = line,
                file = 'undefined',
                lineNumber = 'undefined';

            if (2 === splitedLine.length) {
                call = splitedLine[0];
                splitedLine = splitedLine[1].split(':');
                if (3 ===  splitedLine.length) {
                    file = splitedLine[0] + ':' + splitedLine[1];
                    lineNumber = splitedLine[2];
                }
            }

            return {
                line: lineNumber,
                file: file,
                call: call
            };
        }
    });

    /**
     * Throw a new exception
     * @param {type} name
     * @param {type} message
     */
    throwException = function (name, message) {
        var error = new Exception();
        error.raise.apply(error, arguments);
        error.pushError(error);

        throw (name + ' : ' + message);
    };

    Api.register('Exception', throwException);
});
