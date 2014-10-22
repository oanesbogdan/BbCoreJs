/* Application Déclaration */
require.config({
    paths: {
        "layout.routes": "src/tb/apps/layout/routes",
        "layout.main.controller": "src/tb/apps/layout/controllers/main.controller",
        "layout.test.controller": "src/tb/apps/layout/controllers/test.controller",
        "layout.test.manager": "src/tb/apps/layout/managers/test.manager",
        "layout/tpl/home": "src/tb/apps/layout/templates/home.tpl"
    }
});
define("app.layout", ["require", "tb.core"], function (require) {
    'use strict';
    var bbCore = require("tb.core");
    bbCore.ApplicationManager.registerApplication("layout", {
        config: {
            root: "route"
        },
        onInit: function () {
            console.log(" LayoutApplication is initialized ");
        },
        onStart: function () {
            console.log(" layout Application [layout] onStart ...");
        },
        onStop: function () {
            console.log("layout onStop is called ...");
        },
        onError: function () {
            console.log("layout onError...");
        }
    });
});
console.log("fragile, la force de l'art II");