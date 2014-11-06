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
            var self = this;
            var callback = function () {
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