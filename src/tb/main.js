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
            'tb.core.ControllerManager': 'src/tb/core/ControllerManager',
            'tb.core.Utils': 'src/tb/core/Utils',
            'tb.core.Exception': 'src/tb/core/Exception'
        }
    });

    define(
        'tb.core',
        [
            'tb.core.Api',
            'tb.core.ApplicationManager',
            'tb.core.Mediator',
            'tb.core.RouteManager',
            'tb.core.ViewManager',
            'tb.core.ControllerManager',
            'tb.core.Utils'
        ],
        function (Api) {
            return Api.dump();
        }
    );
}());