define(["bb.core"],function(bbCore){
    bbCore.RouteManager.registerRoute("content",{
        prefix:"test",
        routes:{
            "name": {
                url: "/home",
                action: "MainController:home"
            },
      
            "params": {
                url: "/params",
                action: "MainController:params"
            },
       
            "list": {
                url: "/showlist/:page",
                action: "MainController:list"
            }     
        }
    });
    
});

