define('tb.core.PopIn', ['jsclass'], function () {
    'use strict';

    /**
     * HIDDEN_STATE, OPEN_STATE and DESTROY_STATE are PopIn states constant possible value
     */
    var HIDDEN_STATE = 0,
        OPEN_STATE = 1,
        DESTROY_STATE = 2,

        /**
         * PopIn's class
         */
        PopIn = new JS.Class({

            /**
             * PopIn class constructor
             */
            initialize: function () {
                this.id = null;
                this.state = HIDDEN_STATE;
                this.content = '';
                this.options = {};
                this.children = [];
            },


            /**
             * Title property setter
             * @param {String} id
             * @return {PopIn} self
             */
            setId: function (id) {
                this.id = id;

                return this;
            },

            /**
             * Id property getter
             * @return {String}
             */
            getId: function () {
                return this.id;
            },

            /**
             * Title property setter
             * @param {String} title
             * @return {PopIn} self
             */
            setTitle: function (title) {
                this.options.title = title;

                return this;
            },

            /**
             * Title property getter
             * @return {String}
             */
            getTitle: function () {
                return this.options.title || '';
            },

            /**
             * Content property setter
             * @param {String} content
             * @return {PopIn} self
             */
            setContent: function (content) {
                this.content = content;

                return this;
            },

            /**
             * Content property getter
             * @return {String}
             */
            getContent: function () {
                return this.content;
            },

            /**
             * Add new child to children property
             * @param {PopIn} child
             * @throws raise exception if provided child is not a PopIn object
             * @return {PopIn} self
             */
            addChild: function (child) {
                if (typeof child === 'object' && typeof child.isA === 'function' && child.isA(PopIn)) {
                    this.children.push(child);
                } else {
                    throw 'PopIn::addChild only accept PopIn object.';
                }

                return this;
            },

            /**
             * Children property getter
             * @return {Object} object that contains every children of current pop-in
             */
            getChildren: function () {
                return this.children;
            },

            /**
             * Open current pop-in by changing its state to OPEN_STATE (= 1)
             * @return {PopIn} self
             */
            open: function () {
                if (this.state !== DESTROY_STATE) {
                    this.state = OPEN_STATE;
                }

                return this;
            },

            /**
             * Returns true if current pop-in state is equals to OPEN_STATE (= 1)
             * @return {Boolean}
             */
            isOpen: function () {
                return OPEN_STATE === this.state;
            },

            /**
             * Hides current pop-in by changing its state to HIDDEN_STATE (= 0)
             * @return {PopIn} self
             */
            close: function () {
                if (this.state !== DESTROY_STATE) {
                    this.state = HIDDEN_STATE;
                }

                return this;
            },

            /**
             * Returns true if current pop-in state is equals to HIDDEN_STATE (= 0)
             * @return {Boolean}
             */
            isClose: function () {
                return HIDDEN_STATE === this.state;
            },

            /**
             * Destroy current pop-in by changing its state and unset every properties except to state
             * @return {PopIn} self
             */
            destroy: function () {
                this.state = DESTROY_STATE;
                delete this.id;
                delete this.content;
                delete this.options;
                delete this.children;

                return this;
            },

            /**
             * Returns true if current pop-in state is equals to DESTROY_STATE (= 2)
             * @return {Boolean}
             */
            isDestroy: function () {
                return DESTROY_STATE === this.state;
            },

            /**
             * Options property setter
             * @param {Object} options
             * @return {PopIn} self
             */
            setOptions: function (options) {
                this.options = options;

                return this;
            },

            /**
             * Options property getter
             * @return {Object}
             */
            getOptions: function () {
                return this.options;
            },

            /**
             * Add new or override option into options property
             * @param {String} key
             * @param {Mixed}  value
             * @return {PopIn} self
             */
            addOption: function (key, value) {
                this.options[key] = value;

                return this;
            },

            /**
             * Add new button to current pop-in
             * @param {String}   label
             * @param {Function} callback
             * @return {PopIn} self
             */
            addButton: function (label, callback) {
                if (false === this.options.hasOwnProperty('buttons')) {
                    this.options.buttons = {};
                }

                this.options.buttons[label] = callback;

                return this;
            },

            /**
             * * Enable modal behavior for this pop-in
             * @return {PopIn} self
             */
            enableModal: function () {
                this.options.modal = true;

                return this;
            },

            /**
             * Disable modal behavior for this pop-in
             * @return {PopIn} self
             */
            disableModal: function () {
                this.options.modal = false;

                return this;
            },

            /**
             * Returns true if this pop-in is a modal, else false
             * @return {Boolean}
             */
            isModal: function () {
                return this.options.modal || false;
            },

            /**
             * Class property setter
             * @param {String} dialogClass new class value
             */
            setClass: function (dialogClass) {
                this.options.dialogClass = dialogClass;
            },

            /**
             * Class property getter
             * @return {String} return class property
             */
            getClass: function () {
                return this.options.dialogClass || '';
            }
        });

    return PopIn;
});
