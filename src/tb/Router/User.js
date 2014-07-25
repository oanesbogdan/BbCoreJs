(function (window) {
    "use strict";

    require(['Backbone'], function (Backbone) {
        var UserRouter = Backbone.Router.extend({
        routes: {
            "user/login": 'authenticate'
        }

        var user_router = new AppRouter;
        user_router.on('route:authenticate', function () {
            alert( "Get post number " + id );
        });
    });
} (window));