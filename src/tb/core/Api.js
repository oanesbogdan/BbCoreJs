
define('tb.core.Api', [], function () {
    'use strict';

    var container = {},

        set = function (ctn, object) {
            container[ctn] = object;
        },

        get = function (ctn) {
            return container[ctn];
        };

    return {
        register: set,
        get: get,
        dump: function () {
            return container;
        }
    };
});
