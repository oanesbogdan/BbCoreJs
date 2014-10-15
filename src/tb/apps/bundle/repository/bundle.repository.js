define(['tb.core.DriverHandler', 'tb.core.RestDriver', 'jsclass'], function (CoreDriverHandler, CoreRestDriver) {
    'use strict';

    var criterias = {},
        datas = {},
        orderBy = {},
        start = 0,
        limit = null;

    var BundleRepository = new JS.Class({
        TYPE: 'bundle',

        initialize: function () {
            CoreRestDriver.setBaseUrl('/rest/1/');
            CoreDriverHandler.addDriver('rest', CoreRestDriver);
        },

<<<<<<< Updated upstream
=======
        findFirst: function(callback) {
            CoreDriverHandler.read(this.TYPE, criterias, orderBy, start, 1, callback);
        },

>>>>>>> Stashed changes
        list: function(callback) {
            CoreDriverHandler.read(this.TYPE, criterias, orderBy, start, limit, callback);
        }
    });

    return new JS.Singleton(BundleRepository);
});
