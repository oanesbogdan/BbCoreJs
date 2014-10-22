define(['tb.core'], function (bbCore) {
    'use strict';

    /**
     * Register every routes of content application into bbCore.routeManager
     */
    bbCore.RouteManager.registerRoute('main', {
        prefix: 'appMain',
        routes: {
            index: {
                url: '/index',
                action: 'MainController:index'
            }
        }
    });
});
