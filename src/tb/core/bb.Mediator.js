/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(["bb.Api"],function(bbCore){
        
    var _containers = {};
    var _events = {};
    var _register = function(componentName,component){
        if(componentName in _containers) return;
        _containers[componentName] = component;
    }
        
    var _invoke = function(component,params){
        var dfd = new $.Defered();
        return dfd.promise();
    }
    
    var Api = {
        register: function(topic,callback){}, 
        invoke: function(){},
        publish: function(topic,params,save){}
    };
    bbCore.register("Mediator",Api);
    return Api;
});

