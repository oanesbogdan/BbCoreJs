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

define(['tb.core.Api', 'jquery', 'page.repository'], function (Api, jQuery, PageRepository) {

    'use strict';

    /**
     * View of delete page
     * @type {Object} Backbone.View
     */
    var PageViewDelete = Backbone.View.extend({

        /**
         * Initialize of PageViewDelete
         */
        initialize: function (uid) {
            this.popin = Api.component('popin').createPopIn();
            this.uid = uid;
        },

        /**
         * Occurs when user confirm deletion
         * Delete page and redirect to home
         */
        onDelete: function () {
            var self = this,
                callback = function () {
                self.popin.hide();
                jQuery(location).attr('href', '/');
            };

            PageRepository.delete(this.uid, callback);
        },

        /**
         * Occurs when user cancel deletion
         * Close the popin
         */
        onCancel: function () {
            this.popin.hide();
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} PageViewDelete
         */
        render: function () {
            this.popin.setTitle('Suppression de page');
            this.popin.setContent('Supprimer la page ?');
            this.popin.addButton('Supprimer', jQuery.proxy(this.onDelete, this));
            this.popin.addButton('Annuler', jQuery.proxy(this.onCancel, this));

            this.popin.display(this.popin);

            return this;
        }
    });

    return PageViewDelete;
});