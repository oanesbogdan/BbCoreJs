require.config({
    paths: {
        'dataviewTemplate': 'src/tb/component/dataview/templates',
        'dataStore': 'src/tb/component/dataview/DataStore'
    }
});
define(['require', 'BackBone', 'jquery', 'jsclass', 'tb.core.Api', 'text!dataviewTemplate/layout.tpl'], function (require) {
    'use strict';
    var mainTpl = require('text!dataviewTemplate/layout.tpl'),
        $ = require('jquery'),
        coreApi = require('tb.core.Api'),
        /* handle multiple selection */
        BaseDataView = new JS.Class({
            LIST_MODE: 'list',
            GRID_MODE: 'grid',
            defaultConfig: {
                cls: 'data-view',
                css: {
                    width: "450px",
                    height: "400px"
                },
                itemCls: 'data-view-item',
                itemSelectedCls: 'selected',
                rendererClass: '',
                renderAsCollection: false,
                allowMultiSelection: true,
                customItemEvents: {},
                itemRenderer: function () {
                    return '<p>An item renderer must be provided</p>';
                }
            },

            initialize: function (config) {
                $.extend(this, {}, Backbone.Events);
                this.config = $.extend({}, this.defaultConfig, config);
                this.build();
                this.currentRenderMode = this.LIST_MODE;
                this.renderers = {};
                this.buildDefaultRenderers();
                this.itemRenderer = this.config.itemRenderer;
                this.dataWrapper = $(this.widget).find('.data-wrapper').eq(0);
                this.handleCustomItemEvents();
                this.selectionInfos = [];
                this.bindEvents();
            },

            handleCustomItemEvents: function () {
                var self = this;
                if ($.isEmptyObject(this.config.customItemEvents)) return;
                $.each(this.config.customItemEvents, function (customEvent, data) {
                    if (!data.hasOwnProperty('evt') || data.hasOwnProperty('selector')) {
                        return true;
                    }
                    $(self.widget).on(data.evt, data.selector, function (e) {
                        var itemNode = $(e.target).closest(self.itemCls);
                        self.trigger(customEvent, e, $(itemNode).data('item-data'));
                    });
                });
            },

            buildDefaultRenderers: function () {
                var listRenderer = {
                    name: "list",
                    render: function (items) {
                        var wrapper = $("<ul/>");
                        wrapper.addClass("bb5-list-media bb5-list-media-is-list clearfix");
                        return $(wrapper).html(items);
                    }
                },
                    gridRenderer = {
                        name: "grid",
                        render: function (items) {
                            var wrapper = $("<ul/>");
                            wrapper.addClass("bb5-list-media bb5-list-media-is-grid clearfix");
                            return $(wrapper).html(items);
                        }
                    };
                try {
                    this.registerRenderer(listRenderer);
                    this.registerRenderer(gridRenderer);
                } catch (e) {
                    console.log(e);
                }
                /* register renderer */
            },

            bindEvents: function () {
                $(this.widget).on("click", "." + this.config.itemCls, $.proxy(this.handleItemClick, this));
                if (this.config.dataStore && typeof this.config.dataStore.on === "function") {
                    this.config.dataStore.on("dataStateUpdate", $.proxy(this.setData, this));
                }
            },

            handleItemClick: function (e) {
                var target = $(e.currentTarget),
                    data = target.data('item-data');
                if (target.hasClass(this.config.itemSelectedCls)) {
                    target.removeClass(this.config.itemSelectedCls);
                    this.trigger("itemUnselected", data, target);
                    return;
                }
                if (!this.config.allowMultiSelection) {
                    this.cleanSelection();
                }
                $(target).addClass(this.config.itemSelectedCls);
                this.trigger("itemSelected", data, target);
                return true;
            },

            /* build the component */
            build: function () {
                this.widget = $(mainTpl).clone();
                $(this.widget).addClass(this.defaultConfig.cls);
                $(this.widget).css(this.config.css);
            },

            /* populate is called when data is ready */
            updateUi: function () {
                this.populate();
            },

            setData: function (data) {
                this.data = data;
                this.populate();
            },

            populate: function () {
                var items = (this.renderAsCollection) ? this.data : this.renderItems(),
                    renderer = this.getModeRenderer(this.currentRenderMode).render(items);
                $(this.dataWrapper).html(renderer);
            },

            getModeRenderer: function (mode) {
                var rendererName = mode + 'Renderer',
                    renderer;
                if (this.renderers.hasOwnProperty(rendererName)) {
                    renderer = this.renderers[rendererName];
                    if (typeof renderer.render === "function") {
                        return this.renderers[mode + 'Renderer'];
                    }
                    throw "Renderer" + mode + " should provide a render function";
                }
                throw "Renderer" + mode + " can't be found";
            },

            registerRenderer: function (renderer) {
                if ($.isEmptyObject(renderer)) {
                    throw "DataView:registerRenderer renderer must be an object and should not be empty";
                }
                if (!renderer.hasOwnProperty('name') || typeof renderer.name !== 'string') {
                    throw "DataView:registerRenderer renderer must have a name " + JSON.stringify(renderer);
                }
                if (!renderer.hasOwnProperty("render") && typeof renderer.render !== "function") {
                    throw "DataView:registerRenderer must provided a render function";
                }
                this.renderers[renderer.name + 'Renderer'] = renderer;
            },

            genId: (function (prefix) {
                var compteur = 0;
                return function (prefix) {
                    prefix = (typeof prefix === 'string') ? prefix + '_' : '';
                    compteur = compteur + 1;
                    return prefix + compteur;
                };
            }()),

            renderItems: function () {
                var self = this,
                    ctn = document.createDocumentFragment();
                $.each(this.data, function (i, item) {
                    var itemRender = $(self.itemRenderer(self.currentRenderMode, item)); // when is a class it should provide a render
                    $(itemRender).data("view-item", self.genId("item"));
                    $(itemRender).data("item-data", item);
                    $(itemRender).addClass(self.config.itemCls);
                    if (!itemRender || itemRender.length === 0) {
                        coreApi.exception('ApplicationManagerException', 50002, 'InvalidAppConfig [appPath] key is missing');
                    }
                    ctn.appendChild($(itemRender).get(0));
                });
                return ctn;
            },

            setRenderMode: function (mode) {
                this.selectionInfos = this.getSelection();
                this.currentRenderMode = mode;
                this.updateUi();
            },

            render: function (container) {
                if (container && $(container).length) {
                    $(container).html(this.widget);
                    return;
                }
                return this.widget;
            },

            getSelection: function () {
                var selections = $(this.dataWrapper).find("." + this.config.itemSelectedCls),
                    result = [];
                if (selections.length) {
                    $.each(selections, function (i, item) {
                        result.push($(item).data('itemData'));
                    });
                }
                return result;
            },

            cleanSelection: function () {
                this.dataWrapper.find("." + this.config.itemCls).removeClass(this.config.itemSelectedCls);
            }

        });
        
    return {
        createDataView: function (config) {
            return new BaseDataView(config);
        },
        DataView: BaseDataView
    };
});