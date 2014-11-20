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
define(['tb.core', "tb.component/treeview/main", 'jquery', 'tb.core.DriverHandler', 'tb.core.RestDriver'], function (bbCore, TreeViewMng, jQuery, CoreDriverHandler, CoreRestDriver) {
    'use strict';
    bbCore.ControllerManager.registerController('MainController', {
        appName: 'layout',
        config: {
            imports: []
        },
        onInit: function () {
            this.rootView = jQuery(".jumbotron");
            this.tplRenderer = bbCore.TemplateRenderer.getInstance({});
            this.bindEvents();
            this.initRestDriver();
            this.createTreeView();
            this.createPopInTreeView();
        },
        initRestDriver: function () {
            CoreRestDriver.setBaseUrl('/rest/1/');
            CoreDriverHandler.addDriver('rest', CoreRestDriver);
        },
        onEnabled: function () {
            console.log("layout:MainController Inside onEnabled method");
        },
        formatResponse: function (data) {
            var response = [],
                root;
            if (Array.isArray(data)) {
                jQuery.each(data, function (i, pageNode) {
                    if (pageNode.url === "/") {
                        root = jQuery.merge({}, pageNode);
                        root.label = pageNode.title;
                        root.children = [];
                        root.i = i; //useless
                        root.id = pageNode.uid;
                    } else {
                        pageNode.id = pageNode.uid;
                        pageNode.label = pageNode.title;
                        pageNode.children = [];
                        root.children.push(pageNode);
                    }
                });
                response.push(root);
            }
            return response;
        },
        createPopInTreeView: function () {
            if (this.popInTreeViews) {
                return;
            }
            this.popInTreeView = TreeViewMng.createPopinTreeView({
                autoDisplay: true,
                width: 200,
                height: 500,
                open: function () {
                    var data = [{
                        label: "Root",
                        id: 15,
                        children: [{
                            label: "feuille 1",
                            id: 12
                        }, {
                            label: "feuille 2",
                            id: 23
                        }, {
                            label: "feuille 3",
                            id: 23
                        }]
                    }];
                    this.getTreeView().getRootNode();
                    this.getTreeView().appendNode({
                        label: "root",
                        id: 15
                    });
                    this.getTreeView().setData(data);
                    console.log(this.getTreeView().isRoot({
                        label: "root",
                        id: 15
                    }));
                },
                close: function () {
                    alert("res");
                }
            });
            window.popInTreeView = this.popInTreeView;
            this.popInTreeView.treeView.on("click", function (e) {
                console.log("element", e.node.element);
            });
        },
        createTreeView: function (renderContainer, data) {
            if (this.treeView) {
                return;
            }
            data = data || [];
            renderContainer = renderContainer || "";
            this.treeView = TreeViewMng.createTreeView(renderContainer, {
                data: data
            });
            bbCore.set("TestTreeView", this.treeView);
        },
        loadFail: function () {
            console.log("radical blaze");
        },
        genId: (function () {
            var compteur = 0;
            return function () {
                var inCpt = compteur + 1;
                return inCpt;
            };
        }()),
        bindEvents: function () {
            var self = this,
                data;
            jQuery(this.rootView).on("click", ".show-tree-view", function () {
                var criterias = {},
                    orderBy = {},
                    start = 0,
                    limit = null;
                self.treeView.render(".renderContainer");
                CoreDriverHandler.read("page", criterias, orderBy, limit, start, function (response) {
                    data = self.formatResponse(response);
                    self.treeView.setData(data);
                });
            });
            jQuery(this.rootView).on("click", ".add_node_after", function () {
                var nodeToAdd = {
                    label: "node_" + self.genId(),
                    id: self.genId()
                },
                    selectedNode = self.popInTreeView.treeView.getSelectedNode();
                self.popInTreeView.treeView.addNode(nodeToAdd, "after", selectedNode);
            });
            jQuery(this.rootView).on("click", ".add_node_before", function () {
                var nodeToAdd = {
                    label: "node_" + self.genId(),
                    id: self.genId()
                },
                    selectedNode = self.popInTreeView.treeView.getSelectedNode();
                self.popInTreeView.treeView.addNode(nodeToAdd, "before", selectedNode);
            });
            jQuery(this.rootView).on("click", ".add_node_append", function () {
                var nodeToAdd = {
                    label: "node_" + self.genId(),
                    id: self.genId(),
                    data: {
                        effor: "sds",
                        dragon: "adversaire"
                    }
                },
                    selectedNode = self.popInTreeView.treeView.getSelectedNode();
                self.popInTreeView.treeView.addNode(nodeToAdd, "append", selectedNode);
            });
        },
        onDisabled: function () {
            return;
        },
        layoutListAction: function () {
            console.log(arguments);
        },
        homeAction: function () {
            try {
                var responseHtml, data = {
                    appName: 'Indeed',
                    templateName: 'homeTemplate',
                    radical: 'staying'
                };
                responseHtml = this.tplRenderer.render('src/tb/apps/layout/templates/home.tpl', {
                    data: data
                }); //action append, replace
                jQuery(this.rootView).html(responseHtml);
            } catch (e) {
                console.log(e);
            }
        },
        listAction: function (page, section) {
            console.log(page, section);
            jQuery('.jumbotron').html(jQuery('<p> app: layout <br/> controller: MainController <br> action: listAction</p>'));
        },
        paramsAction: function (p, s, d, u) {
            this.p = p;
            this.s = s;
            this.d = d;
            this.u = u;
        }
    });
});