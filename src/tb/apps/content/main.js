/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* update requireMap */

require.config({
    "content.route":"src/tb/apps/content/routes",
    "content.home.controller":"src/tb/apps/content/controllers/home.controller",
    "content.test.controller":"src/tb/apps/content/controllers/test.controller"
    /*model more stuff here*/
});
define("app.content",["bb.core"], function(bbCore){
    /* declaration de l'application */
    bbCore.ApplicationManager.registerApplication("content",{
        
        onInit: function(){
            console.log(" LayoutApplication is initialized ");
        },
        
        onStart: function(){
            console.log("onStart...");
        },
        
        onStop: function(){
            console.log("onStop...");
        },
        
        onError: function(){
            console.log("onError...");
        }
    });
  
});

 