define(["bb.Api","jquery","jsclass"], function(bbApi,$,jsClass){
    
    var _controllerContainer = {}; /* { appname: { }, appname_2:{}, appname_3:{} }; */
    var AbstractController = new JS.Class({
            
        initialize : function(){
            this.onInit();
        },
        
        /* handle import with */
        handleImport: function(){
            console.log("config",this.config);
        }
        
    });
    
    var _registerController  = function(controllerName,ControllerDef){
        var appname = ControllerDef.appname;
        if(!ControllerDef.hasOwnProperty("appname")) throw "ControllerShouldBeAttachedToAnApp";
        if(ControllerDef.hasOwnProperty("initialize")){ delete(ControllerDef.initialize);}
        var Constructor = new JS.Class(AbstractController,ControllerDef); 
        var  appControllers = _controllerContainer[ControllerDef.appname];
        if(!appControllers){
            _controllerContainer[appname]= {};
        }
        _controllerContainer[appname][controllerName] = Constructor;
    }        
    
    
var Api = {
    registerController: _registerController
};
    
return Api;
})