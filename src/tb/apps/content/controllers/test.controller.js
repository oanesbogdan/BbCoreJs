/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(["tb.core"],function(bbCore){

    bbCore.ControllerManager.registerController("TestController",{
        appname: "content",
        imports: ["test.manager"],

        onInit: function(){
            console.log("content onInit");
        },

        homeAction: function(){
            console.log(" contentApp homeAction");
        },

        listAction: function(){
        },

        paramsAction: function(){
            $(".jumbotron").html($("<p>app:[content]MainController:"+"paramAction</p>"));
        }

    });

});


