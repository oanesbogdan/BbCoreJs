define(["bb.core"],function(bbCore){
     
    bbCore.ControllerManager.registerController("MainController",{
        appname: "layout",
        imports: ["test.manager"],
    
        onInit: function(){
            console.log("on init is called");
        },
    
     
        homeAction: function(){
            console.log("inside homeAction ...");
        },
     
    
        listAction: function(){
            console.log("inside MainController:listAction");
        },
    
        paramsAction: function(){
            console.log("inside MainController:params");
     
        }
  
    });
});
 