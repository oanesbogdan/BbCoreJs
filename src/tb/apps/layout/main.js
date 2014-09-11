/* Application Déclaration */
require.config({
    paths: {
        "layout.route":"src/tb/apps/layout/routes",
        "layout.home.controller":"src/tb/apps/layout/controllers/main.controller",
        "layout.test.controller":"src/tb/apps/layout/controllers/test.controller"
    }
});
    
define("app.layout",["bb.core","layout.route","layout.test.controller","layout.home.controller"],function(bbCore){
    
    bbCore.ApplicationManager.registerApplication("layout",{
        onInit: function(){
            console.log(" LayoutApplication is initialized ");
        },
        
        onStart: function(){
            console.log(" layout Application onStart...");
        },
        
        onStop: function(){
            console.log("layout onStop...");
        },
        
        onError: function(){
            console.log("layout onError...");
        }
    });
});
