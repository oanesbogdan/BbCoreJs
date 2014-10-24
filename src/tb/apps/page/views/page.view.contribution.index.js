define(['jquery', 'tb.core.ViewManager', 'text!page/tpl/contribution.index'], function (jQuery, ViewManager, template) {

    'use strict';

    /**
     * View of page contribution index
     * @type {Object} Backbone.View
     */
    var PageViewContributionIndex = Backbone.View.extend({

        /**
         * Point of Toolbar in DOM
         */
        el: '#bb5-maintabsContent',

        /**
         * Initialize of PageViewContributionIndex
         */
        initialize: function () {
            this.bindUiEvents();
        },

        /**
         * Events of view
         */
        bindUiEvents: function () {
            jQuery(this.el).on('click', 'ul#bb5-maintabs li a', this.manageMenu);
        },


        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} PageViewContributionIndex
         */
        render: function () {
            jQuery(this.el).html(ViewManager.render(template, this.bundle));

            return this;
        }
    });

    return PageViewContributionIndex;
});