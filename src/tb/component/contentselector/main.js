require.config({
    paths: {
        'cs-templates': 'src/tb/component/contentselector/templates',
        'cs-view': 'src/tb/component/contentselector/views',
        'cs-control': 'src/tb/component/contentselector/control',
        'jqLayout': 'lib/jquery.layout/jquery.layout-latest',
        'category.formater': 'src/tb/component/contentselector/helper/category.formater',
        'pagerangeselector.control': 'src/tb/component/contentselector/control/pageselector.control',
        'content.renderer': 'src/tb/component/contentselector/helper/content.renderer',
        'content.datastore':'src/tb/component/contentselector/datastore/content.datastore'
    }
});

define(['require', 'jquery', 'text!cs-templates/layout.tpl', 'tb.component/popin/main', 'component!dataview', 'text!cs-templates/layout.test.tpl', 'content.renderer', 'cs-control/pageselector.control', 'jqLayout', "component!datastore", "component!treeview", "category.formater", 'nunjucks', 'content.datastore'], function (require, jQuery, layout, PopInMng) {
    var formater = require('category.formater'),
        ContentRenderer = require('content.renderer'),
        ContentSelectorWidget = new JS.Class({
            defautConfig: {
                autoDisplay: true,
                dialogConfig: {
                    title: "<i class='fa fa-inbox'></i> Selecteur de contenu",
                    draggable: false,
                    resizable: false,
                    autoOpen: false,
                    height: $(window).height() - (20 * 2),
                    width: $(window).width() - (20 * 2)
                },
                pageRange: [1, 10 , 1]
            },

            initialize: function (userConfig) {
                this.config = jQuery.extend({}, this.defautConfig, userConfig);
                this.isLoaded = false;
                this.widget = $(require('text!cs-templates/layout.test.tpl')).clone();
                this.popIn = this.initPopIn();
                this.bbContentLayout = this.initLayout();
                this.popIn.addOption("open", jQuery.proxy(this.onOpen, null, this)); //best of both world: this-->popin first arg --> selector
                this.options = jQuery({}, this.defautConfig, userConfig);
                this.contentRenderer = new ContentRenderer();
                this.initComponents();
                this.initControls();
                this.bindEvents();
            },

            initControls : function () {
              this.pageRangeSelector = require("cs-control/pageselector.control").createPageRangeSelector({range : this.config.pageRange});
            },

            /* create components */
            initComponents: function () {
                this.contentRestDataStore = require('content.datastore');
                this.categoryTreeView = this.createCategoryTreeView();
                this.contentRestDataStore.on("dataStateUpdate", function(){});
                this.contentDataView = this.createDataView();
                this.pager = this.createPager();
            },

            createDataView: function () {
                return require('component!dataview').createDataView({
                    allowMultiSelection: false,
                    dataStore: this.contentRestDataStore,
                    selectedItemCls: "selected",
                    css: {
                        width: "auto",
                        height: "auto"
                    },
                    /* if provided otherwise render automagicily template<-->item*/
                    itemRenderer: jQuery.proxy(this.contentRenderer.render, this.contentRenderer)
                });
            },
            createPager: function () {},
            createCategoryTreeView: function () {
                return require('component!treeview').createTreeView({});
            },

            /* create */
            createContentView: function () {},
            /**
             * This fonction is called only once for each instance
             * the tree is loaded here the prevent useless rest call
             **/

            onReady: function () {
                var self = this;
                var catTreeCtn = $(this.widget).find('.bb5-windowpane-tree .bb5-treeview').eq(0),
                    contentViewCtn = $(this.widget).find('.data-list-ctn').eq(0),
                    pageRangeCtn =  $(this.widget).find('.max-per-page-selector').eq(0);
                this.categoryTreeView.render(catTreeCtn);
                this.contentDataView.render(contentViewCtn);
                this.pageRangeSelector.render(pageRangeCtn, 'replaceWith');
                $.ajax({
                    url: 'http://bb.corejs.local/rest/1/classcontent/category'
                }).done(function (data) {
                    var fomattedData = formater(data);
                    self.categoryTreeView.setData(fomattedData);
                });
            },

            /* The flow: click on tree --> contentIsLoaded --> CollectionView isUpdated */
            initLayout: function () {
                this.selectorLayout = $(this.widget).layout({
                    applyDefaultStyles: true,
                    closable: false,
                    west__childOptions: {
                        center__paneSelector: ".inner-center",
                        north__paneSelector: ".ui-layout-north",
                        south__paneSelector: ".ui-layout-south"
                    },
                    center__childOptions: {
                        center__paneSelector: ".inner-center",
                        inner__paneSelector: ".ui-layout-north"
                    }
                });
            },

            bindEvents: function () {
                var self = this;
                $(this.widget).on('click','.bb5-sortasgrid', function (e){
                    self.contentDataView.setRenderMode('grid');
                });

                $(this.widget).on('click','.bb5-sortaslist', function (e){
                    self.contentDataView.setRenderMode('list');
                });

                /* When click on a node */
                this.categoryTreeView.on('click', function (e) {
                    var selectedNode = e.node;

                  if(selectedNode.isRoot){
                      return;
                  }
                   if (selectedNode.isACat) {
                    self.contentRestDataStore
                        .unApplyFilter('byClasscontent')
                        .applyFilter('byCategory', selectedNode.name).execute();
                   }else{
                        self.contentRestDataStore
                        .unApplyFilter('byCategory')
                        .applyFilter('byClasscontent', selectedNode.type).execute();
                   }
                });

               /* When range Changes */
               this.pageRangeSelector.on("pageRangeSelectorChange", function (val) {
                  self.contentRestDataStore.setLimit(val).execute();
               });

               /* when we have contents */
               self.contentRestDataStore.on("dataStateUpdate", $.proxy(this.updateCurrentNodeInfos, this));

            },

            updateCurrentNodeInfos : function () {
                var resultCpt = this.contentRestDataStore.count();
                $(this.widget).find(".result-infos").html(this.categoryTreeView.getSelectedNode().name+' - '+resultCpt+' item(s)');
            },

            configure: function (config) {
                this.reset();
            },

            reset: function () {},

            initPopIn: function () {
                PopInMng.init("#bb5-ui");
                return PopInMng.createPopIn(this.config.dialogConfig);
            },

            onOpen: function (selector) {
                selector.onReady();
                selector.onReady = jQuery.noop;
                if (!selector.isLoaded) {
                    $(this).html(selector.widget);
                }
                selector.selectorLayout.resizeAll();
                selector.isLoaded = true;
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
        }
    }
});