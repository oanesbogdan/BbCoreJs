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
            CoreDriverHandler.addDriver('rest', CoreRestDriver)
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
                        root = $.merge( {}, pageNode);
                        root.label = pageNode.title;
                        root.children = [];
                        root.id =  pageNode.uid;
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
            if(this.popInTreeViews){
                return;
            }
            TreeViewMng.createPopinTreeView({autoDisplay: true});
            this.popInTreeViews = {};
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

            this.treeView.on("click", function (event) {
                console.log("Node is selected");
                console.log("node", event.node);
            });

            this.treeView.on("contextmenu", function () {
                console.log("showContextMenu");
            });
        },

        loadFail: function () {
            console.log("radical blaze");
        },

        bindEvents: function () {
            var self = this, data;
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
        },

        onDisabled: function () {
            console.log("layout:MainController Inside OnDisabled method");
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