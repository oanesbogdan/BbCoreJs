define(['require', 'jquery', 'jsclass', 'datetimepicker', 'text!cs-templates/searchengine.tpl'], function (require, jQuery) {
    'use strict';
    var $ = jQuery,

        ContentSearchEngine = new JS.Class({
            defaultConfig: {
                datepickerClass: '.show-calendar',
                datepickerFieldClass: '.bb5-datepicker',
                beforeDateClass: '.before-date',
                afterDateClass: '.after-date',
                titleFieldClass: '.content-title',
                searchBtnClass: '.search-btn'
            },

            initialize: function (config) {
                this.config = $.extend({}, this.defaultConfig, config);
                $.extend(this, {}, Backbone.Events);
                this.widget = $(require('text!cs-templates/searchengine.tpl')).clone();
                this.initDatepicker();
                this.bindEvents();
            },

            initDatepicker: function () {
                this.widget.find(this.config.datepickerFieldClass).datetimepicker({
                    timepicker: false,
                    closeOnDateSelect: true,
                    format: "d/m/Y",
                    parentID: "#bb5-ui",
                    onSelectDate: function (ct, field) {
                        $(field).data('selectedTime', Math.ceil(ct.getTime() / 1000));
                    }
                });
            },

            showOrInitDateTimePicker: function (e) {
                var dateField = $(e.currentTarget).parents(".col-bb5-22").find(this.defaultConfig.datepickerFieldClass).eq(0);
                if (!$(dateField).data('datetimepicker')) {
                    this.initDatepicker();
                }
                $(dateField).datetimepicker('show');
            },

            bindEvents: function () {
                $(this.widget).on('click', this.config.datepickerClass, $.proxy(this.showOrInitDateTimePicker, this));
                $(this.widget).on('click', this.config.searchBtnClass, $.proxy(this.handleSearch, this));
            },

            render: function (container, positionMethod) {
                positionMethod = (typeof positionMethod === "string") ? positionMethod : 'html';
                if (container && jQuery(container).length) {
                    jQuery(container)[positionMethod](this.widget);
                } else {
                    return this.widget;
                }
            },

            handleSearch: function () {
                var criteria = {};
                criteria.title = $(this.config.titleFieldClass).eq(0).val();
                criteria.pubBefore = $(this.config.beforeDateClass).eq(0).data('selectedTime') || '';
                criteria.pubAfter = $(this.config.afterDateClass).eq(0).data('selectedTime') || '';
                if (criteria.title.length || criteria.pubBefore.length || criteria.pubAfter.length) {
                    this.trigger("doSeach", criteria);
                }
            }

        });
    return {
        createSearchEngine: function (config) {
            config = config || {};
            return new ContentSearchEngine(config);
        },
        ContentSearchEngine: ContentSearchEngine
    };
});