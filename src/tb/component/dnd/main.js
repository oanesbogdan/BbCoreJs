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
define(['tb.core'], function (Core) {
    'use strict';

    var mediator = Core.Mediator,

        dnd_process = [
            'dragstart',
            'drag',
            'dragenter',
            'dragleave',
            'dragover',
            'drop',
            'dragend'
        ],

        cleanEl = function (el) {
            if (el instanceof Node) {
                return el;
            }
            return el.get(0);
        },

        eventPropagation = function (process, event) {
            var content_type = event.target.getAttribute('data-dnd-type') || 'undefined';
            mediator.publish('on:' + content_type + ':' + process, event);
        },

        bindEl = function (el, process) {
            el.addEventListener(process, function (event) {
                eventPropagation(process, event);
            });
        },

        dnd = {
            defineAsDraggable: function (el) {
                el = cleanEl(el);
                el.addEventListener(dnd_process[0], function (event) {
                    event.dataTransfer.effectAllowed = 'move';
                    eventPropagation(dnd_process[0], event);
                    return true;
                });
                bindEl(el, dnd_process[1]);
                bindEl(el, dnd_process[6]);
            },

            defineAsDropzone: function (el) {
                var i, j;
                el = cleanEl(el);
                for (i = 0; i < 4; i = i + 1) {
                    j = i + 2;
                    (function (process) {
                        bindEl(el, process);
                    }(dnd_process[j]));
                }
            },

            addListeners: function (parent) {
                var draggable = cleanEl(parent).querySelectorAll('*[draggable="true"]'),
                    dropzone = cleanEl(parent).querySelectorAll('*[dropzone="true"]'),
                    i;

                for (i = 0; i < draggable.length; i = i + 1) {
                    this.defineAsDraggable(draggable[i]);
                }
                for (i = 0; i < dropzone.length; i = i + 1) {
                    this.defineAsDropzone(dropzone[i]);
                }
            }
        };

    return dnd;
});