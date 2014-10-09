
define(["tb.core"], function (bbCore) {
    'use strict';

    bbCore.RouteManager.registerRoute("layout", {
        prefix: "appLayout",
        routes: {
            "default": {
                url: "home",
                action: "MainController:home"
            },

            "test": {
                url: "test",
                action: "TestController:test"
            },

            "list": {
                url: "showlist/:page/:section",
                action: "MainController:list",
                defaults: {
                    ":page": 45,
                    ":section": "books"
                }
            }
        }
    });
});
