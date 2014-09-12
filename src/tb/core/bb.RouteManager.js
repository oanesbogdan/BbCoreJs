define(["bb.Api","BackBone","jsclass","bb.ApplicationManager"],function(bbApi,BackBone){
    var Router = BackBone.Router; 
    
    var bbApplicationManager = require("bb.ApplicationManager"); //use the mediator to avoid a circular dependency
    var _routerInstance = null; 
    var _routeAppMap = {};
    /**
     * > Router handle routes -> dispatch to application manager
     * Application manager
     **/
    
    BackBuilderRouter = new JS.Class({
        
        initialize: function(){
            this.routes = {}; 
            var ExtRouter = BackBone.Router.extend({
                execute: function(callback,args){
                    console.log("this is it");
                    /*trigger sont event here*/
                    if(typeof callback=="function") callback.apply(this,args);
                }
            });
            this.mainRouter = new ExtRouter({});
        },
        
        handleApplicationLinks : function(){
        },
        
        navigate: function(path,triggerEvent,updateRoute){
            var conf = {
                trigger:(triggerEvent) ? triggerEvent : true, 
                replace:(updateRoute)? updateRoute : true
            } ;
            this.mainRouter.navigate(path,conf);
        },
        
        genericRouteHandler: function(actionInfos,params){
            /* handle action here */
            bbApplicationManager.invoke(actionInfos);
        },
        
        registerRoute: function(routeInfos){
            var actionsName =  routeInfos.completeName.split(":");
            actionsName = actionsName[0];
            console.log(routeInfos.url);
            this.mainRouter.route(routeInfos.url,routeInfos.completeName,$.proxy(this.genericRouteHandler,this,actionsName+":"+routeInfos.action));
        }
    });  
   
  
    var Api = {
        
        registerRoute: function(appname,routeConf){
            var self = this;
            if(!routeConf.hasOwnProperty("routes")) throw "ARoutesKeyMustBeProvided";
            if(!$.isPlainObject(routeConf.routes)) throw "RoutesShouldBeAnObject";
            var routes = routeConf.routes; 
            var prefix = (typeof routeConf.prefix=="string")? routeConf.prefix : "";
            $.each(routes,function(name,routeInfos){
                var router = self.getRouter();
                if(prefix.length!=0){
                    var url = (routeInfos.url.indexOf("/")==0)?routeInfos.url.substring(1):routeInfos.url;
                    routeInfos.url = prefix+"/"+url;
                }
                routeInfos.completeName = appname+":"+name;  
                router.registerRoute(routeInfos);
            });
        },
          
        initRouter : function(conf){
            conf = conf || {};
            var router = this.getRouter();
            BackBone.history.start(conf);
            return router;
        },
        
        startRouter: function(){
            if(_routerInstance) return _routerInstance;
            else{
                _routerInstance = new BackBuilderRouter;
            }  
            return _routerInstance;
        },
        
        getRouter: function(){
            return this.startRouter();
        }
      
    };
    
    bbApi.register("RouteManager",Api);
    return Api;
});