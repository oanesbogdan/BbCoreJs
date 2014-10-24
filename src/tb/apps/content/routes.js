define(["tb.core"], function (bbCore) {
    'use strict';

    /**
     * Register every routes of content application into bbCore.routeManager
     */
    bbCore.RouteManager.registerRoute("content", {
        prefix: "appContent",
        routes: {
            "name": {
                url: "/home/harris", //when a prefix can be found prefix/home/harris
                action: "MainController:home"
            },

            "params": {
                url: "/params",
                action: "HomeController:params"
            },

            "list": {
                url: "/showlist/:page",
                action: "MainController:list"
            }
        }
    });
});
