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

define(
    [
        'tb.core',
        'tb.core.Renderer',
        'tb.core.RequestHandler',
        'jquery',
        'text!content/tpl/dropzone',
        'component!dnd',
        'content.container',
        'content.manager',
        'jsclass'
    ],
    function (Core,
              Renderer,
              RequestHandler,
              jQuery,
              dropZoneTemplate,
              dnd,
              ContentContainer,
              ContentManager
            ) {

        'use strict';

        var dataTransfer = {},

            DndManager = new JS.Class({

                contentClass: 'bb-content',
                identifierDataAttribute: 'bb-identifier',
                idDataAttribute: 'bb-id',
                typeDataAttribute: 'bb-type',
                dndClass: 'bb-dnd',
                dropZoneAttribute: '*[dropzone="true"]',
                dropZoneClass: 'bb-dropzone',

                listen: function () {
                    this.bindEvents();
                },

                bindEvents: function () {
                    dnd('body').addListeners('classcontent', '.' + this.dndClass);

                    Core.Mediator.subscribe('on:classcontent:dragstart', this.onDragStart, this);
                    Core.Mediator.subscribe('on:classcontent:dragover', this.onDragOver, this);
                    Core.Mediator.subscribe('on:classcontent:drop', this.onDrop, this);
                    Core.Mediator.subscribe('on:classcontent:dragend', this.onDragEnd, this);
                },

                /**
                 * Show the dropzone after and before each children
                 * @param {Object} contentSets
                 */
                showHTMLZoneForContentSet: function (contentSets, currentContentId) {
                    var key,
                        contentSet,
                        childrens,
                        firstChild,
                        div = Renderer.render(dropZoneTemplate, {'class': this.dropZoneClass});

                    for (key in contentSets) {
                        if (contentSets.hasOwnProperty(key)) {
                            contentSet = contentSets[key];

                            contentSet.isChildrenOf(currentContentId);
                            if (contentSet.id !== currentContentId && !contentSet.isChildrenOf(currentContentId)) {

                                childrens = contentSet.getNodeChildrens();
                                firstChild = childrens.first();

                                if (firstChild.length > 0) {
                                    if (undefined !== currentContentId) {
                                        if (firstChild.data(this.idDataAttribute) !== currentContentId) {
                                            firstChild.before(div);
                                        }
                                    } else {
                                        firstChild.before(div);
                                    }
                                } else {
                                    contentSet.jQueryObject.prepend(div);
                                }

                                this.putDropZoneAroundContentSetChildrens(childrens, div, currentContentId);
                            }
                        }
                    }
                },

                /**
                 * Put HTML dropzone around the contentset's children
                 * @param {Object} childrens
                 * @param {String} template
                 * @param {String} currentContentId
                 */
                putDropZoneAroundContentSetChildrens: function (childrens, template, currentContentId) {
                    var self = this;

                    childrens.each(function () {
                        var currentTarget = jQuery(this),
                            next = currentTarget.next('.' + self.contentClass);

                        if (undefined !== currentContentId) {
                            if (currentTarget.data(self.idDataAttribute) !== currentContentId &&
                                    next.data(self.idDataAttribute) !== currentContentId) {

                                currentTarget.after(template);
                            }
                        } else {
                            currentTarget.after(template);
                        }
                    });
                },

                /**
                 * Delete all dropzone
                 */
                cleanHTMLZoneForContentset: function () {
                    jQuery('.' + this.dropZoneClass).remove();
                },

                /**
                 * Used into a drop event.
                 * Verify if current contentset accept the content, create the content
                 * from api and show him on the html
                 * @param {Object} config
                 */
                doDropNewContent: function (config) {
                    var self = this;

                    if (null !== config.content) {
                        if (ContentContainer.isInArray(dataTransfer.contentSetDroppable, 'type', config.content.type)) {
                            ContentManager.createElement(dataTransfer.type).done(function (data, response) {
                                var htmlRequest = ContentManager.buildRequest(response.getHeader('Location'), 'text/html');

                                RequestHandler.send(htmlRequest).done(function (html) {
                                    self.dropAsHtml(config, html);
                                    config.content.setUpdated(true);
                                });

                                return data;
                            });
                        }
                    }
                },

                /**
                 * Used into a drop event.
                 * Move the content and update state of parent(s)
                 * @param {Object} config
                 */
                doDropContent: function (config) {
                    var content,
                        parentAsContent,
                        parent,
                        newParentAsContent;

                    if (dataTransfer.id) {

                        content = ContentContainer.find(dataTransfer.id);
                        parent = content.jQueryObject.parent('.' + this.contentClass);
                        this.dropAsHtml(config, content.jQueryObject);

                        if (parent.data(this.idDataAttribute)) {
                            parentAsContent = ContentContainer.find(parent.data(this.idDataAttribute));
                        } else {
                            parentAsContent = ContentManager.buildElement(parent);
                        }
                        parentAsContent.setUpdated(true);

                        if (config.parent) {
                            if (config.parent.data(this.idDataAttribute)) {
                                newParentAsContent = ContentContainer.find(config.parent.data(this.idDataAttribute));
                            } else {
                                newParentAsContent = ContentManager.buildElement(config.parent);
                            }
                            newParentAsContent.setUpdated(true);
                        }
                    }
                },

                /**
                 * Put the content html on the good place
                 *
                 * @param {Object} config
                 * @param {String} html
                 */
                dropAsHtml: function (config, html) {
                    if (config.parent) {
                        config.parent.prepend(html);
                    } else if (config.prevSibling) {
                        config.prevSibling.after(html);
                    }
                },

                /***** EVENTS *****/

                /**
                 * Event trigged on start drag content
                 * @param {Object} event
                 */
                onDragStart: function (event) {
                    event.stopPropagation();

                    var target = jQuery(event.target),
                        content,
                        id,
                        img,
                        type;

                    event.dataTransfer.effectAllowed = 'move';

                    if (target.data(this.identifierDataAttribute)) {

                        dataTransfer.onDrop = this.doDropContent;
                        content = ContentManager.buildElement(target);
                        ContentContainer.addContent(content);

                        type = content.type;
                        id = content.id;
                        dataTransfer.id = id;

                        img = document.createElement('img');
                        img.src = content.definition.image;

                        event.dataTransfer.setDragImage(img, 50, 50);
                    } else {
                        if (target.data(this.typeDataAttribute)) {
                            dataTransfer.onDrop = this.doDropNewContent;
                            type = target.data(this.typeDataAttribute);
                        }
                    }


                    dataTransfer.type = type;

                    ContentManager.buildContentSet();

                    dataTransfer.contentSetDroppable = ContentContainer.findContentSetByAccept(type);

                    this.showHTMLZoneForContentSet(dataTransfer.contentSetDroppable, id);
                },

                /**
                 * Event trigged on drag over dropzone
                 * @param {Object} event
                 */
                onDragOver: function (event) {
                    if (jQuery(event.target).hasClass('bb-dropzone')) {
                        event.preventDefault();
                    }
                },

                /**
                 * Event trigged on drop content
                 * @param {Object} event
                 * @returns {Boolean}
                 */
                onDrop: function (event) {
                    event.stopPropagation();

                    var target = jQuery(event.target),
                        config = {},
                        prev = target.prev('.' + this.contentClass),
                        parent = target.parent();

                    config.content = ContentContainer.find(parent.data(this.idDataAttribute));
                    config.event = event;

                    if (prev.length === 0) {
                        config.parent = target.parent();
                    } else {
                        config.prevSibling = prev;
                    }

                    dataTransfer.onDrop.call(this, config);

                    return false;
                },

                /**
                 * Event trigged on drag end content
                 * @param {Object} event
                 * @returns {Boolean}
                 */
                onDragEnd: function (event) {
                    event.stopPropagation();

                    this.cleanHTMLZoneForContentset();

                    dataTransfer = {};

                    return false;
                }

                /***** EVENTS END *****/
            });

        return new JS.Singleton(DndManager);
    }
);