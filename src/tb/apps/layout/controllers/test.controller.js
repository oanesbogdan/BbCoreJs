define(["tb.core"], function(bbCore){
    bbCore.ControllerManager.registerController("TestController",{
        appname: "layout",
        config: {
            imports: ["test.manager","rte.manager"]
        },
        /*Appelle init après les dépendences*/
        onInit: function(require){
            // var manager  = require("bb.manager");
            // var rteManager = require("bb.rte");
        },

        homeAction: function(){
            console.log("... homeAction ...");
            return this.render("#placeHolder","/path/template",{});
        },

        listAction: function(){

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

});
