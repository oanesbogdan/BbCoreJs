define(["bb.Api","BackBone"], function(bbCore){
    var Api = {
        register: "", 
        get: ""
    };
    bbCore.register("ViewManager",Api);
    return Api;
});