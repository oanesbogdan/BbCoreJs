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
define(['jquery', 'Core/Renderer', 'text!main/tpl/toolbar', 'component!translator'], function (jQuery, Renderer, template, translator) {

    'use strict';

    /**
     * View of bundle's index
     * @type {Object} Backbone.View
     */
    var MainViewIndex = Backbone.View.extend({

        /**
         * Initialize of MainViewIndex
         * @param {Object} config
         */
        initialize: function (config) {
            this.el = config.tbSelector;
            this.toolbar = {
                menus: [
                    {
                        label: translator.translate('user'),
                        text: translator.translate('users_management'),
                        url: '#/user/index',
                        active: false,
                        items: [
                            {
                                label: translator.translate('user'),
                                text: translator.translate('users_management'),
                                url: '#user',
                                active: false
                            },
                            {
                                label: translator.translate('role'),
                                text: translator.translate('roles_management'),
                                url: '#role',
                                active: false
                            },
                            {
                                label: translator.translate('right'),
                                text: translator.translate('rights_management'),
                                url: '#right',
                                active: false
                            },
                            {
                                label: translator.translate('workflow'),
                                text: translator.translate('workflow_management'),
                                url: '#workflow',
                                active: false
                            }
                        ]
                    },
                    {
                        label: translator.translate('contribute'),
                        text: translator.translate('contribution'),
                        url: '#/contribution/index',
                        active: false,
                        items: [
                            {
                                label: translator.translate('edit'),
                                text: translator.translate('edition'),
                                url: '#/contribution/index',
                                active: false
                            },
                            {
                                label: translator.translate('page'),
                                text: translator.translate('pages_management'),
                                url: '#pages',
                                active: false
                            },
                            {
                                label: translator.translate('content'),
                                text: translator.translate('content_management'),
                                url: '#content',
                                active: false
                            },
                            {
                                label: translator.translate('library'),
                                text: translator.translate('media'),
                                url: '#library',
                                active: false
                            }
                        ]
                    },
                    {
                        label: translator.translate('bundle'),
                        text: translator.translate('extensions'),
                        url: '#/bundle/index',
                        active: false,
                        items: [
                            {
                                label: translator.translate('activate'),
                                text: translator.translate('activate_deactivate'),
                                url: '#',
                                active: false
                            },
                            {
                                label: translator.translate('admin'),
                                text: translator.translate('manage'),
                                url: '#',
                                active: false
                            }
                        ]
                    }
                ]
            };

        },

        /**
         * Render the template into the DOM with the Renderer
         * @returns {Object} MainViewIndex
         */
        render: function () {
            jQuery(this.el).html(Renderer.render(template, this.toolbar));

            return this;
        }
    });

    return MainViewIndex;
});
