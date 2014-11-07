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
        initialize: function (parent) {
            this.parent = parent;
            this.popin = Api.component('popin').createPopIn();
            this.formBuilder = Api.component('formbuilder');
        },

        onSubmit: function (data) {
            var self = this;

            if (this.parent !== undefined) {
                data['parent'] = this.parent;
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
         * @returns {Object} PageViewNew
         */
        render: function () {

            var self = this;

            this.popin.setTitle('Create page');

            PageForm.create().done(function (formConfig) {

                formConfig.onSubmit = jQuery.proxy(self.onSubmit, self);
                formConfig.onValidate = jQuery.proxy(self.onValidate, self);

                self.formBuilder.renderForm(formConfig).done(function (html) {

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