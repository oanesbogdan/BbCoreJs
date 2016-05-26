/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
 */
require.config({
    paths: {
        'cs-templates': 'src/tb/component/contentselector/templates',
        'cs-view': 'src/tb/component/contentselector/views',
        'cs-control': 'src/tb/component/contentselector/control',
        'node.formater': 'src/tb/component/contentselector/helper/node.formater',
        'pagerangeselector.control': 'src/tb/component/contentselector/control/pageselector.control',
        'content.renderer': 'src/tb/component/contentselector/helper/content.renderer',
        'content.datastore': 'src/tb/component/contentselector/datastore/content.datastore'
    }
});
define(
    [
        'Core',
        'require',
        'Core/Renderer',
        'jquery',
        'text!cs-templates/layout.tpl',
        'component!popin',
        'underscore',
        'BackBone',
        'component!rangeselector',
        'component!dataview',
        'component!mask',
        'content.renderer',
        'cs-control/searchengine.control',
        'component!jquery-layout',
        "component!datastore",
        "component!treeview",
        "component!siteselector",
        "component!pagination",
        "node.formater",
        'nunjucks',
        'content.datastore'
    ],
    function (Core, require, CoreRenderer, jQuery, layout, PopInMng) {
        'use strict';
        var formater = require('node.formater'),
            underscore = require('underscore'),
            ContentRenderer = require('content.renderer'),
            trans = require('Core').get('trans') || function (value) { return value; },
            ContentSelectorWidget = new JS.Class({
                VIEW_MODE: "view",
                EDIT_MODE: "edit",
                mainSelector: Core.get('wrapper_toolbar_selector'),
                defautConfig: {
                    viewmode: 'grid',
                    autoDisplay: true,
                    dialogConfig: {
                        title: trans("content_selector"),
                        draggable: false,
                        resizable: false,
                        autoOpen: false,
                        modal: true,
                        height: jQuery(window).height() - (20 * 2),
                        width: jQuery(window).width() - (20 * 2)
                    },
                    mode: "view",
                    resetOnClose: false,
                    pagination: {
                        itemsOnPage: 5,
                        renderMode: "singlePage"
                    },
                    rangeSelector: {
                        range: [10, 50, 10],
                        selected: 50
                    },
                    categoryTreeView: {},
                    contentDataView: {
                        allowMultiSelection: true,
                        selectedItemClass: "selected",
                        css: {
                            width: "auto",
                            height: "auto"
                        }
                    },
                    searchEngine: {}
                },
                initialize: function (userConfig) {
                    /* The purpose is to setup child components */
                    jQuery.extend(this, {}, Backbone.Events);
                    this.config = jQuery.extend({}, this.defautConfig, userConfig);
                    if (this.config) {
                        this.isLoaded = false;
                    }
                    this.currentContentTypes = null;
                    this.state = {};
                    this.mode = this.config.mode || this.VIEW_MODE;
                    this.widget = jQuery(CoreRenderer.render(layout, {})).clone();
                    this.popIn = this.initPopIn();
                    Core.ApplicationManager.invokeService('content.main.registerPopin', 'contentSelector', this.popIn);
                    this.popIn.addOption("open", jQuery.proxy(this.onOpen, null, this));
                    this.popIn.addOption("close", jQuery.proxy(this.onClose, this));
                    this.contentRenderer = new ContentRenderer(this);
                    this.viewmode = this.config.viewmode || "grid";
                    this.triggerCloseEvent = (this.mode === this.EDIT_MODE) ? true : false;
                    this.handleMode();
                    this.handleViewModeChange();
                    this.initComponents();
                    this.initControls();
                    this.addCloseAndCancelButtons();
                },

                initControls: function () {
                    this.pageRangeSelector = require("component!rangeselector").createPageRangeSelector(this.config.rangeSelector);
                    this.searchEngine = require("cs-control/searchengine.control").createSearchEngine(this.config.searchEngine);
                    this.contentPagination.setItemsOnPage(this.pageRangeSelector.getValue(), true);
                    this.contentDataView.setItemsToShow(this.contentPagination.getItemsOnPage());
                },

                handleViewModeChange: function (e) {
                    this.widget.find(".viewmode-btn").removeClass("active");
                    if (!e) {
                        this.widget.find(".viewmode-btn.bb5-sortas" + this.viewmode).addClass("active");
                    } else {
                        var viewmode = jQuery(e.currentTarget).data('viewmode');
                        jQuery(e.currentTarget).addClass("active");
                        this.showMask();
                        this.contentDataView.setRenderMode(viewmode);
                        this.hideMask();
                        this.viewmode = viewmode;
                    }
                },

                handleMode: function () {
                    if (this.mode === this.EDIT_MODE) {
                        this.setEditMode();
                    }
                    if (this.mode === this.VIEW_MODE) {
                        this.setViewMode();
                    }
                },

                addCloseAndCancelButtons: function () {
                    var self = this,
                        closeLabel = (this.mode === this.EDIT_MODE) ? trans("add_and_close") : trans("close");
                    this.popIn.addButton(closeLabel, function () {
                        self.close();
                    });

                    self.popIn.addButton(trans("cancel"), function () {
                        self.triggerCloseEvent = false;
                        self.close();
                        self.trigger("cancel");
                    });
                },

                onClose: function () {
                    if (this.triggerCloseEvent) {
                        var selections = this.contentDataView.getSelection();
                        this.trigger("close", selections);
                    }
                    this.reset();
                    this.triggerCloseEvent = (this.mode === this.EDIT_MODE) ? true : false;
                },

                /* create components */
                initComponents: function () {
                    this.contentRestDataStore = require('content.datastore');
                    this.contentRestDataStore.applyFilter('usePagination', 0);
                    this.contentRestDataStore.applyFilter('excludeDeletedPages', 1);
                    this.categoryTreeView = this.createCategoryTreeView();
                    this.contentDataView = this.createDataView();
                    this.contentPagination = this.createPagination();
                    this.maskMng = require('component!mask').createMask({});
                    this.mainZone = jQuery(this.widget).find('.bb5-windowpane-main').eq(0);
                },

                /* in edit mode a few things change */
                setEditMode: function () {
                    this.contentRenderer.setEditMode();
                },

                setViewMode: function () {
                    this.contentRenderer.setViewMode();
                },

                selectItems: function (itemData) {
                    this.contentDataView.selectItems(itemData);
                },

                createDataView: function () {
                    var dataViewConfig = this.config.contentDataView;
                    if (this.config.hasOwnProperty("viewmode")) {
                        dataViewConfig.renderMode = this.config.viewmode;
                    }
                    dataViewConfig.itemRenderer = jQuery.proxy(this.contentRenderer.render, this.contentRenderer);
                    dataViewConfig.dataStore = this.contentRestDataStore;
                    return require('component!dataview').createDataView(dataViewConfig);
                },

                createPagination: function () {
                    return require('component!pagination').createPagination(this.config.pagination);
                },

                createCategoryTreeView: function () {
                    return require('component!treeview').createTreeView(null, this.config.categoryTreeView);
                },

                reset: function (keepSelection) {
                    keepSelection =  keepSelection || false;
                    this.contentDataView.reset();
                    this.contentPagination.reset();
                    this.contentPagination.setItems(0);
                    this.pageRangeSelector.reset();
                    this.searchEngine.reset();
                    /* Reset the category label */
                    jQuery(this.widget).find(".result-infos").html("");
                    if (!keepSelection) {
                        this.categoryTreeView.unselectNode();
                    }

                },

                /**
                 * This fonction is called only once for each instance
                 * the tree is loaded here to prevent useless rest calls
                 **/
                onReady: function () {
                    var self = this,
                        catTreeCtn = jQuery(this.widget).find('.bb5-windowpane-tree .bb5-treeview').eq(0),
                        contentViewCtn = jQuery(this.widget).find('.data-list-ctn').eq(0),
                        pageRangeCtn = jQuery(this.widget).find('.max-per-page-selector').eq(0),
                        paginationCtn = jQuery(this.widget).find('.content-selection-pagination').eq(0),
                        searchEnginerCtn = jQuery(this.widget).find(".bb5-form-wrapper").eq(0);

                    this.categoryTreeView.render(catTreeCtn);
                    this.contentDataView.render(contentViewCtn);
                    this.contentDataView.on("afterRender", function () {
                        var height = parseInt(self.computeDataViewSize() * 75 / 100, 10);
                        jQuery(contentViewCtn).css("height", height);
                    });

                    this.contentPagination.render(paginationCtn, 'replaceWith');
                    this.pageRangeSelector.render(pageRangeCtn, 'replaceWith');

                    this.searchEngine.render(searchEnginerCtn, 'html');

                    if (!this.isloaded && this.config.autoload) {
                        this.loadAllCategories();
                    }
                    jQuery("#" + this.popIn.id).parent().find(".ui-dialog-buttonpane .ui-dialog-buttonset").addClass("pull-right");
                    searchEnginerCtn.on("keyup", this.handleEnterKey.bind(this));
                },

                deleteContent: function (content) {
                    this.contentRestDataStore.remove(content);
                },

                computeDataViewSize: function () {
                    return jQuery("#" + this.popIn.getId()).find(".bb5-windowpane-main").eq(0).height();
                },

                loadAllCategories: function () {
                    var self = this;
                    Core.ApplicationManager.invokeService("content.main.getRepository").done(function (pageRepository) {
                        pageRepository.findCategories().done(function (data) {
                            var formattedData = formater.format('category', data);
                            self.categoryTreeView.setData(formattedData);
                            self.loadRootNode();
                        });
                    });
                },

                loadRootNode: function () {
                    var tree = this.categoryTreeView.getRootNode(),
                        rootNode = tree.children[0],
                        firstElement;

                    this.categoryTreeView.invoke("openNode", rootNode);

                    if (rootNode.children.length > 0) {
                        firstElement = rootNode.children[0];

                        jQuery(firstElement.element).addClass('jqtree-selected');

                        this.updateData(firstElement);
                    }
                },

                updateData: function (element) {
                    if (element.isACategory) {
                        this.contentRestDataStore.unApplyFilter('byClasscontent').applyFilter('byCategory', element.name);
                    } else {
                        this.contentRestDataStore.unApplyFilter('byCategory').applyFilter('byClasscontent', element.type);
                    }

                    this.contentPagination.reset();
                    this.contentRestDataStore.setStart(0).setLimit(this.contentPagination.getItemsOnPage()).execute();
                },

                initLayout: function () {
                    this.widgetLayout = jQuery(this.widget).layout({
                        applyDefaultStyles: true,
                        closable: false,
                        west__childOptions: {
                            center__paneSelector: ".inner-center",
                            north__paneSelector: ".ui-layout-north",
                            south__paneSelector: ".ui-layout-south"
                        },
                        center__childOptions: {
                            center__paneSelector: ".inner-center.data-list-ctn",
                            north__paneSelector: ".ui-layout-north"
                        }
                    });
                    return this.widgetLayout;
                },

                showMask: function () {
                    this.maskMng.mask(this.mainZone);
                },

                hideMask: function () {
                    this.maskMng.unmask(this.mainZone);
                },

                close: function () {
                    this.popIn.hide();
                    this.onClose();
                },

                bindEvents: function () {
                    var self = this;

                    this.contentRestDataStore.on('processing', function () {
                        self.showMask();
                    });
                    this.contentRestDataStore.on('doneProcessing', function () {
                        self.hideMask();
                    });

                    this.contentRestDataStore.on("dataDelete", function () {
                        self.contentRestDataStore.execute();
                    });

                    jQuery(this.widget).find(".viewmode-btn").on('click', jQuery.proxy(this.handleViewModeChange, this));

                    /* When we click on a node */
                    this.categoryTreeView.on('click', function (e) {
                        var selectedNode = e.node;

                        if (jQuery(selectedNode.element).hasClass("jqtree-selected")) {
                            return false;
                        }
                        if (selectedNode.isRoot) {
                            return;
                        }

                        self.updateData(selectedNode);
                    });
                    /* When range Changes */
                    this.pageRangeSelector.on("pageRangeSelectorChange", function (val) {
                        self.contentRestDataStore.setStart(0).setLimit(val).execute();
                        self.contentPagination.setItemsOnPage(val); // -->will trigger pageChange
                    });
                    /* When page changes */
                    this.contentPagination.on("pageChange", function (page, itemsToShow) {
                        var limit = self.pageRangeSelector.getValue(),
                            start = (page - 1) * limit,
                            seletectedNode = self.categoryTreeView.getSelectedNode();
                        self.contentRestDataStore.setStart(start);
                        if (!seletectedNode || (seletectedNode && seletectedNode.isRoot)) {
                            return;
                        }
                        self.contentRestDataStore.setLimit(itemsToShow);
                        self.contentRestDataStore.execute();
                    });
                    /* when render : to handle layout */
                    this.contentPagination.on('afterRender', function (isVisible) {
                        var position = (isVisible === true) ? 233 : 203;
                        self.fixDataviewLayout(position);

                    });
                    /* When we must update the query task */
                    this.searchEngine.on("doSearch", function (criteria) {
                        jQuery.each(criteria, function (key, val) {
                            var filterName = 'by' + key.charAt(0).toUpperCase() + key.slice(1);
                            if (criteria[key] !== undefined) {
                                if (jQuery.trim(val).length === 0) {
                                    self.contentRestDataStore.unApplyFilter(filterName);
                                } else {
                                    self.contentRestDataStore.applyFilter(filterName, val);
                                }
                            }
                        });
                        self.contentRestDataStore.execute();
                    });

                    this.searchEngine.on("onResetField", function (fieldName) {
                        var filterName = 'by' + fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                        self.contentRestDataStore.unApplyFilter(filterName);
                    });

                    /* when we have contents */
                    self.contentRestDataStore.on("dataStateUpdate", jQuery.proxy(this.updateCurrentNodeInfos, this));
                    self.contentRestDataStore.on('dataStateUpdate', function () {
                        self.widgetLayout.resizeAll();
                    });
                },

                fixDataviewLayout: function (top) {
                    if (!this.widgetLayout) {
                        return;
                    }
                    top = top || 170;
                    var resizerTop = top - 5;
                    jQuery(this.widgetLayout.center.children.layout1.resizers.north).css('top', resizerTop);
                    jQuery(this.widgetLayout.center.children.layout1.center.pane).css('top', top);
                },

                updateCurrentNodeInfos: function () {
                    var resultTotal = this.contentRestDataStore.getTotal();
                    jQuery(this.widget).find(".result-infos").html(this.categoryTreeView.getSelectedNode().name);
                    /* update pagination here */
                    this.contentPagination.setItems(resultTotal, this.contentRestDataStore.count());
                },

                setDataViewMode: function (mode) {
                    var availableMode = ['grid', 'list'];
                    jQuery(this.widget).find('.viewmode-btn').removeClass("active");
                    jQuery(this.widget).find(".bb5-sortas" + mode).addClass("active");
                    if (availableMode.indexOf(mode) !== -1) {
                        this.contentDataView.setRenderMode(mode);
                    }
                },

                /* handle contenttype
                 * if the selector is not reader add it to a queue
                 * */
                setContenttypes: function (contentypeArr) {

                    var key,
                        self = this,
                        accepts = [],
                        data;

                    if (!Array.isArray(contentypeArr)) {
                        throw "ContentSelectorWidgetException [setContenttypes] expects an array";
                    }
                    /* If it's the same do nothing */
                    if (underscore.isEqual(this.currentContentTypes, contentypeArr)) {
                        return;
                    }

                    for (key in contentypeArr) {
                        if (contentypeArr.hasOwnProperty(key)) {
                            if (contentypeArr[key] && '!' !== contentypeArr[key].substring(0, 1)) {
                                accepts.push(contentypeArr[key]);
                            }
                        }
                    }

                    if (accepts.length > 0) {
                        data = formater.format("contenttype", accepts);
                        this.categoryTreeView.setData(data);
                        this.loadRootNode();
                    } else {
                        Core.ApplicationManager.invokeService("content.main.getRepository").done(function (pageRepository) {
                            pageRepository.findCategoriesByWithoutAccept(contentypeArr).done(function (categories) {
                                self.categoryTreeView.setData(formater.format('category', categories));
                                self.loadRootNode();
                            });
                        });
                    }

                    this.currentContentTypes = contentypeArr;
                },

                initPopIn: function () {
                    PopInMng.init(this.mainSelector);
                    return PopInMng.createPopIn(this.config.dialogConfig);
                },

                /*will be called once*/
                createSiteSelector: function () {
                    var self = this,
                        siteSelectorCtn = jQuery(this.widget).find('.site-selector-ctn').eq(0);
                    this.siteSelector = require("component!siteselector").createSiteSelector({selected : Core.get("site.uid") });

                    this.siteSelector.on("ready", function () {
                        self.bindEvents();
                        self.onReady();
                        self.contentRestDataStore.applyFilter("bySite", this.getSelectedSite());
                    });
                    this.siteSelector.on("siteChange", this.handleSiteChange.bind(this));
                    jQuery(siteSelectorCtn).replaceWith(this.siteSelector.render());
                },

                handleSiteChange: function (site) {
                    var currentSelectedNode = this.categoryTreeView.getSelectedNode();
                    this.contentRestDataStore.applyFilter("bySite", site);

                    if (!currentSelectedNode || currentSelectedNode.isRoot) { return false; }
                    this.reset(true);
                    this.contentRestDataStore.clear();
                    this.contentRestDataStore.applyFilter('usePagination', 0);
                    if (currentSelectedNode.isACategory) {
                        this.contentRestDataStore.applyFilter('byCategory', currentSelectedNode.name);
                    } else {
                        this.contentRestDataStore.applyFilter('byClasscontent', currentSelectedNode.type);
                    }

                    this.contentRestDataStore
                        .setStart(0).setLimit(this.contentPagination.getItemsOnPage())
                        .applyFilter("bySite", site)
                        .execute();
                },

                handleEnterKey: function (e) {
                    var submitButton = jQuery(this.widget).find(".bb5-form-wrapper button.search-btn");

                    if (e.keyCode !== 13) {
                        return;
                    }

                    submitButton.click();
                },

                onOpen: function (selector) {
                    selector.createSiteSelector();
                    selector.createSiteSelector = jQuery.noop;
                    if (!selector.isLoaded) {
                        jQuery(this).html(selector.widget); //this == dialog
                        var widgetLayout = selector.initLayout();
                        widgetLayout.resizeAll();
                        widgetLayout.sizePane("west", 201); //useful to fix layout size
                        selector.fixDataviewLayout();
                        selector.isLoaded = true;
                    } else {
                        selector.loadRootNode();
                    }
                    selector.trigger("open");
                },

                render: function () {
                    return this.widget;
                },

                display: function () {
                    this.popIn.display();
                }
            });

        return {
            createContentSelector: function (config) {
                config = config || {};
                return new ContentSelectorWidget(config);
            },
            ContentSelectorWidget: ContentSelectorWidget
        };
    }
);
