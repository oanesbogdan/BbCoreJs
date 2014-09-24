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

define("tb.core.ApplicationManager", ["require","BackBone","jsclass","jquery","tb.core.Utils","tb.core.ApplicationContainer","tb.core.Core","tb.core.ControllerManager"], function(require){

    /* Abstract Application with Interface */

    /* dependence */
    var $ = require("jquery"),
    bbAppContainer = require("tb.core.ApplicationContainer"),
    bbApi = require("tb.core.Core"),
    BackBone = require("BackBone"),
    bbUtils = require("tb.core.Utils"),
    ControllerManager = require("tb.core.ControllerManager");


    var _AppDefContainer = {};
    var _currentApplication = null;
    var _config = null;
    var AppContainer  = bbAppContainer.getInstance();

    /* AbstractApplication  */
    var AbstractApplication = new JS.Class({
        config : {},
        initialize : function(config){
            _.extend(this, Backbone.Events);
            this.config = $.extend(true,this.config,config);
            this.state = 0;
            this.appControllers = this.registerControllers();
        },


        registerControllers : function(){
            try{
                return ControllerManager.getAppController();
            }catch(e){}
        /* loadController */
        },

        getMainRoute: function(){
            return this.config.mainRoute;
        },

        exposeMenu: function(){ },

        dispatchToController: function(controller,action,params){
            ControllerManager.loadController(this.getName(),controller).done(function(controller){
                try{
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
           this.trigger(this.getName()+":onStart");
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


    var _init = function(config){
        _config = config;
        /* load apps here  */
        var routePaths = [];
        var appPaths = [];

        if(!("appPath" in config)) throw "InvalidAppConfig appPath is missing";
        if(!("applications" in config)) throw "InvalidAppConfig applciations is missing";
        $.each(config.applications,function(appname,conf){
            var completePath =  config.appPath+"/"+appname+"/main.js";
            var completeRoutePath = appname+".routes";
            appPaths.push(completePath);
            routePaths.push(completeRoutePath);
        });
        bbUtils.requireWithPromise(appPaths)
        /* register app routes --> trigger routesLoaded*/
        .then($.proxy(_registerAppRoutes,null,routePaths))
        /* load*/
        .done(_appsAreLoaded).fail(_handleAppLoadingErrors);
    }

    /**
    * At the stage we are sure that all apps declared in applicationConfigs was loaded
    * And that the router was loaded
    * We can then load the "active" app
    */
    var _appsAreLoaded = function(){
        var mainAppConf = _config.applications[_config.active];
        var config = mainAppConf.config || config;
        return _load(_config.active,config).then(function(app){
            Api.trigger("appIsReady",app); //use mediator
        });
    }

    var _handleAppLoadingErrors = function(e){
        console.log('... handle specific app Error here ...');
    }

    var _registerAppRoutes = function(routes){
        var def = new $.Deferred();

        return bbUtils.requireWithPromise(routes).done(function(){
            Api.trigger("routesLoaded");
            def.resolve.apply(this,arguments);
        }).fail(function(reason){
            throw new Error("Error while Loading application routes"+reason);
        });
        return def.promise();
    }

    /* load the app */
    var _load = function(appname,config){
        var def = new $.Deferred();
        var completeAppname = ["app."+appname];
        bbUtils.requireWithPromise(completeAppname).done(function(){
            _lauchApplication(appname,config).done(def.resolve);
        }).fail(function(){
            throw "Application["+completeAppname+"] can't be found";
        });
        return def.promise();
    }

    var _start = function(){
        console.log("start");
    }


    var _invoke =  function(actionInfos,params){
        actionInfos = actionInfos.split(":");
        var appPromise = this.lauchApplication(actionInfos[0]);
        /* triger event app is loading */
        appPromise.done(function(application){
            application.dispatchToController(actionInfos[1],actionInfos[2]);
        }).fail(function(e){
            console.log(e)
        });
    /* init controller */
    }
    var _lauchApplication = function(appname,config){
        try{
            var dfd = new $.Deferred();
            config = config || {};
            if(_currentApplication && (_currentApplication.getName() == appname)){
                dfd.resolve(_currentApplication);
            }
            else{
                /** start or resume the new one */
                var applicationInfos = AppContainer.getByAppInfosName(appname);
                if(!applicationInfos){
                    var Application = _AppDefContainer[appname];
                    /** If app def can't be found */
                    if(!Application) return _load(appname);
                    /** stop currentApplication */
                    var instance = new Application(config);
                    applicationInfos = {
                        instance : instance,
                        name: appname
                    }

                    /** stop current application */
                    if(_currentApplication){
                        _currentApplication.onStop();
                    }
                    AppContainer.register(applicationInfos);
                    applicationInfos.instance.onStart();
                    instance = applicationInfos.instance;
                }else{
                    _currentApplication.onStop();
                    /** application already exists call resume */
                    applicationInfos.instance.onResume();
                    instance = applicationInfos.instance;
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
    /* application as an Event emitter */
    _.extend(Api, Backbone.Events);

    bbApi.register("ApplicationManager",Api);
    return Api;
});