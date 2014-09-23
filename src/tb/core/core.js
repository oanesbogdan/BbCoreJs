define([], function () {
    var _container = {},

        _set = function (ctn, object) {
            _container[ctn] = object;
        },

        _get = function(ctn){
            return _container[ctn];
        }

    return {
        register: _set,
        get: _get,
        dump: function () {
            return _container;
        }
    };
});

