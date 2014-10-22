define(['jquery', 'tb.core.ViewManager', 'text!main/tpl/toolbar'], function (jQuery, ViewManager, template) {

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
                        label: 'parameter',
                        text: 'Paramètres généraux',
                        url: '#',
                        active: true,
                        items: [
                            {
                                label: 'site',
                                text: 'Paramètres du site',
                                url: '#site',
                                active: true
                            },
                            {
                                label: 'template',
                                text: 'Gabarit',
                                url: '#appLayout/home',
                                active: false
                            },
                            {
                                label: 'theme',
                                text: 'Thème',
                                url: '#theme',
                                active: false
                            },
                            {
                                label: 'block',
                                text: 'Bloc',
                                url: '#block',
                                active: false
                            }
                        ]
                    },
                    {
                        label: 'user',
                        text: 'Gestion des droits et utilisateurs',
                        url: '#',
                        active: false,
                        items: [
                            {
                                label: 'user',
                                text: 'Gestion des utilisateurs',
                                url: '#user',
                                active: false
                            },
                            {
                                label: 'role',
                                text: 'Gestion des rôles',
                                url: '#role',
                                active: false
                            },
                            {
                                label: 'right',
                                text: 'Gestion des droits',
                                url: '#right',
                                active: false
                            },
                            {
                                label: 'workflow',
                                text: 'Gestion du workflow',
                                url: '#workflow',
                                active: false
                            }
                        ]
                    },
                    {
                        label: 'contribute',
                        text: 'Contribution',
                        url: '#',
                        active: false,
                        items: [
                            {
                                label: 'edit',
                                text: 'Edition',
                                url: '#edit',
                                active: false
                            },
                            {
                                label: 'page',
                                text: 'Gestion des pages',
                                url: '#pages',
                                active: false
                            },
                            {
                                label: 'content',
                                text: 'Gestion de contenu',
                                url: '#content',
                                active: false
                            },
                            {
                                label: 'library',
                                text: 'Médiathèque',
                                url: '#library',
                                active: false
                            }
                        ]
                    },
                    {
                        label: 'bundle',
                        text: 'Extensions',
                        url: '#/bundle/index',
                        active: false,
                        items: [
                            {
                                label: 'activate',
                                text: 'Activer / désactiver',
                                url: '#',
                                active: false
                            },
                            {
                                label: 'admin',
                                text: 'Administrer',
                                url: '#',
                                active: false
                            }
                        ]
                    }
                ]
            };

            this.bindUiEvents();
        },

        /**
         * Events of view
         */
        bindUiEvents: function () {
            jQuery(this.el).on('click', 'ul#bb5-maintabs li a', this.manageMenu);
        },

        /**
         * Manager of menu
         * @param {Object} event
         */
        manageMenu: function (event) {
            var self = jQuery(event.currentTarget);
            jQuery('ul#bb5-maintabs li.active').removeClass('active');
            self.parent('li').addClass('active');
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} MainViewIndex
         */
        render: function () {
            jQuery(this.el).html(ViewManager.render(template, this.toolbar));

            return this;
        }
    });

    return MainViewIndex;
});