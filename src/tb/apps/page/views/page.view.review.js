define(['tb.core.Api', 'jquery', 'page.repository', 'page.form'], function (Api, jQuery, PageRepository, PageForm) {

    'use strict';

    /**
     * View of new page
     * @type {Object} Backbone.View
     */
    var PageViewReview = Backbone.View.extend({

        /**
         * Initialize of PageViewReview
         */
        initialize: function (parent_uid) {
            this.popin = Api.component('popin').createPopIn();
            //this.formBuilder = Api.component('formbuilder');
            this.parent_uid = parent_uid;
        },

        computeLayouts: function (layouts) {
            var key,
                layout,
                data = {'': ''};

            for (key in layouts) {
                if (layouts.hasOwnProperty(key)) {
                    layout = layouts[key];
                    data[layout.uid] = layout.label;
                }
            }

            return data;
        },

        onSubmit: function (data) {
            var self = this;

            if (typeof this.parent_uid === 'string') {
                data.parent_uid = this.parent_uid;
            }

            PageRepository.save(data, function () {
                self.popin.hide();
            });
        },

        onValidate: function (form, data) {
            if (!data.hasOwnProperty('title') || data.title.trim().length === 0) {
                form.addError('title', 'Title is required');
            }

            if (!data.hasOwnProperty('layout_uid') || data.layout_uid.trim().length === 0) {
                form.addError('layout_uid', 'Template is required.');
            }
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} PageViewReview
         */
        render: function () {
            var self = this;

            self.popin.setTitle('Review pages');
            self.popin.setContent('<h1>Test</h1>');
            self.popin.display();

            return this;
        }
    });

    return PageViewReview;
});