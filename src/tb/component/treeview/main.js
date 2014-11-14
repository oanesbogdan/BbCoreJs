define(["tb.component/treeview/TreeView","tb.component/treeview/PopinTreeView"], function (TreeView, PopinTreeView) {
    "use strict";
       return {createTreeView : TreeView.createTreeView, createPopinTreeView : PopinTreeView.createPopInTreeView};
});