define(["tb.core"], function (BbCore) {
    'use strict';

    /**
     * Register every routes of page application into BbCore.routeManager
     */
    BbCore.RouteManager.registerRoute('page', {
        prefix: 'page',
        routes: {
            'contribution.index': {
                url: '/contribution/index',
                action: 'MainController:contributionIndex'
            },
            'delete': {
                url: '/delete/:uid',
                action: 'MainController:delete'
            }
        }
    });
});
