define(['require', 'BackBone', 'jquery', 'jsclass', 'tb.core.DriverHandler', 'tb.core.RestDriver'], function (require) {

    var CoreDriverHandler = require('tb.core.DriverHandler'),
    $ = require('jquery'),
    CoreRestDriver = require('tb.core.RestDriver'),

    ContentRepository = new JS.Class({
        defaultConfig: {
            autoLoad: false
        },
        
        initalize : function (config) {
            config = config || {};
            this.config = $.extend({}, this.defaultConfig, config);
            $.extend(this, {}, BackBone.Events);
            this.data = new SmartList();
            this.initRestHandler();
        },

        initRestHandler: function() {
            CoreRestDriver.setBaseUrl('/rest/1');
            CoreDriverHandler.addDriver('rest', CoreRestDriver);
        },

        load: function () {},

        find: function () {},

        findWhere: function (criteria, pager, order) {
            CoreDriverHandler.read(this.config.resourceEndpoint,{category : "article"})
        }

    });






});