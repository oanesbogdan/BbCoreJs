bb.application.registerController("LayoutController",{
    
    config: {
        imports: ["test.manager"]
    },
    /*Appelle init après les dépendences*/
    onInit: function(require){
        var manager  = require("bb.manager");
        var rteManager = require("bb.rte");
    },
    
    showAction: function(){
        return this.render("#placeHolder","/path/template",{});
    },
    
    displayLayoutAction: function(){
        var layouts = new Layout();
        var self = this; 
        this.loadTemplate("/path/template").done(function(tpl){
            self.render(tpl,{
                layout:layouts
            });
        });
    }
    
});

/* Abstract controller */
define(["jsCore","BackBone"], function(){
    var _controllersCtn = {};
    
    var ControllerFactory = (function(){
        
        var api = {
            registerController: function(ctlName,config){}
        }
        
        return api;
    })();
    
    return ControllerFactory;
});
