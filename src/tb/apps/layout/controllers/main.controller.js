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
define(['tb.core', 'jquery'], function (bbCore, jQuery) {
    'use strict';
    bbCore.ControllerManager.registerController('MainController', {
        appName: 'layout',
        config: {
            imports: ['layout.test.manager']
        },
        onInit: function () {
            /*require("layout.test.manager");*/
            this.rootView = jQuery(".jumbotron");
            this.tplRenderer = bbCore.TemplateRenderer.getInstance({});
        },
        onEnabled: function () {
            console.log("layout:MainController Inside onEnabled method");
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