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
define(['tb.core', "tb.component/treeview/main", 'jquery'], function (bbCore, TreeViewMng, jQuery) {
    'use strict';
    bbCore.ControllerManager.registerController('MainController', {
        appName: 'layout',
        config: {
            imports: ["tb.component/treeview/main"]
        },

        onInit: function (require) {
            var TreeView = require("tb.component/treeview/main");
            this.rootView = jQuery(".jumbotron");
            this.tplRenderer = bbCore.TemplateRenderer.getInstance({});
            this.bindEvents();
        },

        onEnabled: function () {
            console.log("layout:MainController Inside onEnabled method");
        },

        createTreeView: function (renderContainer) {
            if(this.treeView) { return };
            var data = [{
                label: 'Racine',
                id: 1,
                children: [{
                    label: 'child2',
                    id: 2,
                    name: 'radical'
                }, {
                    label: 'child3',
                    id: 3
                }]
            }];

           this.treeView = TreeViewMng.createTreeView(renderContainer, {data: data});
           bbCore.set("TestTreeView", this.treeView);
           
           this.treeView.on("click", function (event){
               console.log("Node is selected");
               console.log("node", event.node);
            });

            this.treeView.on("contextmenu", function(){
                console.log("showContextMenu");
            });
        },

        loadFail: function () {
            console.log("radical blaze");
        },

        bindEvents: function () {
            var self = this;
            jQuery(this.rootView).on("click", ".show-tree-view", function () {
                self.createTreeView(".renderContainer");
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