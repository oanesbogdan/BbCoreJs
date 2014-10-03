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
            'tb.core.Logger': 'src/toolbar.core'
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