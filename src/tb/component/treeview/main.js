require.config({
    paths: {
        "lib.jqtree": "lib/jqtree/tree.jquery"
    }
});
define(["jsclass", "jquery", "lib.jqtree"], function () {
    "use strict";
   /* var TreeView = new JS.Class({
        initialize: function (config) {
            this.config = config;
            this.tree = null;
            this.state = null;
        },

        set: function () {return; },

        configure: function () {
            this.tree = jQuery.tree({});
        },

        render: function () {return; },

        reset: function () {return; }
    });*/
    var TreeView = {t : ""};
    return TreeView;
});