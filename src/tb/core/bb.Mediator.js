/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define([],function(){
        
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
        register: "", 
        invoke: "",
        publish: ""
    };
    bb.Mediator = Api;
    return Api;
});

