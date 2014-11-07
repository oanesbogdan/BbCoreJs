require.config({
    paths: {
        "lib.jqtree": "lib/jqtree/tree.jquery"
    },
    shim: {
        "lib.jqtree": {
            deps: ['jquery'],
            exports: 'jQuery.fn.chosen'
        }
    }
});
define(["jsclass", "jquery", "lib.jqtree"], function (JS, jQuery) {
    "use strict";
    var TreeView = new JS.Class({

        initialize: function (config) {
            this.config = config;
            this.el = config.el || $("<div>");
            this.options = config.options;
            this.treeEl = jQuery(this.el).tree(this.config.options);
        },
        
        on: function (eventName, callback, context) {
            context = context || this;
            this.treeEl.bind("tree."+eventName, jQuery.proxy(callback, context));
        },

        invoke: function () {
            try {
                var methodeName = arguments[0];
                return this.treeEl.tree.apply(this.treeEl, arguments);
            } catch (e) {
                throw "TreeViewException Error while invoking " + methodeName + "";
            }
        },

        set: function (key, value, reload) {
            if(typeof key !== 'string' || !value) {
                throw "TreeViewException [set] key must be a string"
            }
            $(this.treeEl).tree("setOption", key, value);
            if (reload) {
                this.reload();
            }
        },

        setOptions : function (options, reload) {
            var key;
            if(!jQuery.isPlainObject(options)) {
                throw "TreeViewException [setOptions] options should be an object";
            }
            for(key in options) {
                this.set(key, options[key]);
            }
            if(reload){
                this.reload();
            }
        },

        getSelectedNode: function () {
            return this.invoke("getSelectedNode");
        },

        getRootNode: function () {
            return this.invoke("getTree");
        },

        getNodeById: function (id) {
            if (!id) { throw "TreeViewException [getNodeById] an id should be provided"; }
            return this.invoke("getNodeById", id);
        },

        selectNode: function () {

        },

        moveNode: function (node, targetNode, position) {
            return this.invoke("moveNode", node, targetNode, position);
        },

        setData: function (data, parentNode) {
            if( !Array.isArray(data)) {
                throw "TreeViewException [setData] data should be an Array";
            }
            return this.invoke("loadData", data, parentNode);
        },

        loadDataFromRest: function (url, parentNode, Onloaded) {
            return this.invoke("loadDataFromUrl", url, parentNode, Onloaded);
        },

        render: function (container) {
            this.reload();
            $(container).append(this.treeEl);
            return;
        },

        reload: function () {
            return this.invoke("reload");
        }
    }),

    createTreeView = function (el, options) {
        el  = ( typeof el == "string") ? el : null;
        var config = {
            el: el,
            options: options
        };
        var treeView = new TreeView(config);
        return treeView;
    }
    return {
        createTreeView: createTreeView
    };
});