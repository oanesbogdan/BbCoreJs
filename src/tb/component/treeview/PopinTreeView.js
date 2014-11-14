define(["jquery", "jsclass", "tb.component/treeview/TreeView", "tb.component/popin/main"], function (jQuery, js, TreeViewMng, PopInMng) {
    var testData = [{
        label: 'node1',
        id: 1,
        children: [{
            label: 'child1',
            id: 2
        }, {
            label: 'child2',
            id: 3
        }, {
            label: 'node2',
            id: 4,
            children: [{
                label: 'child3',
                id: 5
            }]
        }, ]
    }];
    var testData2 = [{label:'racine', id:7, children: [{label:'Strnage', id : 45 }] }];
    var popInTemplate = jQuery("<div><div class='action-ctn'><input type='checkbox'/> > Show folder</div><div class='treeview-ctn'>Loading...</div></div>").clone();
    var PopInTreeview = new JS.Class({
        defaultConfig: {
            height: 300,
            width: 350,
            title: "Page tree",
            autoDisplay: false,
            data: testData
        },
        initialize: function (options) {
            this.options = jQuery.extend({}, this.defaultConfig, options);
            this.isLoaded = false;
            this.treeView = TreeViewMng.createTreeView({
                options: this.options
            });
            this.popIn = this.createPopIn();
            this.popIn.setContent(popInTemplate);
            this.popIn.addOption("open", jQuery.proxy(this.initOnOpen, this));
            if (this.options.hasOwnProperty("autoDisplay") && this.options.autoDisplay) {
                this.display();
            }
        },

        initOnOpen: function () {
            if (this.isLoaded){ return; }
            var content = this.popIn.getContent(),
                container = $(content).find(".treeview-ctn");
            this.treeView.render(container);
            this.treeView.setData(this.options.data);
            this.isLoaded = true;
        },

        addActions: function () {},

        addFilter: function () {},

        createPopIn: function () {
            return PopInMng.createPopIn(this.options);
        },

        getTreeView: function () {
            return this.treeView;
        },

        display: function () {
            this.popIn.display();
        },

        hide: function () {
            this.popIn.hide();
        }
    });
    return {
        createPopInTreeView: function (options) {
            return new PopInTreeview(options);
        }
    }
});