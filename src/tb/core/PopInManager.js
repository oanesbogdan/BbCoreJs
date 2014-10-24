define('tb.core.PopInManager', ['tb.core.PopIn', 'jquery', 'jsclass', 'jqueryui'], function (PopIn, jQuery) {
    'use strict';

    var DEFAULT_POPIN_OPTIONS = {
            autoOpen: false
        },

        PopInManager = new JS.Class({

            popInId: 0,

            toolbarId: 'body',

            containerId: 'bb5-dialog-container',

            createPopIn: function (config) {
                var popIn = new PopIn(),
                    options = jQuery.extend({}, DEFAULT_POPIN_OPTIONS),
                    option = null,
                    id;

                config = typeof config === 'object' ? config : {};
                id = config.id;

                if (id === undefined) {
                    this.popInId = this.popInId + 1;
                    id = 'pop-in-' + this.popInId;
                } else {
                    delete config.id;
                }

                popIn.setId(id);

                for (option in config) {
                    if (config.hasOwnProperty(option)) {
                        options[option] = config[option];
                    }
                }

                options.appendTo = '#' + this.containerId;

                popIn.setOptions(options);

                return popIn;
            }

        }),

        manager = new PopInManager();

    return {

        init: function (toolbarId) {
            if (typeof toolbarId === 'string') {
                manager.toolbarId = toolbarId;
            }
        },

        createPopIn: function (options) {
            var popIn = manager.createPopIn(options),
                self = this;

            if (false === popIn.getOptions().hasOwnProperty('close')) {
                popIn.addOption('close', function () {
                    self.hide(popIn);
                });
            }

            return popIn;
        },

        createSubPopIn: function (parent, options) {
            var popIn = this.createPopIn(options);

            if (typeof parent === 'object' && typeof parent.isA === 'function' && parent.isA(PopIn)) {
                parent.addChild(popIn);
            } else {
                throw 'Provided parent is not a PopIn object';
            }

            return popIn;
        },

        display: function (popIn) {
            if (popIn.isClose()) {
                popIn.open();

                if (null === document.getElementById(manager.containerId)) {
                    jQuery(manager.toolbarId).append('<div id="' + manager.containerId + '"></div>');
                }

                if (jQuery('#' + popIn.getId()).length === 0) {
                    jQuery('#' + manager.containerId).append('<div id="' + popIn.getId() + '"></div>');
                }

                jQuery('#' + popIn.getId()).html(popIn.getContent());
                jQuery('#' + popIn.getId()).dialog(popIn.getOptions());
                jQuery('#' + popIn.getId()).dialog('open');
            }
        },

        hide: function (popIn) {
            var child = null,
                children = null;

            if (popIn.isOpen()) {
                popIn.close();
                children = popIn.getChildren();
                jQuery('#' + popIn.getId()).dialog('close');

                for (child in children) {
                    if (children.hasOwnProperty(child)) {
                        this.hide(children[child]);
                    }
                }
            }
        },

        destroy: function (popIn) {
            var child = null,
                children = null;

            if (false === popIn.isDestroy()) {
                children = popIn.getChildren();

                if (popIn.isOpen()) {
                    jQuery('#' + popIn.getId()).dialog('close');
                }

                jQuery('#' + popIn.getId()).unbind();
                jQuery('#' + popIn.getId()).remove();

                for (child in children) {
                    if (children.hasOwnProperty(child)) {
                        this.destroy(children[child]);
                    }
                }

                popIn.destroy();
            }
        },

        toggle: function (popIn) {
            if (popIn.isOpen()) {
                this.hide(popIn);
            } else if (popIn.isClose()) {
                this.display(popIn);
            }
        }

    };

});
