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
define(
    [
        'tb.core.ApplicationManager',
        'jquery',
        'tb.core.Renderer',
        'text!bundle/tpl/index',
        'bundle.repository'
    ],
    function (ApplicationManager, jQuery, Renderer, template, BundleRepository) {

        'use strict';

        /**
         * View of bundle's index
         * @type {Object} Backbone.View
         */
        var BundleViewIndex = Backbone.View.extend({

            /**
             * Point of bundle's application in DOM
             */
            listEl: '#extensions',

            id: 'bundle-tab',

            /**
             * Initialize of BundleViewIndex
             * The default key is used for show the first bundle in index
             * @param {Object} config
             * @param {String} defaultKey
             */
            initialize: function (config, defaultKey) {

                if (config.bundles !== undefined) {
                    var currentBundle = config.bundles[0];

                    if (defaultKey !== undefined) {
                        currentBundle = config.bundles[defaultKey];
                    }

                    this.bundle = currentBundle;
                }

                this.force = (config.force === true);
                this.doBinding = (config.doBinding === true);
            },

            /**
             * Events of the view
             */
            bindEvents: function () {
                var element = jQuery('#' + this.id);

                element.off('click').on('click', '.btn-dialog-extension', this.doListDialog);
                element.off('click').on('click', 'div.activation-btn-group a', this.doExtensionActivation);
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
             * Render the template into the DOM with the Renderer
             * @returns {Object} BundleViewIndex
             */
            render: function () {
                var self = this;

                ApplicationManager.invokeService('main.main.toolbarManager').done(function (Service) {
                    Service.append(self.id, Renderer.render(template, {'bundle': self.bundle}), self.force);

                    if (self.doBinding === true) {
                        self.bindEvents();
                    }
                });

                return this;
            }
        });

        return BundleViewIndex;
    }
);