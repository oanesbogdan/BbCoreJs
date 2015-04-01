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

define(['tb.core', 'tb.core.Renderer', 'tb.core.ApplicationManager', 'BackBone', 'jquery'], function (Core, Renderer, ApplicationManager, Backbone, jQuery) {
    'use strict';

    var NodeSelector = Backbone.View.extend({

        nodeSelectorBtnClass: 'node-selector-btn',
        mainSelector: Core.get('wrapper_toolbar_selector'),

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

            this.elementSelector = 'form#' + this.el + ' .element_' + this.element.getKey();

            this.bindEvents();
        },

        /**
         * Bind events
         */
        bindEvents: function () {
            var self = this;

            jQuery(this.mainSelector).on('click', 'form#' + this.el + ' .' + this.nodeSelectorBtnClass, jQuery.proxy(this.onClick, this));

            Core.Mediator.subscribe('before:form:submit', function (form) {
                if (form.attr('id') === self.el) {
                    var node = self.getCurrentNode(),
                        oldNode = self.element.value,
                        element = jQuery(form).find('input[name="' + self.element.getKey() + '"]');

                    if (node.pageUid !== oldNode.pageUid) {
                        element.val('updated');
                    } else {
                        element.val('');
                    }
                }
            });
        },

        getCurrentNode: function () {
            var element = jQuery(this.elementSelector),
                inputPageUid = element.find('input.pageuid'),
                inputTitle = element.find('input.title');

            return {'pageUid': inputPageUid.val(), 'title': inputTitle.val()};
        },

        /**
         * On click event
         * Show the page tree
         */
        onClick: function () {
            var self = this,
                config = {
                    do_loading: true,
                    do_pagination: true,
                    site_uid: Core.get('site.uid'),
                    popin: true
                };

            ApplicationManager.invokeService('page.main.getPageTreeViewInstance').done(function (TreeView) {
                self.pageTreeView = new TreeView(config);

                self.bindTreeEvents();

                self.pageTreeView.getTree().done(function (tree) {
                    self.pageTree = tree;
                    self.pageTree.display();
                });
            });
        },

        /**
         * Bind tree events
         */
        bindTreeEvents: function () {
            this.pageTreeView.treeView.on('tree.dblclick', jQuery.proxy(this.onTreeDoubleClick, this));
        },

        /**
         * On double click event
         * Put uid of page into hidden input
         * @param {Object} event
         */
        onTreeDoubleClick: function (event) {
            if (event.node.is_fake === true) {
                return;
            }

            var element = jQuery(this.elementSelector),
                inputPageUid = element.find('input.pageuid'),
                inputTitle = element.find('input.title');

            inputPageUid.val(event.node.id);
            inputTitle.val(event.node.name);

            this.pageTree.hide();
        },

        /**
         * Bind events and render template
         * @returns {String}
         */
        render: function () {
            return Renderer.render(this.template, {element: this.element, item: this.element.value});
        }
    });

    return NodeSelector;
});