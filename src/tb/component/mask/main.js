define(["require", "jsclass", 'jquery'], function (require) {

    var $ = require('jquery'),
    Mask = new JS.Class({

        defaultConfig: {
            loaderCls: 'bb5-overlay',
            message: 'Loading...'
        },

        initialize: function (config) {
            this.config = $.extend({}, this.defaultConfig, config);
            this.loader = this.buildLoader();
        },

        buildLoader: function () {
            var loader = $("<div/>").clone();
            $(loader).addClass(this.config.loaderCls);
            loader.css({
                'background-color': 'rgba(0, 0, 0, .7)',
                'color': 'white',
                'font-size': '14px',
                'height': '100%',
                'left': '0',
                'position': 'absolute',
                'text-align': 'center',
                'border': '1px solid bleue',
                'top': '0',
                'width': '100%'
            });
            $(loader).html('<i class="fa fa-spin fa-spinner"></i>' +this.config.message);
            return loader;
        },

        mask: function (content) {
            if(!content) throw "MaskException mask expect one parameter";
            var loader = $(content).find("."+this.config.loaderCls).eq(0);
            if(loader.length){
                return;
            }
            loader = $(this.loader).clone();
            $(content).append(loader);
        },

        unmask: function (content) {
            if(content){
                $(content).find("."+this.config.loaderCls).remove();
            }
        }
    });

    return {
        createMask: function (config) {
            config = config || {};
            return new Mask(config);
        },
        Mask: Mask

    }

});