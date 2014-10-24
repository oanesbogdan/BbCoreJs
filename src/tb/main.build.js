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
            'tb.core.Core': 'build/toolbar.core',
            'tb.core.ApplicationManager': 'build/toolbar.core',
            'tb.core.Mediator': 'build/toolbar.core',
            'tb.core.RouteManager': 'build/toolbar.core',
            'tb.core.ViewManager': 'build/toolbar.core',
            'tb.core.ControllerManager': 'build/toolbar.core',
            'tb.core.Utils': 'build/toolbar.core',
            'tb.core.Exception': 'src/toolbar.core',
            'tb.core.DriverHandler': 'src/toolbar.core',
            'tb.core.Request': 'src/toolbar.core',
            'tb.core.RequestHandler': 'src/toolbar.core',
            'tb.core.Response': 'src/toolbar.core',
            'tb.core.RestDriver': 'src/toolbar.core',
            'tb.core.Logger': 'src/toolbar.core',
            'tb.core.PopIn': 'src/tb/core/PopIn',
            'tb.core.PopInManager': 'src/tb/core/PopInManager'
        }
    });

    define(
        'tb.core',
        [
            'tb.core.Core',
            'tb.core.ApplicationManager',
            'tb.core.Mediator',
            'tb.core.RouteManager',
            'tb.core.ViewManager',
            'tb.core.ControllerManager',
            'tb.core.Utils',
            'tb.core.Exception',
            'tb.core.Logger'
        ],
        function (Api) {
            return Api;
        }
    );
}());