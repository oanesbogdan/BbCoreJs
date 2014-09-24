define(["tb.core.Core"],function(bbCore){
    bbCore.RouteManager.registerRoute("content",{
        prefix: "appContent",
        routes: {
            "name": {
                url: "/home/harris",//when a prefix can be found prefix/home/harris
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
