/*... core modules path ... */
require.config({
    paths: {
        "bb.Api":"src/tb/core/core",
        "bb.ApplicationManager" : "src/tb/core/bb.ApplicationManager",
        "bb.Mediator": "src/tb/core/bb.Mediator",
        "bb.RouteManager": "src/tb/core/bb.RouteManager",
        "bb.ViewManager": "src/tb/core/bb.ViewManager",
        "bb.ControllerManager": "src/tb/core/bb.ControllerManager",
        "bb.Utils": "src/tb/core/bb.Utils"
    }
});

define(["bb.Api",
    "bb.ApplicationManager",
    "bb.Mediator",
    "bb.RouteManager",
    "bb.ViewManager",
    "bb.ControllerManager",
    "bb.Utils"], function(bbCore){
        return bbCore.dump();
    });