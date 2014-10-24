define(['jquery', 'page.repository', 'tb.core.PopInManager'], function (jQuery, PageRepository, PopInManager) {

    'use strict';

    /**
     * View of new page
     * @type {Object} Backbone.View
     */
    var PageViewNew = Backbone.View.extend({

        /**
         * Initialize of PageViewNew
         */
        initialize: function () {
            this.popin = PopInManager.createPopIn();
        },

        onSave: function () {
            console.log('save');
            PopInManager.hide(this.popin);
        },

        /**
         * Occurs when user cancel deletion
         * Close the popin
         */
        onCancel: function () {
            console.log('cancel');
            PopInManager.hide(this.popin);
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} PageViewNew
         */
        render: function () {
            this.popin.setTitle('Créer une page');
            this.popin.addButton('Enregistrer', jQuery.proxy(this.onSave, this));
            this.popin.addButton('Annuler', jQuery.proxy(this.onCancel, this));

            PopInManager.display(this.popin);

            return this;
        }
    });

    return PageViewNew;
});