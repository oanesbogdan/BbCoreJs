define(['require', 'jsclass', 'jquery', 'underscore', 'BackBone'], function (require, jsclass, jQuery, underscore, BackBone) {


    var PageRangeSelector = new JS.Class({

        defaultConfig : {
            range: [1, 50],
            cls : 'max-per-page-selector input-xs',
            optionCls: 'page',
            css: {}
        },

        initialize: function (userConfig) {
            userConfig = userConfig ||  {};
            this.config = jQuery.extend({}, this.defaultConfig, userConfig);
            jQuery.extend(this, {}, BackBone.Events);
            this.widget = $("<select/>");
            this.widget.addClass(this.config.cls);
            this.updateUi();
            this.bindEvents();
        },

        updateUi: function () {
            var self = this,
            optionsFragment = document.createDocumentFragment(),
            start = this.config.range[0] || 10,
            stop = this.config.range[1] + 10 || 60,
            step = (this.config.range[2])? this.config.range[2] : 10;
            var options =  underscore.range(start, stop, step);
            $.each(options, function(i, value) {
                var option = $('<option/>')
                .val(value)
                .text(value)
                .addClass(self.config.optionCls);
                optionsFragment.appendChild($(option).get(0));
            });
            this.widget.append($(optionsFragment));
        },

        bindEvents: function () {

        },

        select: function (val, silent) {
            val = parseInt(val);
            silent = (typeof silent==='boolean') ? silent : false;
            this.widget.val(val);
            this.currentStep = val;
            if (!silent) {
                this.handleChange.call(this, this, {});
            }
        },

        setRange: function (range) {
            this.config.range = range;
        },

        handleChange: function (selector, e) {
            selector.currentStep = this.val();
            selector.trigger('pageRangeSelectorChange', selector.currentStep);
        },

        getValue: function () {
            return this.currentStep;
        },

        bindEvents: function () {
           this.widget.on('change', $.proxy(this.handleChange, this.widget, this));
        },

        render: function (container, positionMethod) {
            positionMethod = (typeof positionMethod==="string") ? positionMethod : 'html';
            if (container && jQuery(container).length) {
                jQuery(container)[positionMethod](this.widget);
            }else{
                return this.widget;
            }
        }
});

return {
    createPageRangeSelector: function (config) {
        config = config || {};
        return new PageRangeSelector(config);
    }
};


});