/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
 */

define(
    [
        'tb.core',
        'tb.core.Renderer',
        'jquery',
        'text!tb.component/formbuilder/form/element/templates/linkSelector_item.twig',
        'tb.component/linkselector/main'
    ],
    function (Core, Renderer, jQuery, itemTemplate) {
        'use strict';

        var LinkSelector = Backbone.View.extend({

            mainSelector: Core.get('wrapper_toolbar_selector'),
            linkSelectorClass: 'add_link',
            trashClass: 'trash',
            elementsWrapperClass: 'link_elements_wrapper',

            /**
             * Initialize of node selector
             * @param {String} template
             * @param {String} formTag
             * @param {Object} element
             */
            initialize: function (template, formTag, element) {
                this.el = formTag;
                this.template = template;
                this.element = element;
                this.linkSelector = require('tb.component/linkselector/main').create();
                this.elementSelector = 'form#' + this.el + ' .element_' + this.element.getKey();
                this.bindEvents();
            },

            bindEvents: function () {
                var self = this;

                jQuery(this.mainSelector).on('click', this.elementSelector + ' .' + this.linkSelectorClass, jQuery.proxy(this.onClick, this));
                jQuery(this.mainSelector).on('click', this.elementSelector + ' .' + this.trashClass, jQuery.proxy(this.onTrash, this));

                this.linkSelector.on('close', jQuery.proxy(this.handleLinkSelection, this));

                Core.Mediator.subscribe('before:form:submit', function (form) {
                    if (form.attr('id') === self.el) {
                        var links = self.getCurrentLinks(),
                            oldLinks = self.element.value,
                            element = jQuery(form).find('input[name="' + self.element.getKey() + '"]'),
                            i,
                            updated = false;

                        if (links.length !== oldLinks.length) {
                            updated = true;
                        } else {
                            for (i = 0; i < oldLinks.length; i = i + 1) {
                                if (oldLinks[i].url !== links[i].url ||
                                        oldLinks[i].title !== links[i].title ||
                                        oldLinks[i].target !== links[i].target ||
                                        oldLinks[i].pageUid !== links[i].pageUid) {

                                    updated = true;
                                    break;
                                }
                            }
                        }

                        if (updated === true) {
                            element.val('updated');
                        } else {
                            element.val('');
                        }
                    }
                });
            },

            onTrash: function (event) {
                jQuery(event.currentTarget).parent().remove();
            },

            onClick: function () {
                this.linkSelector.show();
            },

            handleLinkSelection: function (data) {
                var elementsWrapper = jQuery(this.elementSelector).find(' .' + this.elementsWrapperClass + ' ul'),
                    item = Renderer.render(itemTemplate, {'data': data});

                elementsWrapper.append(item);
            },

            getCurrentLinks: function () {
                var elementsWrapper = jQuery(this.elementSelector).find(' .' + this.elementsWrapperClass + ' ul'),
                    links = [];

                elementsWrapper.children('li').each(function () {
                    var li = jQuery(this),
                        link = {
                            'url': li.children('input.link').val(),
                            'title': li.children('input.title').val(),
                            'pageUid': li.children('input.pageuid').val(),
                            'target': li.find('select.target option:selected').val()
                        };

                    links.push(link);
                });

                return links;
            },

            /**
             * Bind events and render template
             * @returns {String}
             */
            render: function () {
                var key,
                    items = [],
                    links = this.element.value;

                for (key in links) {
                    if (links.hasOwnProperty(key)) {
                        items.push(Renderer.render(itemTemplate, {'data': links[key]}));
                    }
                }

                return Renderer.render(this.template, {'element': this.element, 'items': items});
            }
        });

        return LinkSelector;
    }
);