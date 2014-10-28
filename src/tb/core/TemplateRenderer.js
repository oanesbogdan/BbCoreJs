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
define("tb.core.TemplateRenderer", ['require', 'jquery', 'tb.core.Api', 'handlebars', 'tb.core.Utils', 'jsclass'], function (require) {
    'use strict';
    var $ = require("jquery"),
        bbApi = require('tb.core.Api'),
        bbUtils = require('tb.core.Utils'),
        Handlebars = require("handlebars"),
        TemplateManager = new JS.Class({
            initialize: function (config) {
                this.engine = config.engine;
                // this.renderer = config.renderer;
                this.renderAction = "html";
                this.errorMsg = config.errorMsg || $("<p>Error while loading template</p>").clone();
                this.placeHolder = $("<p>Loading...</p>");
            },
            render: function (path, params) {
                if (!params) {
                    throw "TemplateManager:render [params] can't be undefined";
                }
                if (!path || typeof path !== "string") {
                    throw "TemplateManager:render [path] should be a string ";
                }
                var placeHolder = (params.hasOwnProperty('placeHolder')) ? $(params.placeHolder) : this.placeHolder;
                bbUtils.requireWithPromise(['text!' + path]).done($.proxy(this.renderer, this, placeHolder, params.data)).fail($.proxy(this.errorRenderer, this, placeHolder));
                return placeHolder;
            },
            errorRenderer: function (placeHolder) {
                $(placeHolder).html(this.errorMsg);
            },
            renderer: function (placeHolder, params, tpl) {
                var template = Handlebars.compile(tpl),
                    html = template(params.data),
                    action = params.renderAction || this.renderAction;
                $(placeHolder)[action](html);
            }
        }),
        getInstance = function (config) {
            config = config || {};
            return new TemplateManager(config);
        },
        Api = {
            getInstance: getInstance
        };
    bbApi.register("TemplateRenderer", Api);
    return Api;
});