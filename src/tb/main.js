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
(function () {
    'use strict';
    require.config({
        paths: {
            'tb.core.Api': 'src/tb/core/Api',
            'tb.core.ApplicationManager': 'src/tb/core/ApplicationManager',
            'tb.core.ApplicationContainer': 'src/tb/core/ApplicationContainer',
            'tb.core.AuthenticationHandler': 'src/tb/core/AuthenticationHandler',
            'tb.core.Mediator': 'src/tb/core/Mediator',
            'tb.core.RouteManager': 'src/tb/core/RouteManager',
            'tb.core.ViewManager': 'src/tb/core/ViewManager',
            'tb.core.TemplateRenderer': 'src/tb/core/TemplateRenderer',
            'tb.core.ControllerManager': 'src/tb/core/ControllerManager',
            'tb.core.Utils': 'src/tb/core/Utils',
            'tb.core.Exception': 'src/tb/core/Exception',
            'tb.core.DriverHandler': 'src/tb/core/DriverHandler',
            'tb.core.Request': 'src/tb/core/Request',
            'tb.core.RequestHandler': 'src/tb/core/RequestHandler',
            'tb.core.Response': 'src/tb/core/Response',
            'tb.core.RestDriver': 'src/tb/core/RestDriver',
            'tb.core.Scope': 'src/tb/core/Scope',
            'tb.component.core': 'src/tb/component/component'
        }
    });
    define('tb.core', [
        'tb.core.Api',
        'tb.core.ApplicationManager',
        'tb.core.AuthenticationHandler',
        'tb.core.Mediator',
        'tb.core.RouteManager',
        'tb.core.ViewManager',
        'tb.core.TemplateRenderer',
        'tb.core.ControllerManager',
        'tb.core.Utils',
        'tb.core.Exception',
        'tb.core.Scope',
        'tb.component.core'
    ], function (Core) {
        return Object.freeze(Core);
    });
}());