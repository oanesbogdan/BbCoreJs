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

        eventPropagation = function (context, process, event) {
            mediator.publish('on:' + context + ':' + process, event);
        },

        bindEl = function (el, context, process) {
            el.addEventListener(process, function (event) {
                eventPropagation(context, process, event);
            });
        },

        dnd = {
            defineAsDraggable: function (el, context) {
                var i;
                el = cleanEl(el);
                context = context || 'undefined';

                for (i = 0; i < 3; i = i + 1) {
                    if (i === 2) {
                        i = i + 4;
                    }
                    (function (process, context) {
                        bindEl(el, context, process);
                    }(dnd_process[i], context));
                }
            },

            defineAsDropzone: function (el, context) {
                var i, j;
                el = cleanEl(el);
                context = context || 'undefined';

                for (i = 0; i < 4; i = i + 1) {
                    (function (process, context) {
                        bindEl(el, context, process);
                    }(dnd_process[i + 2], context));
                }
            },

            addListeners: function (parent, context) {
                var draggable = cleanEl(parent).querySelectorAll('*[draggable="true"]'),
                    dropzone = cleanEl(parent).querySelectorAll('*[dropzone="true"]'),
                    i;
                context = context || 'undefined';

                for (i = 0; i < draggable.length; i = i + 1) {
                    this.defineAsDraggable(draggable[i], context);
                }
                for (i = 0; i < dropzone.length; i = i + 1) {
                    this.defineAsDropzone(dropzone[i], context);
                }
            }
        };

    return dnd;
});