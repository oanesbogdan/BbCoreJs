/* Application Déclaration */
require.config({
    paths: {
        'main.routes': 'src/tb/apps/main/routes',
        'main.controller': "src/tb/apps/main/controllers/main.controller"
    }
});

define('app.main', ['tb.core', 'jquery', 'handlebars', 'main.controller'], function (core, jQuery) {
    'use strict';

    /**
     * Main application defining default templates and themes
     */
    core.ApplicationManager.registerApplication('main', {
        config: {
            baseUrl: 'src/tb/apps/main',
            tbElement: null,
            tbSelector: '#bb-toolbar'
        },

        onInit: function () {
            if (!this.config.tbElement && !jQuery(this.config.tbSelector).length) {
                throw 'Selector "' + this.config.tbSelector + '" does not exists, MainApplication cannot be initialized.';
            } else {
                this.config.tbElement = jQuery(jQuery(this.config.tbSelector).get(0));
            }

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
                            url: '#',
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
            
            require(['tb.core.Request', 'tb.core.RequestHandler'], function(Request, RequestHandler) {
                var request = new Request();
                request.setContentType('text/plain')
                        .setMethod('GET')
                        .setUrl('../src/tb/apps/main/templates/toolbar.tpl');
                
                RequestHandler.send(request, function(response) {
                   var template = Handlebars.compile(response);
                });
            });
            
            var template = Handlebars.compile('<div id="bb5-ui"><nav id="bb5-navbar-primary" class="navbar navbar-inverse clearfix" role="navigation"><ul class="nav nav-tabs bb5-ui-width-setter" id="bb5-maintabs">{{#each menus}}<li class="dropdown{{#if active}} active{{/if}}"><a data-toggle="dropdown" class="dropdown-toggle" id="myTabDrop1" href="{{url}}">{{text}} <b class="caret"></b></a><ul aria-labelledby="{{label}}" role="menu" class="dropdown-menu">{{#each items}}<li class="{{#if active}}active{{/if}}"><a data-toggle="tab" tabindex="-1" href="{{url}}">{{text}}</a></li>{{/each}}</ul></li>{{/each}}</ul><ul class="nav navbar-nav pull-right"></ul></nav><nav id="bb5-navbar-secondary" class="navbar navbar-default"><div class="navbar-header"><span class="navbar-brand"><img src="img/backbuilder5.png" alt="BackBuilder5"></span><div class="bb5-ui-width-setter"><span class="bb5-ui-tab-title"></span></div><ul class="nav navbar-nav pull-right"></ul></div></nav></div>');
            var html = template(Toolbar);
            
            this.config.tbElement.html(html);
            
            console.log(' MainApplication onStart...');
        },

        onStop: function () {
            console.log(' MainApplication onStop...');
        },

        onError: function () {
            console.log(' MainApplication onError...');
        }

    });
});
