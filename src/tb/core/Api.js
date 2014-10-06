
define('tb.core.Api', [], function () {
    'use strict';

    var container = {},

        api = {
            register:  function (ctn, object) {
                var key;
                for (key in this) {
                    if (this.hasOwnProperty(key) && key === ctn) {
                        return;
                    }
                }
                this[ctn] = object;
            },

            set: function (ctn, object) {
                container[ctn] = object;
            },

            get: function (ctn) {
                return container[ctn];
            },

            unset: function (ctn) {
                this.container[ctn] = null;
                delete container[ctn];
            }
        };

    return api;
});
