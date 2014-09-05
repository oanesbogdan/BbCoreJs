/**
 * bb.ApplicationManager
 * Responsability
 *  - provide an application skeleton
 *  - What is an application
 *  Application handle views
 *  [-View 1]
 *  [-View 2]
 *  [-View 3]
 *  [-View 4]
 *  application recieves requests via route
 *  
 *  /#layout/create ---> route is handled by Application Route
 *                      ---> Then controller is called
 *                          ---> Then the right method is invoked
 *                              --> The right template
 *  
 *  Application can déclare many controller BackBone Controllers
 *  Application Manager
 **/
define("bb.AppContainer",["jquery","jsclass","bb.Api"],function($){
    var instance = null;  
    
    var AppContainer = new JS.Class({
        
        initialize: function(){
            this.container = [];   
        },
        
        /** {name:"appname",instance:"",state} **/
        register : function(applicationInfos){
            this.container.push(applicationInfos);
        },
        
        getByAppInfosName : function(name){
            var result = null;
            $.each(this.container,function(i, appInfos){
                if(appInfos.name==name){
                    result = appInfos;
                    return false;
                }
            });
            return result;
        }
        
    });
    
    return {
        getInstance : function(){
            if(!instance){
                instance = new AppContainer;  
            }
            return instance;
        }
        
    }
    
});


define(["jquery","bb.AppContainer","bb.Api","BackBone","jsclass"], function($,bbAppContainer,bbCore,BackBone,jsclass){
     
    /* Abstract Application with Interface */
    var _AppDefContainer = {};
    var _currentApplication = null;
    var AppContainer  = bbAppContainer.getInstance();
    var ILifeCycle = new JS.Interface(["onInit","onStart","onStop","onResume"]);
    
    var AbstractApplication = new JS.Class({
        
        initialize : function(config){
            this.title = "";
            this.name = ("name" in config) ? config.name:"";
            this.state = 0; 
            this.dependencies = ["" ,""];
            this.controllers = [];
        },
        
        getMenu: function(){
            
        },
        
        onInit: function(){
            console.log("application init is called");
        },
        
        onStart: function(){
            console.log("on ... start is called");
        },
        
        onStop: function(){
            console.log("on ... stop is called")
        },
        
        onResume: function(){
            console.log(console.log("on ... resume is called"))
        }
        
    });
        
    /* clean app definition by removing */
    var _cleanDefinition = function(definition){
        var forbidenActions = [];
        for(var prop in definition){
           
            }
    }
    /*url --> router --> appManager --> controller --> action*/
    /**
     * var app = getAppByRoute(route)
     * app.invoke(controller:action)
     *  - controller.init execute ation
     *
     **/
    var _registerApplication = function(appname,AppDef){
        try{
            if(typeof(AppDef)!=="object") throw "ApplicationManager : appDef Is undefined";
            var applicationConstructor = new JS.Class(AbstractApplication,AppDef);   
            _AppDefContainer[appname] = applicationConstructor;
        }catch(e){
            console.log("exception"+e);
        }        
    }
    
    var Api = {
        
        registerApplication : _registerApplication,
        
        lauchApplication: function(appname,config){
            try{
                /* stop current application */
                if(_currentApplication){
                    instance.onStop(); //trigger events?
                }
                
                /* start or resume the new one */
                var applicationInfos = AppContainer.getByAppInfosName(appname);
                if(!applicationInfos){
                    var Application = _AppDefContainer[appname]; 
                    var instance = new Application(config); 
                    applicationInfos = {
                        instance : instance, 
                        name: appname,
                        state: 0
                    } 
                   applicationInfos.instance.onStart(); 
                }else{
                    /* application already exists call ressume */
                    applicationInfos.instance.onResume();  
                }
                
                _currentApplication = instance;
                AppContainer.register(applicationInfos); 
            }catch(e){
                console.log("exception"+e);  
            }
        },
        
        getApplicationList: function(){
            return _AppDefContainer;
        }
    };
    
        
    bbCore.register("ApplicationManager",Api);
    return Api;
});