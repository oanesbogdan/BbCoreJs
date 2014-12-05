require.config({
    paths: {
        'dataviewTemplate': 'src/tb/component/dataview/templates',
        'dataStore': 'src/tb/component/dataview/DataStore'
    }
});
define(['require', 'BackBone', 'jquery', 'jsclass', 'tb.core.Api', 'text!dataviewTemplate/layout.tpl'], function (require) {
    var mainTpl = require('text!dataviewTemplate/layout.tpl'),
        $ = require('jquery'),
        coreApi = require('tb.core.Api'),
        /* handle multiple selection */
        selectionHandler = function () {},
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
                allowMultiSelection: true,
                itemRenderer: function () {
                    return '<p>An item renderer must be provided</p>';
                }
            },

            initialize: function (config) {
                $.extend(this, {}, Backbone.Events);
                this.config = $.extend({}, this.defaultConfig, config);
                this.build();
                this.currentRenderMode = this.LIST_MODE;
                this.itemRenderer = this.config.itemRenderer;
                this.dataWrapper = $(this.widget).find('.data-wrapper').eq(0);
                this.bindEvents();
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
            },

            /* keep selection, Keep filter, keep other things */
            saveState: function () {},

            /* build the component */
            build: function () {
                this.widget = $(mainTpl).clone();
                $(this.widget).addClass(this.defaultConfig.cls);
                $(this.widget).css(this.config.css);
            },

            /* how to handle filter and pagination? */
            /* populate is called when data is ready */
            updateUi: function () {
                this.populate();
            },

            setData: function (data) {
                this.data = data;
                this.populate();
            },

            populate: function () {
                var items = this.renderItems(),
                    renderer = this.getModeRenderer(this.currentRenderMode)().render(items);
                $(this.dataWrapper).html(renderer);
            },

            /* render item as a grid */
            gridRenderer: function () {
                //var self = this;
                return {
                    render: function (items) {
                        var wrapper = $("<ul/>");
                        wrapper.addClass("bb5-list-media bb5-list-media-is-grid clearfix");
                        return $(wrapper).html(items);
                    }
                };
            },

            getModeRenderer: function (mode) {
                var rendererName = mode + 'Renderer';
                if (typeof this[rendererName] === "function") {
                    return this[mode + 'Renderer'];
                }
                throw mode + "Renderer can't be found";
            },

            /* render as a list */
            listRenderer: function () {
                return {
                    render: function (items) {
                        var wrapper = $("<ul/>");
                        wrapper.addClass("bb5-list-media bb5-list-media-is-list clearfix");
                        return $(wrapper).html(items);
                    }
                };
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

            getSelection: function () {},

            cleanSelection: function () {
                this.dataWrapper.find("." + this.config.itemCls).removeClass(this.config.itemSelectedCls);
            },
            /* addItem to store --> change is triggered --> ui is updated */
            addItem: function () {},
            /* remove from store --> change is triggered --> ui is updated*/
            removeItem: function () {}
        });
    return {
        createDataView: function (config) {
            return new BaseDataView(config);
        }
    };
});