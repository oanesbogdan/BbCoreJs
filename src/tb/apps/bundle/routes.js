define(["tb.core"], function (BbCore) {
    'use strict';

    /**
     * Register every routes of bundle application into BbCore.routeManager
     */
    BbCore.RouteManager.registerRoute("bundle", {
        prefix: "bundle",
        routes: {
            "bundle.list": {
                url: "/list",
                action: "BundleController:list"
            }
        }
    });
});
