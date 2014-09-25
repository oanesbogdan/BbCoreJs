define(["tb.core", "jquery"],function(bbCore, jQuery){

    bbCore.ControllerManager.registerController("MainController",{
        appname: "layout",
        imports: ["test.manager"],

        onInit: function(){
            console.log("on init is called");
        },


        homeAction: function(){
             jQuery(".jumbotron").html(jQuery("<p> app: layout <br/> controller: MainController <br> action: homeAction</p>"));
        },


        listAction: function(){
            console.log("arguments",arguments);
            jQuery(".jumbotron").html(jQuery("<p> app: layout <br/> controller: MainController <br> action: listAction</p>"));
        },

        paramsAction: function(){
            console.log("inside MainController:params");
        }

    });
});
