/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* update requireMap */

require.config({
    paths: {
        "content.routes": "src/tb/apps/content/routes",//mandatory
        "content.home.controller":"src/tb/apps/content/controllers/home.controller",
        "content.test.controller":"src/tb/apps/content/controllers/test.controller"
    }
});

define("app.content",["tb.core","content.home.controller","content.test.controller"], function(bbCore){

    /* declaration de l'application */
    bbCore.ApplicationManager.registerApplication("content",{

        onInit: function(){
            console.log(" LayoutApplication is initialized ");
        },

        onStart: function(){
            console.log("onStart [content] ...");
        },

        onStop: function(){
            console.log("content onStop is called...");
        },

        onError: function(){
            console.log("onError...");
        }
    });

});

console.log("fragile, la force de l'art");

