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
        'ls-templates': 'src/tb/component/linkselector/templates'
    }
});

define(
    [
        'Core',
        'Core/Renderer',
        'jquery',
        'component!popin',
        'component!translator',
        'component!dataview',
        'component!datastore',
        'component!pagination',
        'component!rangeselector',
        'component!formbuilder',
        'component!mask',
        'text!ls-templates/layout.twig',
        'text!ls-templates/page-item.twig',
        'moment',
        'component!siteselector',
        'component!searchengine',
        'jquery-layout',
        'jsclass'
    ],
    function (Core,
            Renderer,
            jQuery,
            PopinManager,
            Translator,
            DataView,
            DataStore,
            Paginator,
            RangeSelector,
            FormBuilder,
            Mask,
            layoutTemplate,
            pageItemTemplate,
            moment
            ) {

        'use strict';

        var LinkSelector = new JS.Class({

            layoutSelector: '.link-selector',
            treeSelector: '.link-selector-tree .bb5-treeview',
            bodySelector: '.link-selector-body',
            btnSelectSelector: '.select-btn',
            paginationSelector: '.link-selector-selection-pagination',
            resultInfosSelector: '.result-infos',
            rangeSelectorSelector: '.max-per-page-selector',
            searchEngineSelector: '.search-engine-ctn',
            menuSelector: '.link-selector-menu',
            internalLinkSelector: '.link-selector-internal-link',
            externalLinkSelector: '.link-selector-external-link',
            wrapperAreaSelector: '.link-selector-wrapper-area',

            treeConfig: {
                do_loading: true,
                do_pagination: true,
                site_uid: Core.get('site.uid')
            },

            paginationConfig: {
                itemsOnPage: 10
            },

            rangeConfig: {
                range: [5, 45, 5],
                selected: 10
            },

            dataStoreConfig: {
                resourceEndpoint: 'page'
            },

            searchEngineConfig: {
                showFieldStatus: true
            },

            initInternal: function () {
                this.initPopin();
                this.initDataStore();
                this.initDataView();
                this.initPagination();
                this.initRangeSelector();
                this.initSearchEngine();

                this.maskManager = Mask.createMask({});
            },

            createSiteSelector: function () {
                var self = this,
                    siteSelectorCtn = jQuery(this.widget).find('.site-selector-ctn').eq(0);
                this.siteSelector = require("component!siteselector").createSiteSelector({selected : Core.get("site.uid") });

                this.siteSelector.on("ready", function () {
                    self.treeConfig.site_uid = this.getSelectedSite();
                    self.loadTree(self);
                });

                this.siteSelector.on("siteChange", this.handleSiteChange.bind(this));

                jQuery(siteSelectorCtn).replaceWith(this.siteSelector.render());
            },


            handleSiteChange: function (siteUid) {
                this.mask();
                this.treeConfig.site_uid = siteUid;
                this.dataStore.setStart(0).setLimit(this.pagination.getItemsOnPage());
                this.loadTree(this, false);
                this.dataView.reset();
                this.searchEngine.reset();
                this.widget.find(this.resultInfosSelector).html("");
            },

            handleEnterKey: function (e) {
                var submitButton = jQuery(this.widget).find(".search-engine-ctn button.search-btn");

                if (e.keyCode !== 13) {
                    return;
                }

                submitButton.click();
            },

            loadTree: function (Selector) {

                Core.ApplicationManager.invokeService('page.main.getPageTreeViewInstance').done(function (PageTreeView) {
                    var pageTree = new PageTreeView(Selector.treeConfig);
                    pageTree.getTree().done(function (tree) {

                        Selector.tree = tree;

                        Selector.tree.render(Selector.widget.find(Selector.treeSelector));
                        if (!Selector.isLoaded) {
                            Selector.onReady();
                            Selector.manageMenu();
                            Selector.bindTreeEvents();
                        }
                        /* rebind event */
                        Selector.tree.on('click', Selector.onTreeClick.bind(Selector));

                        /* load root node */
                        Selector.loadRootNode();

                        Selector.isLoaded = true;
                    }).always(function () {
                        Selector.unMask();
                    });
                });
            },

            loadRootNode: function () {
                var tree = this.tree.getRootNode();
                this.tree.invoke("openNode", tree.children[0]);
            },

            initExternal: function () {
                var self = this,
                    config = {
                        elements: {
                            url: {
                                type: 'url',
                                label: 'URL'
                            }
                        },
                        form: {
                            submitLabel: Translator.translate('select'),
                            onSubmit: function (data) {
                                self.close(data);
                            },
                            onValidate: function (form, data) {

                                if (!data.hasOwnProperty('url') || jQuery.trim(data.url).length === 0) {
                                    form.addError('url', Translator.translate('url_required'));
                                }
                            }
                        }
                    };

                FormBuilder.renderForm(config).done(function (html) {
                    self.widget.find(self.externalLinkSelector + ' ' + self.wrapperAreaSelector).html(html);
                });
            },

            show: function () {

                if (this.isShown !== true) {

                    this.initInternal();
                    this.initExternal();

                    this.widget = jQuery(Renderer.render(layoutTemplate)).clone();
                }

                this.popin.display();

                this.isShown = true;
            },

            initPopin: function () {
                this.popin = PopinManager.createPopIn();
                this.popin.setTitle(Translator.translate('link_selector_label'));
                this.popin.addOption('height', jQuery(window).height() - 40);
                this.popin.addOption('width', jQuery(window).width() - 40);
                this.popin.addOption('open', jQuery.proxy(this.onOpen, null, this));
            },

            manageMenu: function () {
                var li = this.widget.find(this.menuSelector + ' ul li'),
                    internalLinkPane = this.widget.find(this.internalLinkSelector),
                    externalLinkPane = this.widget.find(this.externalLinkSelector);

                li.on('click', function () {

                    var element = jQuery(this),
                        siblings = element.siblings('li');

                    internalLinkPane.addClass('hidden');
                    externalLinkPane.addClass('hidden');
                    siblings.removeClass('active');

                    if (element.data('pane') === 'external') {
                        externalLinkPane.removeClass('hidden');
                    } else {
                        internalLinkPane.removeClass('hidden');
                    }

                    element.addClass('active');
                });
            },

            onOpen: function (Selector) {
                if (Selector.isShown === true) {
                    return;
                }
                Selector.createSiteSelector();
                Selector.createSiteSelector = jQuery.noop;

                var internalLink = Selector.widget.find(Selector.internalLinkSelector);

                jQuery(this).html(Selector.widget);

                Selector.layout = internalLink.layout({
                    applyDefaultStyles: true,
                    closable: false
                });

                 /* fixing layout size */
                setTimeout(function () {
                    Selector.layout.resizeAll();
                    Selector.layout.sizePane("west", 201);
                }, 0);
            },

            onReady: function () {
                var bodyElement = this.widget.find(this.bodySelector),
                    paginationSelector = this.widget.find(this.paginationSelector),
                    rangeSelectorSelector = this.widget.find(this.rangeSelectorSelector),
                    searchEnginerCtn = this.widget.find(this.searchEngineSelector);

                this.dataView.render(bodyElement);
                this.pagination.render(paginationSelector, 'replaceWith');
                this.rangeSelector.render(rangeSelectorSelector, 'replaceWith');
                this.searchEngine.render(searchEnginerCtn);
                searchEnginerCtn.on("keyup", this.handleEnterKey.bind(this));
            },

            initPagination: function () {
                this.pagination = Paginator.createPagination(this.paginationConfig);
                this.dataStore.setStart(0).setLimit(this.pagination.getItemsOnPage());
            },

            initRangeSelector: function () {
                this.rangeSelector = RangeSelector.createPageRangeSelector(this.rangeConfig);
            },

            initSearchEngine: function () {
                this.searchEngine = require('component!searchengine').createSimpleSearchEngine(this.searchEngineConfig);
            },

            initDataStore: function () {
                this.dataStore = new DataStore.RestDataStore(this.dataStoreConfig);

                this.dataStore.addFilter("byParent", function (value, restParams) {
                    restParams.criterias = {
                        'state': [1, 2, 3],
                        'parent_uid': value
                    };

                    return restParams;
                });

                this.dataStore.addFilter("byTitle", function (value, restParams) {
                    restParams.criterias.title = value;

                    return restParams;
                });

                this.dataStore.addFilter('byBeforeDate', function (value, restParams) {
                    restParams.criterias.created_before = value;

                    return restParams;
                });

                this.dataStore.addFilter('byAfterDate', function (value, restParams) {
                    restParams.criterias.created_after = value;

                    return restParams;
                });

                this.dataStore.addFilter('byStatus', function (value, restParams) {
                    if (value === 'all') {
                        restParams.criterias.state = [0, 1, 2, 3];
                    } else if (value === 'all_active') {
                        restParams.criterias.state = [1, 3];
                    } else if (value === 'all_inactive') {
                        restParams.criterias.state = [0, 2];
                    }

                    return restParams;
                });
            },

            initDataView: function () {
                var config = {
                        css: {
                            width: "auto",
                            height: "auto"
                        }
                    };

                config.itemRenderer = jQuery.proxy(this.itemRenderer, this);
                config.dataStore = this.dataStore;
                this.dataView = DataView.createDataView(config);
            },

            bindTreeEvents: function () {

                var self = this;

                this.dataStore.on('processing', function () {
                    self.popin.mask();
                });

                this.dataStore.on('doneProcessing', function () {
                    self.popin.unmask();
                });

                this.pagination.on("pageChange", function (page, itemsToShow) {
                    self.dataStore.setLimit(itemsToShow);
                    self.dataStore.computeNextStart(page);
                    self.dataStore.execute();
                });

                this.rangeSelector.on("pageRangeSelectorChange", function (val) {
                    self.dataStore.setLimit(val);
                    self.pagination.setItemsOnPage(val); // -->will trigger pageChange
                });

                this.dataStore.on("dataStateUpdate", jQuery.proxy(this.updatePaginationInfos, this));

                this.searchEngine.on("doSearch", function (criteria) {
                    jQuery.each(criteria, function (key, value) {
                        if (criteria[key] !== undefined) {
                            var filterName = 'by' + key.charAt(0).toUpperCase() + key.slice(1);

                            if (jQuery.trim(value).length === 0) {
                                self.dataStore.unApplyFilter(filterName);
                            } else {
                                self.dataStore.applyFilter(filterName, value);
                            }
                        }
                    });

                    self.dataStore.execute();
                });
            },

            onTreeClick: function (event) {

                var self = this;

                if (event.node.is_fake === true) {
                    return;
                }

                this.searchEngine.reset();
                this.dataStore.applyFilter('byParent', event.node.id);
                this.dataStore.setStart(0);
                self.dataStore.execute();
            },

            updatePaginationInfos: function () {
                var resultTotal = this.dataStore.getTotal(),
                    nrToShow = this.dataStore.count(),
                    text = (this.tree.getSelectedNode().name !== undefined) ? this.tree.getSelectedNode().name + ' - ' : '';

                this.widget.find(this.resultInfosSelector).html(text + resultTotal + ' item(s)');

                this.pagination.setItems(resultTotal, nrToShow);
            },

            itemRenderer: function (mode, item) {
                item.created = moment.unix(item.created).format('YYYY/MM/DD HH:mm');
                item.modified = moment.unix(item.modified).format('YYYY/MM/DD HH:mm');
                var self = this,
                    html = Renderer.render(pageItemTemplate, {'item': item, 'mode': mode}),
                    element = jQuery(html);

                element.on('click', this.btnSelectSelector, function () {
                    self.dataView.selectItems(item);
                    self.close({'pageUid': item.uid, 'url': item.url});
                });

                return element;
            },

            close: function (data) {
                var object = {};

                object.url = (data.url === undefined) ? null : data.url;
                object.pageUid = (data.pageUid === undefined) ? null : data.pageUid;

                this.popin.hide();

                this.trigger("close", object);
            },

            mask: function () {
                this.maskManager.mask(this.treeSelector);
            },

            unMask: function () {
                this.maskManager.unmask(this.treeSelector);
            }
        });

        return {
            create: function () {
                var linkSelector = new LinkSelector();

                jQuery.extend(linkSelector, {}, Backbone.Events);

                return linkSelector;
            }
        };
    }
);
