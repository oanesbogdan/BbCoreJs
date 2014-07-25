(function (window) {
    "use strict";

    require(['Backbone', 'jQuery'], function (Backbone, jquery) {
        var Rest = Backbone.Model.extend({
            base_url: 'http://early.backbee.com',

            url: function () {
                return this.base_url + this.namespace;
            }
        });
    })
}(window));