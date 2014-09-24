define(["tb.core.Core"],function(bbCore){

    bbCore.ControllerManager.registerController("MainController",{
        appname: "layout",
        imports: ["test.manager"],

        onInit: function(){
            console.log("on init is called");
        },


        homeAction: function(){
             $(".jumbotron").html($("<p> app: layout <br/> controller: MainController <br> action: homeAction</p>"));
        },


        listAction: function(){
            console.log("arguments",arguments);
            $(".jumbotron").html($("<p> app: layout <br/> controller: MainController <br> action: listAction</p>"));
        },

        paramsAction: function(){
            console.log("inside MainController:params");
        }

    });
});
