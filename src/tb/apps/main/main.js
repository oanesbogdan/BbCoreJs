/* Application Déclaration */
require.config({
    paths: {
        'main.routes': 'src/tb/apps/main/routes',
        'main.controller': "src/tb/apps/main/controllers/main.controller"
    }
});

define('app.main', ['tb.core', 'tb.core.ViewManager', 'jquery', 'handlebars', 'main.controller'], function (core, ViewManager, jQuery) {
    'use strict';

    /**
     * Main application defining default templates and themes
     */
    core.ApplicationManager.registerApplication('main', {

        onInit: function () {
            this.config = {
                baseUrl: 'src/tb/apps/main',
                tbElement: null,
                tbSelector: '#bb-toolbar',
                mainContentSelector: '#bb5-maintabsContent',
                dialogContainerSelector: '.bb5-dialog-container'
            };
            if (!this.config.tbElement && !jQuery(this.config.tbSelector).length) {
                throw 'Selector "' + this.config.tbSelector + '" does not exists, MainApplication cannot be initialized.';
            }
            this.config.tbElement = jQuery(jQuery(this.config.tbSelector).get(0));

            core.set('application.main', this);

            console.log(' MainApplication is initialized ');
        },

        onStart: function () {
            var Toolbar = {
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

            ViewManager.render(Toolbar, 'src/tb/apps/main/templates/toolbar', {}, this.updatetbElement, this);

            console.log(' MainApplication onStart...');
        },

        onStop: function () {
            console.log(' MainApplication onStop...');
        },

        onError: function () {
            console.log(' MainApplication onError...');
        },

        updatetbElement: function (html) {
            this.config.tbElement.replaceWith(jQuery(html));
        },

        render: function (content) {
            var self = this;
            ViewManager.render(content.data, content.template, content.options, function(html) {
                self[content.renderFunctionName](html);
            }, content.context);
        },

        renderInMainContent: function (html) {
            jQuery(this.config.mainContentSelector).html(html);
        },

        renderInDialogContainer: function (html) {
            jQuery(this.config.dialogContainerSelector).html(html);
        }
    });
});
