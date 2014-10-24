define(['jquery', 'page.repository', 'tb.core.PopInManager'], function (jQuery, PageRepository, PopInManager) {

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
            this.popin = PopInManager.createPopIn();
            this.uid = uid;
        },

        /**
         * Occurs when user confirm deletion
         * Delete page and redirect to home
         */
        onDelete: function () {
            var self = this;
            var callback = function () {
                PopInManager.hide(self.popin);
                jQuery(location).attr('href', '/');
            };

            PageRepository.delete(this.uid, callback);
        },

        /**
         * Occurs when user cancel deletion
         * Close the popin
         */
        onCancel: function () {
            PopInManager.hide(this.popin);
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

            PopInManager.display(this.popin);

            return this;
        }
    });

    return PageViewDelete;
});