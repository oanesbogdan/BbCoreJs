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

define(['jquery'], function (jQuery) {

    'use strict';

    var init = {

        tbSelector: '#bb5-ui',

        toolBarDisplayed: false,

        listen: function () {
            var autoStart = jQuery(this.tbSelector).attr('data-autostart');

            if (autoStart === undefined || autoStart === false) {
                jQuery(document).bind('keyup', jQuery.proxy(this.manageAccess, this));
            } else {
                this.load(true);
            }
        },

        manageAccess: function (event) {
            if (!this.toolBarDisplayed) {
                if (!event.altKey || !event.ctrlKey || 66 !== event.keyCode) {
                    return;
                }
                this.load(false);
            }
        },

        load: function (already_connected) {
            var self = this;

            require(['tb.core', 'src/tb/config'], function (Core, config) {
                require(['tb.core.RestDriver', 'component!authentication', 'component!translator'], function (RestDriver, AuthenticationHandler) {
                    RestDriver.setBaseUrl(jQuery(self.tbSelector).attr('data-api'));
                    Core.set('is_connected', false);

                    var router = null;

                    Core.ApplicationManager.on('routesLoaded', function () {
                        /*cf http://backbonejs.org/#Router for available options */
                        router = Core.RouteManager.initRouter({silent: true});
                    });

                    Core.ApplicationManager.on('appIsReady', function (app) {
                        router.navigate(app.getMainRoute());
                    });

                    if (true === already_connected) {
                        Core.initConfig(config);
                        require(['component!exceptions-viewer'], {});
                    } else {
                        Core.Mediator.subscribe('onSuccessLogin', function () {
                            self.toolBarDisplayed = true;
                            /*
                             * @TODO: Load config by a rest when user connected
                             */
                            Core.initConfig(config);
                        });
                        AuthenticationHandler.showForm();
                    }
                }, self.onError);
            }, this.onError);
        },

        onError: function (error) {
            console.log(error);
        }
    };
    return init;
});
