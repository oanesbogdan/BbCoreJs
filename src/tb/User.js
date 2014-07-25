(function (window) {
    "use strict";

    require(['Backbone', 'tb/rest'], function (Backbone, rest) {
        var User = Backbone.Model.extend({
            digest: '',
            login: '',

        });
    })
}(window));