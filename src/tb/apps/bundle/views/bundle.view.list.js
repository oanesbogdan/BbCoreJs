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
define(['jquery', 'tb.core.ViewManager', 'text!bundle/tpl/list', 'bundle.view.index', 'jqueryui'], function (jQuery, ViewManager, template, ListView) {
    'use strict';

    /**
     * View of bundle's list
     * @type {Object} Backbone.View
     */
    var BundleViewList = Backbone.View.extend({

        /**
         * Point of listing bundles in DOM
         */
        el: '.bb5-dialog-container',

        /**
         * Initialize of BundleViewList
         * @param {Object} config
         */
        initialize: function (config) {
            this.bundles = config.datas;
            this.categories = this.sortBundles(config.datas);
        },

        /**
         * Events of the view
         */
        events: {
            'click .bb5-data-toggle .bb5-data-toggle-header': 'doToggleHeaderEvent',
            'click .bb5-list-data-item': 'doToggleDataItemEvent'
        },

        /**
         * Show or hide the header of the current item
         * @param {Object} event
         */
        doToggleHeaderEvent: function (event) {
            var self = jQuery(event.currentTarget);
            jQuery('#extensions').find('.bb5-data-toggle.open').not(self.parent()).removeClass('open');
            self.parent().toggleClass('open');
        },

        /**
         * Show the current bundle into the index of bundle (Toolbar)
         * @param {Object} event
         */
        doToggleDataItemEvent: function (event) {
            var self = jQuery(event.currentTarget),
                bundles = this.bundles.bundles,
                bundleId = self.attr('id'),
                key,
                bundle,
                currentKey = null,
                view;

            for (key in bundles) {
                if (bundles.hasOwnProperty(key)) {
                    bundle = bundles[key];
                    if (bundle.id === bundleId) {
                        currentKey = key;
                        break;
                    }
                }
            }

            if (currentKey !== null) {
                view = new ListView({datas: this.bundles}, currentKey);
                view.render();
            }
        },

        /**
         * Sort the list of bundles with them categories.
         * If an bundle don't have category, an Default category is created
         * @param {Object} data
         * @returns {Object}
         */
        sortBundles: function (data) {
            var bundles = data.bundles,
                key,
                bundle,
                category,
                categoryKey,
                categoriesArray = {};

            for (key in bundles) {
                if (bundles.hasOwnProperty(key)) {
                    bundle = bundles[key];
                    if (bundle.hasOwnProperty(category) && bundle.category.length > 0) {
                        for (categoryKey in bundle.category) {
                            if (bundle.category.hasOwnProperty(categoryKey)) {
                                category = bundle.category[categoryKey];
                                if (!categoriesArray.hasOwnProperty(category)) {
                                    categoriesArray[category] = [];
                                }
                                categoriesArray[category].push(bundle);
                            }
                        }
                    } else {
                        if (!categoriesArray.hasOwnProperty('Default')) {
                            categoriesArray['Default'] = [];
                        }
                        categoriesArray['Default'].push(bundle);
                    }
                }
            }

            return categoriesArray;
        },

        /**
         * Create the dialog for listing of bundles
         */
        computeDialog: function () {
            jQuery('#extensions').dialog({
                position: {my: 'left top', at: 'left bottom+2', of: jQuery('#bb5-maintabsContent')},
                width: 323,
                height: 400 > jQuery(window).height() - (20 * 2) ? jQuery(window).height() - (20 * 2) : 400,
                autoOpen: false,
                appendTo: '#bb5-ui .bb5-dialog-container',
                dialogClass: 'ui-dialog-no-title ui-dialog-pinned-to-banner'
            });
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} BundleViewList
         */
        render: function () {
            jQuery(this.el).html(ViewManager.render(template, {categories: this.categories}));

            this.computeDialog();

            jQuery('#extensions').dialog('open');

            return this;
        }
    });

    return BundleViewList;
});