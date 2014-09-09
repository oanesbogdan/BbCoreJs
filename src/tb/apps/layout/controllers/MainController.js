bb.ControllerManager.registerController("LayoutController",{
    appname: "layout",
    config: {
        imports: ["test.manager"]
    },
    /*Appelle init après les dépendences*/
    onInit: function(require){
        var manager  = require("bb.manager");
        var rteManager = require("bb.rte");
    },
    
    homeAction: function(){
        return this.render("#placeHolder","/path/template",{});
    },
    
    listAction: function(){
       alert("radical");
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
