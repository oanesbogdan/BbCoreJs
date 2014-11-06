define(['tb.core.Api', 'jquery', 'page.repository'], function (Api, jQuery, PageRepository) {

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
            this.popin = Api.component('popin').createPopIn();
            this.formBuilder = Api.component('formbuilder');
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

            PageRepository.create(data, function () {
                self.popin.hide();
            });
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} PageViewNew
         */
        render: function () {

            var config = {
                    elements: {
                        title: {
                            type: 'text',
                            label: 'Title'
                        },
                        alt_title: {
                            type: 'text',
                            label: 'Alt title'
                        },
                        target: {
                            type: 'select',
                            label: 'Target',
                            options: {
                                '_self': '_self',
                                '_blank': '_blank',
                                '_parent': '_parent',
                                '_top': '_top'
                            }
                        },
                        redirect: {
                            type: 'text',
                            label: 'Redirect to'
                        },
                        layout_uid: {
                            type: 'select',
                            label: 'Template',
                            options: {}
                        }
                    },
                    onSubmit: jQuery.proxy(this.onSubmit, this)
                },
                self = this;

            this.popin.setTitle('Create page');

            PageRepository.findLayouts(function (data) {

                config.elements.layout_uid.options = self.computeLayouts(data);
                self.formBuilder.renderForm(config).done(function (html) {
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