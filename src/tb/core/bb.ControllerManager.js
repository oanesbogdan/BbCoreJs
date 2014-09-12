define(["bb.Api","jquery","jsclass","bb.Utils"], function(bbApi,$,jsClass,Utils){
    
    var _controllerContainer = {}; /* { appname: { }, appname_2:{}, appname_3:{} }; */
    var _controllerInstance = {}; 
    var CONTROLLER_PATH = "src/tb/apps/";
    var AbstractController = new JS.Class({
            
        initialize : function(){
            this.state = 0;
        },
        
        /* handle import with */
        handleImport: function(){
            console.log("config",this.config);
        },

        onEnabled: function(){
            console.log("inside I'm there onStart");
        },
        
        onDisabled: function(){
            console.log("inside onResume");
        },
        
        invoke: function(action,params){
            var actionName = action+"Action";
            if(typeof this[actionName]!=="function") throw "ActionDoesntExists["+actionName+"]["+this.getName()+"]";
            this[actionName](params);            
        }
    });
    
    var _registerController  = function(controllerName,ControllerDef){
        var appname = ControllerDef.appname;
        if(!ControllerDef.hasOwnProperty("appname")) throw "ControllerShouldBeAttachedToAnApp";
        if(ControllerDef.hasOwnProperty("initialize")){
            delete(ControllerDef.initialize);
        }
        var Constructor = new JS.Class(AbstractController,ControllerDef); 
        
        /*define controller name */
        Constructor.define("getName",(function(name){
            return function(){
                return name;
            }
        })(controllerName));
        
        var  appControllers = _controllerContainer[ControllerDef.appname];
        if(!appControllers){
            _controllerContainer[appname]= {};
        }
        _controllerContainer[appname][controllerName] = Constructor;
    }        
    
    var _loadController = function(appname,controllerName){
        var def = $.Deferred();
        if(!appname || (typeof appname!="string")) throw "LoadController:appname Can't be null";
       
        var cInstance = _controllerInstance[appname+":"+controllerName];
        if(cInstance){
            def.resolve(cInstance);  
        }
        else if(!cInstance){
            var controller = new _controllerContainer[appname][controllerName]();
            _controllerInstance[appname+":"+controllerName] = controller;
            def.resolve(controller);
        }
        return def.promise();
    }
    
    
    var _getAppControllers = function(appName){
        if(_controllerContainer.hasOwnProperty(appName)){
            return _controllerContainer[appName]; 
        }
        throw "ControllerNotFound";
    }
    
    var Api = {
        registerController: _registerController,
        loadController: _loadController,
        getAppController:_getAppControllers,
        getAllControllers: function(){
            return _controllerContainer;
        }
    };
    
    bbApi.register("ControllerManager",Api);
    return Api;
})