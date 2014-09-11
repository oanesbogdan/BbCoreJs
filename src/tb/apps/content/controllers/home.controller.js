/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
bbCore.ControllerManager.registerController("MainController",{
    appname: "content",
    imports: ["test.manager"],
    
    onInit: function(){
        console.log("content onInit");
    },
    
    homeAction: function(){
        console.log(" contentApp homeAction");
    },
     
    listAction: function(){
        console.log("inside ... listAction");
    },
     
    paramsAction: function(){
        console.log("inside ... paramsAction");
    }
    
});
  

