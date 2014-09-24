/*... core modules path ... */
require.config({
    paths: {
        "bb.Api": "build/toolbar.core.min",
        "bb.ApplicationManager": "build/toolbar.core.min",
        "bb.Mediator": "build/toolbar.core.min",
        "bb.RouteManager": "build/toolbar.core.min",
        "bb.ViewManager": "build/toolbar.core.min",
        "bb.ControllerManager": "build/toolbar.core.min",
        "bb.Utils": "build/toolbar.core.min"
    }
});

define([
        "bb.Api",
        "bb.ApplicationManager",
        "bb.Mediator",
        "bb.RouteManager",
        "bb.ViewManager",
        "bb.ControllerManager",
        "bb.Utils"
    ],
    function(bbApi){
        return bbApi.dump();
    }
);