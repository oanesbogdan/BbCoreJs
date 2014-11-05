/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBuilder5.
 *
 * BackBuilder5 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBuilder5 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.
 */
require.config({
    paths: {
        "content.routes": "src/tb/apps/content/routes", //mandatory
        "content.home.controller": "src/tb/apps/content/controllers/home.controller",
        "content.test.controller": "src/tb/apps/content/controllers/test.controller",
        "content.test.manager": "src/tb/apps/content/managers/test.manager"
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

