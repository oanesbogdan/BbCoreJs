/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/* update requireMap */

require.config({
    paths: {
        "content.routes": "src/tb/apps/content/routes", //mandatory
        "content.home.controller": "src/tb/apps/content/controllers/home.controller",
        "content.test.controller": "src/tb/apps/content/controllers/test.controller"
    }
});

define("app.content", ["tb.core", "content.home.controller", "content.test.controller"], function (bbCore) {
    'use strict';

    /**
     * content application declaration
     */
    bbCore.ApplicationManager.registerApplication("content", {
        /**
         * occurs on initialization of content application
         */
        onInit: function () {
            console.log(" LayoutApplication is initialized ");
        },

        /**
         * occurs on start of content application
         */
        onStart: function () {
            console.log("onStart [content] ...");
        },

        /**
         * occurs on stop of content application
         */
        onStop: function () {
            console.log("content onStop is called...");
        },

        /**
         * occurs on error of content application
         */
        onError: function () {
            console.log("onError...");
        }
    });

});

console.log("fragile, la force de l'art");

