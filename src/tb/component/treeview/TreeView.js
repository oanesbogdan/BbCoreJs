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
define(["jsclass", "jquery", "lib.jqtree"], function (jsclass, jQuery) {
    "use strict";
    var TreeView = new JS.Class({
        defaultOptions: {
            loadingMessage: "Loading...",
            beforeRender: function () {}
        },
        initialize: function (config) {
            this.useWrapper = false;
            this.isloaded = false;
            var uid = Math.random().toString(36).substr(2, 9);
            this.el = config.el || jQuery("<div class='treeview-ctn' data-treeview-id='" + uid + "'/>");
            this.options = $.extend({}, this.defaultOptions, config.options);
            if (typeof this.options.beforeRender == "function") {
                this.options.beforeRender = this.options.beforeRender;
            }
            if (jQuery(this.el).hasClass('treeview-ctn')) {
                $("body").append(this.el);
                this.useWrapper = true;
            }
            this.treeEl = jQuery(this.el).tree(this.options);
        },
        beforeRender: function () {
            this.reload();
            this.appendNode({
                id: 999,
                label: this.options.loadingMessage
            });
        },
        on: function (eventName, callback, context) {
            context = context || this;
            this.treeEl.bind("tree." + eventName, jQuery.proxy(callback, context));
        },
        invoke: function () {
            var methodName, args;
            try {
                args = jQuery.merge([], arguments);
                methodName = args[0];
                return this.treeEl.tree.apply(this.treeEl, arguments);
            } catch (e) {
                throw "TreeViewException Error while invoking " + methodName + e;
            }
        },
        set: function (key, value, reload) {
            if (typeof key !== 'string' || !value) {
                throw "TreeViewException [set] key must be a string";
            }
            jQuery(this.treeEl).tree("setOption", key, value);
            if (reload) {
                this.reload();
            }
        },
        setOptions: function (options, reload) {
            var key;
            if (!jQuery.isPlainObject(options)) {
                throw "TreeViewException [setOptions] options should be an object";
            }
            for (key in options) {
                if (options.hasOwnProperty(key)) {
                    this.set(key, options[key]);
                }
            }
            if (reload) {
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
            if (!id) {
                throw "TreeViewException [getNodeById] an id should be provided";
            }
            return this.invoke("getNodeById", id);
        },

        appendNode: function (node, parentNode) {
            if (parentNode && parentNode.hasOwnProperty("id")) {
                return this.invoke("appendNode", node, parentNode);
            }
            return this.invoke("appendNode", node);
        },

        moveNode: function (node, targetNode, position) {
            return this.invoke("moveNode", node, targetNode, position);
        },

        setData: function (data, parentNode) {
            if (!Array.isArray(data)) {
                throw "TreeViewException [setData] data should be an Array";
            }
            this._cleanDefaultLoader();
            return this.invoke("loadData", data, parentNode);
        },

        loadDataFromRest: function (url, parentNode, onLoaded) {
            return this.invoke("loadDataFromUrl", url, parentNode, onLoaded);
        },

        render: function (container) {
            jQuery(container).html(this.treeEl);
        },

        removeNode: function (node) {
            return this.invoke("removeNode", node);
        },

        _cleanDefaultLoader: function () {
            //var loadingNode = this.getNodeById(999);
            //console.log(loadingNode);
            // return removeNode();
        },
        reload: function () {
            return this.invoke("reload");
        }
    }),
        createTreeView = function (el, options) {
            el = (typeof el === "string") ? el : null;
            var config = {
                el: el,
                options: options
            },
                treeView = new TreeView(config);
            return treeView;
        };

    return {
        createTreeView: createTreeView
    };
});