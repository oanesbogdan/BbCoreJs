/**
 * Keyword tree that allow us create and edit keywords
 **/


define(['Core', 'jquery', '../keywordseditor/datastore/keyword.datastore', '../keywordseditor/helper/contextmenu.helper', 'component!mask', 'component!notify', 'component!translator', 'component!treeview', 'jsclass'], function (Core, jQuery, KwDataStore, ContextMenuHelper, MaskManager, notify, TranslatorComponent, TreeViewComponent) {
    'use strict';

    var trans = Core.get("trans") || function (value) { return value; },

        KeywordEditor = new JS.Class({

            defaultConfig: {
                autoDisplay: false,
                dragAndDrop: true,
                title: trans("keywords_editor")
            },

            initialize: function (config) {
                this.config = jQuery.extend(true, {}, this.defaultConfig, config);

                //this.config.onMove
                this.config.open = this.onReady.bind(this);
                this.dialog = TreeViewComponent.createPopinTreeView(this.config);
                this.isEditing = false;
                this.kwTree = this.dialog.treeView;
                this.maskMng = MaskManager.createMask({});
                this.treeContainer = jQuery(this.dialog.popinTemplate);
                this.initComponents();
                this.initDataStore();
                this.bindEvents();
            },


            initComponents: function () {
                this.contextMenuHelper = ContextMenuHelper;
            },


            bindEvents: function () {
                this.kwTree.on("open", this.loadNode.bind(this));
                this.kwTree.on("contextmenu", this.handleContextMenu.bind(this));
                this.kwTree.on("move", this.handleMove.bind(this));

                this.contextMenuHelper.getContextMenu().on("contextmenu.create", this.createNewKw.bind(this));
                this.contextMenuHelper.getContextMenu().on("contextmenu.edit", this.editKeyword.bind(this));
                this.contextMenuHelper.getContextMenu().on("contextmenu.remove", this.removeNewKeyword.bind(this));
                this.kwTree.nodeEditor.on("editNode", this.handleNodeEdition.bind(this));

                this.keywordStore.on("processing", this.showMask.bind(this));
                this.keywordStore.on("doneProcessing", this.hideMask.bind(this));
            },

            showMask: function () {
                this.maskMng.mask(this.treeContainer);
            },

            hideMask: function () {
                this.maskMng.unmask(this.treeContainer);
            },

            handleMove: function (event) {

                var moveInfo = event.move_info,
                    kw_uid = moveInfo.moved_node.id,
                    parent_uid = moveInfo.moved_node.parent.id,
                    data = {};
                event.move_info.do_move();
                if (moveInfo.moved_node.getNextSibling() !== null) {
                    data.sibling_uid = moveInfo.moved_node.getNextSibling().id;
                } else {
                    data.parent_uid = parent_uid;
                }
                this.keywordStore.moveNode(kw_uid, data);

            },

            handleNodeEdition: function (onEditCallBack, node, keyword, parentNode) {
                var self = this,
                    currentNodeInfos,
                    parentNodeUid = parentNode ? parentNode.uid : null,
                    jsonNode = {
                        uid: node.uid,
                        keyword: keyword,
                        parent_uid: parentNodeUid
                    };

                this.keywordStore.save(jsonNode).done(function () {
                    self.isEditing = false;

                    self.keywordStore.find(jsonNode.uid).done(function (node) {
                        currentNodeInfos = self.formatData([node]);
                        onEditCallBack(currentNodeInfos[0]);
                    });
                }).fail(function (response) {
                    self.kwTree.cancelEdition();
                    self.kwTree.removeNode(node);
                    notify.error(response);
                });
            },


            createNewKw: function () {
                this.isEditing = true;
                this.kwTree.createNode();
            },

            removeNewKeyword: function (node) {
                var self = this;

                this.keywordStore.remove(node).done(function () {
                    self.kwTree.removeNode(node);
                });
            },


            editKeyword: function (node) {
                this.kwTree.editNode(node);
            },

            handleContextMenu: function (e) {
                this.contextMenuHelper.setSelectedNode(e.node);
                this.contextMenuHelper.show(e.click_event, this.kwTree);
                this.kwTree.invoke("selectNode", e.node);
            },

            loadRoot: function () {
                var self = this,
                    data;
                this.keywordStore.execute().done(function (response) {
                    data = self.formatData(response, true);
                    self.kwTree.setData(data);
                    self.autoloadRoot();
                });
            },

            autoloadRoot: function () {
                var rootNode = this.kwTree.getRootNode();
                this.kwTree.invoke("openNode", rootNode.children[0]);
            },

            loadNode: function (e) {

                var self = this;
                if (e.node.isLoaded || this.isEditing) { return false; }

                this.keywordStore.applyFilter("byParent", e.node.uid).execute().done(function (response) {
                    var data = self.formatData(response);
                    e.node.isLoaded = true;
                    self.kwTree.setData(data, e.node);
                });
            },

            formatData: function (rawKeywords) {
                var result = [],
                    loadingMsg = TranslatorComponent.translate("loading"),
                    node;

                jQuery.each(rawKeywords, function (i) {
                    node = rawKeywords[i];
                    node.id = node.uid;
                    node.title = node.keyword;
                    node.label = node.keyword;
                    if (node.has_children) {
                        node.children = [{label : loadingMsg, is_fake: true}];
                    }
                    if (node.parent_uid) {
                        node.is_root = true;
                    }
                    result.push(node);
                });

                return result;
            },

            display: function () {
                this.dialog.display();
            },

            initDataStore: function () {
                this.keywordStore = KwDataStore;
            },

            onReady: function () {
                this.loadRoot();
            }
        });



    return {

        createKeywordEditor: function (config) {
            return new KeywordEditor(config);
        },
        KeywordEditor: KeywordEditor
    };

});