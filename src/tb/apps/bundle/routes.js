define(["tb.core"], function (BbCore) {
    'use strict';

    /**
     * Register every routes of bundle application into BbCore.routeManager
     */
    BbCore.RouteManager.registerRoute('bundle', {
        prefix: 'bundle',
        routes: {
            'index': {
                url: '/index',
                action: 'BundleController:index'
            },
            'list': {
                url: '/list',
                action: 'BundleController:list'
            }
        }
    });
});
