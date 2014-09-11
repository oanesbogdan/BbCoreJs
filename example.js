console.log(document);

require(["bb.core"],function(bbCore){
  
  /* create application */
  bbCore.ApplicationManager.registerApplication("layout",{
   
    onInit: function(){
     console.log("I'm here");
    },
    
      
    onStart: function(){
      console.log("onStart Application...");
    },
    
      
    onStop: function(){
      console.log("onStop");
     }  
  });
  
  
  /******************************************************************/
   bbCore.RouteManager.registerRoute("layout",{
     prefix:"test",
     routes:{
      "name": {
         url: "home",
       action: "MainController:home"
     },
      
      "test": {
       url: "test",
       action: "TestController:test"
       },
      
      "firsname": {
         url: "showlist/:page",
         action: "MainController:list"
       }     
     }
      
   });
 
  
  
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
  
  
  /************************************************************************************/
   bbCore.ControllerManager.registerController("TestController",{
     appname: "layout",
     imports: ["test.manager"],
     onInit: function(){
       console.log("on init is called in test Controller");
     },
          
     showAction: function(){
      alert("I'm here let me talk to you");
     
     },
     
     testAction: function(){
       console.log("inside TestController test");
     }
     
  
   });
  
  
   /*************************************************************************************/ 
    var router = bbCore.RouteManager.initRouter();
   // history.pushState(null, null, "#showlist/radical"); 
    bbCore.ApplicationManager.init();
  
  /* controller alt test */
  
   setTimeout(function(){
   bbCore.RouteManager.getRouter().navigate("test");
    
  },3000);

});