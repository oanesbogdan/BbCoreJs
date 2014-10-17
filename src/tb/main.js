(function () {
    'use strict';
    require.config({
        paths: {
            'tb.core.Api': 'src/tb/core/Api',
            'tb.core.ApplicationManager': 'src/tb/core/ApplicationManager',
            'tb.core.ApplicationContainer': 'src/tb/core/ApplicationContainer',
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
            'tb.core.Logger': 'src/tb/core/Logger'
        }
    });
    define('tb.core', ['tb.core.Api', 'tb.core.ApplicationManager', 'tb.core.Mediator', 'tb.core.RouteManager', 'tb.core.ViewManager', 'tb.core.TemplateRenderer', 'tb.core.ControllerManager', 'tb.core.Utils', 'tb.core.Exception', 'tb.core.Logger'], function (Core) {
        return Object.freeze(Core);
    });
}());