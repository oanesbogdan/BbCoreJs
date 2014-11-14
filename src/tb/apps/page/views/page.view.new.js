define(['tb.core.Api', 'jquery', 'page.repository', 'page.form'], function (Api, jQuery, PageRepository, PageForm) {

    'use strict';

    /**
     * View of new page
     * @type {Object} Backbone.View
     */
    var PageViewNew = Backbone.View.extend({

        /**
         * Initialize of PageViewNew
         */
        initialize: function (parent_uid) {
            this.popin = Api.component('popin').createPopIn();
            this.formBuilder = Api.component('formbuilder');
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

            this.popin.mask();
            PageRepository.save(data, function () {
                self.popin.unmask();
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
         * @returns {Object} PageViewNew
         */
        render: function () {
            var self = this;

            this.popin.setTitle('Create page');

            PageForm.new().done(function (configForm) {
                configForm.onSubmit = jQuery.proxy(self.onSubmit, self);
                configForm.onValidate = self.onValidate;
                self.formBuilder.renderForm(configForm).done(function (html) {
                    self.popin.setContent(html);
                    self.popin.display();
                }).fail(function (e) {
                    console.log(e);
                });
            });

            return this;
        }
    });

    return PageViewNew;
});