/*jslint unparam: true*/
define(['component!datastore', 'jsclass'], function (DataStore) {
    'use strict';
    var restDataStore = new DataStore.RestDataStore({
        resourceEndpoint: 'classcontent',
        rewriteResourceEndpoint: function (type, params) {
            if (type === "delete") {
                return "classcontent/" + params.type;
            }
        }
    });

    restDataStore.addFilter("byCategory", function (value, restParams) {
        restParams.criterias.category = value;
        return restParams;
    });

    restDataStore.addFilter("byClasscontent", function (value, restParams) {
        restParams.criterias.uid = value;
        return restParams;
    });

    restDataStore.addFilter("byTitle", function (value, restParams) {
        restParams.criterias.searchField = value;
        return restParams;

    });

    restDataStore.addFilter("byBeforeDate", function (value, restParams) {
        restParams.criterias.beforeDate = value;
        return restParams;
    });

    restDataStore.addFilter("byAfterDate", function (value, restParams) {
        restParams.criterias.afterDate = value;
        return restParams;
    });

    restDataStore.on("unApplyFilter:byTitle", function (lastValue, restParams) {
        delete restParams.criterias.searchField;
    });

    restDataStore.on("unApplyFilter:byBeforeDate", function (lastValue, restParams) {
        delete restParams.criterias.beforeDate;
    });

    restDataStore.on("unApplyFilter:byAfterDate", function (lastValue, restParams) {
        delete restParams.criterias.afterDate;
    });

    return restDataStore;
});