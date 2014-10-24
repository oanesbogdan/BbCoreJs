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

            PageRepository.state(this.currentPage.uid, optionSelected.val());
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