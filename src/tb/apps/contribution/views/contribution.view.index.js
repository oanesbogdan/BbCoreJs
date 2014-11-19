define(
    [
        'jquery',
        'tb.core.ApplicationManager',
        'tb.core.ViewManager',
        'text!contribution/tpl/index'
    ],
    function (jQuery, ApplicationManager, ViewManager, template) {

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
                jQuery(this.el).on('click', '#new-page', this.showNewPage);
            },

            showNewPage: function () {
                ApplicationManager.invokeService('page.main.findCurrentPage').done(function (data) {
                    if (data.hasOwnProperty(0)) {
                        data = data[0];
                    }

                    return ApplicationManager.invokeService('page.main.newPage', data.uid);
                });
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
    }
);