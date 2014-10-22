define(['jquery', 'tb.core.ViewManager', 'text!bundle/tpl/index', 'bundle.repository'], function (jQuery, ViewManager, template, BundleRepository) {

    'use strict';

    /**
     * View of bundle's index
     * @type {Object} Backbone.View
     */
    var BundleViewIndex = Backbone.View.extend({

        /**
         * Point of Toolbar in DOM
         */
        el: '#bb5-maintabsContent',

        /**
         * Point of bundle's application in DOM
         */
        listEl: '#extensions',

        /**
         * Initialize of BundleViewIndex
         * The default key is used for show the first bundle in index
         * @param {Object} config
         * @param {String} defaultKey
         */
        initialize: function (config, defaultKey) {
            var currentBundle = config.datas.bundles[0];
            if (defaultKey !== undefined) {
                currentBundle = config.datas.bundles[defaultKey];
            }

            this.bundle = {bundle: currentBundle};
        },

        /**
         * Events of the view
         */
        events: {
            'click .btn-dialog-extension': 'doListDialog',
            'click div.activation-btn-group a': 'doExtensionActivation'
        },

        /**
         * Show or Hide a dialog with bundle list
         */
        doListDialog: function () {
            if (jQuery(this.listEl).dialog('isOpen')) {
                jQuery(this.listEl).dialog('close');
            } else {
                jQuery(this.listEl).dialog('open');
            }
        },

        /**
         * Enable or disable the current bundle
         * @param {Object} event
         */
        doExtensionActivation: function (event) {
            var self = jQuery(event.currentTarget),
                bundleId = self.parent().attr('data-bundle-id');

            self.siblings('a').removeClass('active');
            self.addClass('active');

            if (self.hasClass('enable')) {
                BundleRepository.active(true, bundleId);
            } else if (self.hasClass('disable')) {
                BundleRepository.active(false, bundleId);
            }
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} BundleViewIndex
         */
        render: function () {
            jQuery(this.el).html(ViewManager.render(template, this.bundle));

            return this;
        }
    });

    return BundleViewIndex;
});