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


define(["require","jquery","bb.Utils","bb.AppContainer","bb.Api","BackBone","jsclass","bb.ControllerManager"], function(require){
     
    /* Abstract Application with Interface */
   
    /* dependence */
    var $ = require("jquery"),
    bbAppContainer = require("bb.AppContainer"),
    bbApi = require("bb.Api"),
    BackBone = require("BackBone"),
    bbUtils = require("bb.Utils"),
    ControllerManager = require("bb.ControllerManager");
        
    var _AppDefContainer = {};
    var _currentApplication = null;
    var _config = null; 
    var AppContainer  = bbAppContainer.getInstance();
    var ILifeCycle = new JS.Interface(["onInit","onStart","onStop","onResume"]);
    
    var AbstractApplication = new JS.Class({
        
        initialize : function(config){
            this.state = 0; 
            this.dependencies = ["" ,""];
            this.appControllers = this.registerControllers();
        },
        
      
        registerControllers : function(){
            try{
                return ControllerManager.getAppController();
            }catch(e){}
        /* loadController */
            
        },
        
        exposeMenu: function(){
            
        },
        
        dispatchToController: function(controller,action,params){
            console.log("inside application:DispatchToController");
            ControllerManager.loadController(this.getName(),controller).done(function(controller){
                try{
                    console.log("-- radical blaze --");
                    controller.invoke(action,params); 
                }catch(e){
                    console.log("loadController",e);   
                }
            });
        },
        
        setControllerMng: function(controllerMng){
            
        },
        
        onInit: function(){
            console.log("application init is called");
        },
        
        onStart: function(){
            console.log("on ... start is called");
        },
        
        onStop: function(){
            //dispatch to controller
            console.log("on ... stop is called");
        },
        
        onResume: function(){
            console.log(console.log("on ... resume is called"))
        },
        
        onError: function(e){
            console.log( "error in["+this.name+"] application");
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
        if(typeof(AppDef)!=="object") throw "ApplicationManager : appDef Is undefined";
        var ApplicationConstructor = new JS.Class(AbstractApplication,AppDef);
        
        /**
        *
        */
        ApplicationConstructor.define("getName",(function(name){
            return function(){
                this.name = name; 
                return name;
            }
        })(appname));
        if(_AppDefContainer[appname]) throw "AppAlreadyExists";
        _AppDefContainer[appname] = ApplicationConstructor; 
    }
    
    
    /* what is config*/
    var _init = function(config){
        _config = config;
        /* load apps here  */
        var appPaths = [];
        if(!("appPath" in config)) throw "InvalidAppConfig appPath is missing";
        if(!("applications" in config)) throw "InvalidAppConfig applciations is missing";
        $.each(config.applications,function(appname,conf){
            var completePath =  config.appPath+"/"+appname+"/main.js";
            appPaths.push(completePath);
        });
        bbUtils.requireWithPromise(appPaths).done(_appsAreLoaded).fail(_handleAppLoadingErrors);
    }
   
   /**
    * At the stage we are sure that all apps declared in applicationConfigs was loaded
    * We can then load the "active" app
    */
    var _appsAreLoaded = function(){
        var def = new $.Deferred();
        var mainAppConf = _config.applications[_config.active];
        var config = mainAppConf.config || config;
        _load(_config.active,config);
    }
    
    var _handleAppLoadingErrors = function(e){
        console.log("errors");
    }
    
    /**
     * Now we need to require
     **/
    var _load = function(appname,config){
        var completeAppname = ["app."+appname];
        bbUtils.requireWithPromise(completeAppname).done(function(){
        _lauchApplication(appname,config);  
        }).fail(function(){
            throw "Application["+completeAppname+"] can't be found";
        });
    }
    
    var _start = function(){
        console.log("start");
    }
    
    
    var _invoke =  function(actionInfos,params){
        var actionInfos = actionInfos.split(":");  
        var appPromise = this.lauchApplication(actionInfos[0]);
        /* triger event app is loading */
        appPromise.done(function(application){
            application.dispatchToController(actionInfos[1],actionInfos[2]);
        })
    /* init controller */            
    }
    var _lauchApplication = function(appname,config){
        try{
            console.log("appname "+appname);
            var dfd = new $.Deferred();
            config = config || {};
            if(_currentApplication && (_currentApplication.getName() == appname)){
                dfd.resolve(_currentApplication);
            }
            else{
                if(_currentApplication){
                    instance.onStop();
                }
                /* start or resume the new one */
                var applicationInfos = AppContainer.getByAppInfosName(appname);
                if(!applicationInfos){
                    var Application = _AppDefContainer[appname]; 
                    /* load application here load the main */
                    var instance = new Application(config); 
                    applicationInfos = {
                        instance : instance, 
                        name: appname
                    //state: 0
                    } 
                    AppContainer.register(applicationInfos); 
                    applicationInfos.instance.onStart(); 
                }else{
                    /* application already exists call ressume */
                    applicationInfos.instance.onResume();  
                }                
                _currentApplication = instance;
                dfd.resolve(_currentApplication); 
            }
            
        }catch(e){
            console.log(e);  
        }  
        return dfd.promise();
    }
    
    var Api = {
        registerApplication : _registerApplication,
        invoke: _invoke,
        lauchApplication: _lauchApplication, 
        init: _init,
        start: _start
    };
    
        
    bbApi.register("ApplicationManager",Api);
    return Api;
});