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

define(['jquery', 'tb.core.ViewManager', 'text!page/tpl/contribution/index', 'page.repository'], function (jQuery, ViewManager, template, PageRepository) {

    'use strict';

    /**
     * View of page contribution index
     * @type {Object} Backbone.View
     */
    var PageViewContributionIndex = Backbone.View.extend({

        /**
         * Point of Toolbar in DOM
         */
        el: '#contrib-tab-apps',

        /**
         * Initialize of PageViewContributionIndex
         */
        initialize: function (config) {
            this.currentPage = config.data;

            this.bindUiEvents();
        },

        /**
         * Events of view
         */
        bindUiEvents: function () {
            jQuery(this.el).on('change', '#page-state-select', jQuery.proxy(this.manageState, this));
        },

        /**
         * Change the state of the page
         * @param {Object} event
         */
        manageState: function (event) {
            var self = jQuery(event.currentTarget),
                optionSelected = self.children('option:selected');

            PageRepository.save({uid: this.currentPage.uid, state: optionSelected.val()});
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} PageViewContributionIndex
         */
        render: function () {
            jQuery(this.el).html(ViewManager.render(template, {'page': this.currentPage}));

            return this;
        }
    });

    return PageViewContributionIndex;
});