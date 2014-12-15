require.config({
    paths: {
        'lib.jqtree': 'lib/jqtree/tree.jquery'
    },
    shim: {
        'lib.jqtree': {
            deps: ['jquery'],
            exports: 'jQuery.fn.chosen'
        }
    }
});
define('tb.component/treeview/main', ['tb.component/treeview/TreeView', 'tb.component/treeview/PopinTreeView'], function (TreeView, PopinTreeView) {
    'use strict';
    return {
        createTreeView: TreeView.createTreeView,
        createPopinTreeView: PopinTreeView.createPopInTreeView
    };
});