/*... core modules path ... */
require.config({
    paths: {
        "tb.core.Core": "build/toolbar.core.min",
        "tb.core.ApplicationManager": "build/toolbar.core.min",
        "tb.core.Mediator": "build/toolbar.core.min",
        "tb.core.RouteManager": "build/toolbar.core.min",
        "tb.core.ViewManager": "build/toolbar.core.min",
        "tb.core.ControllerManager": "build/toolbar.core.min",
        "tb.core.Utils": "build/toolbar.core.min"
    }
});

define(
    [
        "tb.core.Core",
        "tb.core.ApplicationManager",
        "tb.core.Mediator",
        "tb.core.RouteManager",
        "tb.core.ViewManager",
        "tb.core.ControllerManager",
        "tb.core.Utils"
    ],
    function(bbApi){
        return bbApi.dump();
    }
);