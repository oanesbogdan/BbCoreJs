define(['Core', 'jquery', 'component!translator', 'jsclass'], function (Core, jQuery, Translator) {
    'use strict';
    var Mask = new JS.Class({
        defaultConfig: {
            loaderCls: 'bb-overlay',
            message: Translator.translate('loading'),
            css: {}
        },

        initialize: function (config) {
            this.config = jQuery.extend({}, this.defaultConfig, config);
            this.loader = this.buildLoader();
        },

        buildLoader: function () {
            var loader = jQuery("<div/>").clone(),
                key;

            jQuery(loader).addClass(this.config.loaderCls);
            jQuery(loader).html('<i class="fa fa-spin fa-spinner"></i>' + this.config.message);

            for (key in this.config.css) {
                if (this.config.css.hasOwnProperty(key)) {
                    jQuery(loader).css(key, this.config.css[key]);
                }
            }

            return loader;
        },

        mask: function (content) {
            if (!content) {
                Core.exception('MaskException', 466241, '[mask] expects one parameter');
            }
            var loader = jQuery(content).find("." + this.config.loaderCls).eq(0);
            if (loader.length) {
                return;
            }
            loader = jQuery(this.loader).clone();
            jQuery(content).append(loader);
        },

        hasMask: function (content) {
            return jQuery(content).find("." + this.config.loaderCls).eq(0).length;
        },

        unmask: function (content) {
            if (content) {
                jQuery(content).find("." + this.config.loaderCls).remove();
            }
        }
    });
    return {
        createMask: function (config) {
            config = config || {};
            return new Mask(config);
        },
        Mask: Mask
    };
});