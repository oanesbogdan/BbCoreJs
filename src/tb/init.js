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

define(['jquery'], function (jQuery) {

    var init = {

        applicationConfig: {

            appPath: 'resources/src/tb/apps',

            /*ne charge que les onglets qui se trouvent dans 'applications'*/
            active: 'main',

            route: '', // to change: App should know

            applications: {
                main: {
                    label: 'Main',
                    config: {mainRoute: 'appMain/index'}
                },
                layout: {
                    label: 'Layout',
                    config: {mainRoute: 'appLayout/home'}
                },
                content: {
                    label: 'Edition du contenu',
                    config: {}
                },
                bundle: {
                    label: 'Bundle',
                    config: {mainRoute: 'bundle/index'}
                },
                contribution: {
                    label: 'Contribution',
                    config: {mainRoute: 'contribution/index'}
                }
            }
        },

        toolBarDisplayed: false,

        listen: function () {
            jQuery(document).bind('keyup', jQuery.proxy(this.manageAccess, this));
        },

        manageAccess: function (event) {
            if (!this.toolBarDisplayed) {
                if (!event.altKey || !event.ctrlKey || 66 !== event.keyCode) {
                    return;
                } else {
                    this.load();
                }
            }
        },

        load: function () {
            var self = this;
            require(['tb.core'], function (Core) {

                Core.set('is_connected', false);

                var router = null;

                Core.ApplicationManager.on('routesLoaded', function () {
                    /*cf http://backbonejs.org/#Router for available options */
                    router = Core.RouteManager.initRouter({silent: true});
                });

                Core.ApplicationManager.on('appIsReady', function (app) {
                    router.navigate(app.getMainRoute());
                });

                Core.authentication.on('onSuccessLogin', function () {
                    self.toolBarDisplayed = true;
                    Core.ApplicationManager.init(self.applicationConfig);
                });

                Core.authentication.showForm();

            }, this.onError);
        },

        onError: function (error) {
            console.log(error);
        }
    };
    return init;
});