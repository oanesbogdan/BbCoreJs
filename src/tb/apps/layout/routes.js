define(["bb.core"],function(bbCore){
    bbCore.RouteManager.registerRoute("layout",{
        prefix: "layout",
        routes: {
            "name": {
                url: "home",
                action: "MainController:home"
            },
      
            "test": {
                url: "test",
                action: "TestController:test"
            },
      
            "firsname": {
                url: "showlist/:page",
                action: "MainController:list"
            }     
        }
    });
});
