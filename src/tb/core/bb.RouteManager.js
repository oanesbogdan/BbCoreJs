define(["bb.Api","BackBone","jsclass","bb.ApplicationManager"],function(bbApi,BackBone){
    var Router = BackBone.Router; 
    
    var bbApplicationManager = require("bb.ApplicationManager"); 
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
                    /*trigger sont event here*/
                    if(typeof callback=="function") callback.apply(this,args);
                }
            });
            this.mainRouter = new ExtRouter({});
        },
        
        handleApplicationLinks : function(){
        },
        
        navigateTo: function(){
            
        },
        
        genericRouteHandler: function(actionInfos,params){
            /* handle action here */
            bbApplicationManager.invoke(actionInfos);
        },
        
        registerRoute: function(routeInfos){
            var actionsName =  routeInfos.completeName.split(":");
            actionsName = actionsName[0];
            this.mainRouter.route(routeInfos.url,routeInfos.completeName,$.proxy(this.genericRouteHandler,this,actionsName+":"+routeInfos.action));
        }
    });  
   
   var _handleRoute = function(){
       alert("radical blaze");
   } 
   
    var Api = {
        
        registerRoute: function(appname,routeConf){
            var self = this;
            if(!routeConf.hasOwnProperty("routes")) throw "ARoutesKeyMustBeProvided";
            if(!$.isPlainObject(routeConf.routes)) throw "RoutesShouldBeAnObject";
            var routes = routeConf.routes; 
            var prefix = (typeof routeConf.prefix=="string")? routeConf.prefix : "";
            $.each(routes,function(name,routeInfos){
                var router = self.startRouter();
                routeInfos.completeName = appname+":"+prefix+":"+name; 
                router.registerRoute(routeInfos);
            });
        },
          
        initRouter : function(){
            this.startRouter();
            BackBone.history.start();
        },
        
        startRouter: function(){
            if(_routerInstance) return _routerInstance;
            else{
                _routerInstance = new BackBuilderRouter;
            }  
            return _routerInstance;
        }
    };
    
    bbApi.register("RouteManager",Api);
    return Api;
});