var bb = bb || {};

/*... paths ... */
require.config({
    paths: {
        "bb.ApplicationManager" : "src/tb/core/bb.ApplicationManager",
        "bb.Mediator": "src/tb/core/bb.Mediator",
        "bb.RouteManager": "src/tb/core/bb.RouteManager",
        "bb.ViewManager": "src/tb/core/bb.ViewManager"
    }
});

define(["bb.ApplicationManager","bb.Mediator","bb.RouteManager","bb.ViewManager"], function(){
    var bb = {
        sayHello:  function(){
            console.log("sayHello");
        },
        
        test: function(){
            console.log("test");
        },
        
        radical: function(){
            console.log("radical");
        },
        
        init: function(config){}
    };
    return bb;
});