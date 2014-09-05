define([],function(){
    var _container = {};
    var _set = function(ctn,object){
        _container[ctn] = object; 
    }
    
    var _get = function(ctn){
        return _container[ctn];
    }
    
    return {
        register: _set,
        get: _get,
        dump: function(){
            return _container;
        }
    };
});

