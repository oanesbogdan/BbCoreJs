define(['jquery', 'tb.core.ViewManager', 'text!contribution/tpl/index'], function (jQuery, ViewManager, template) {

    'use strict';

    /**
     * View of contribution's index
     * @type {Object} Backbone.View
     */
    var BundleViewIndex = Backbone.View.extend({

        /**
         * Point of Toolbar in DOM
         */
        el: '#bb5-maintabsContent',

        /**
         * Initialize of ContributionViewIndex
         */
        initialize: function () {
            this.bindUiEvents();
        },

        /**
         * Events of view
         */
        bindUiEvents: function () {
            jQuery(this.el).on('click', 'ul#edit-tab li', this.manageMenu);
        },

        manageMenu: function (event) {
            var self = jQuery(event.currentTarget);
            jQuery('ul#edit-tab li.active').removeClass('active');
            self.addClass('active');
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} BundleViewIndex
         */
        render: function () {
            jQuery(this.el).html(ViewManager.render(template, this.contribution));

            return this;
        }
    });

    return BundleViewIndex;
});