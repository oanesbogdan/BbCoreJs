define(['component!datastore'], function(DataStore) {

    var restDataStore = new DataStore.RestDataStore({
        resourceEndpoint : 'classcontent'
    });

    restDataStore.addFilter("byCategory", function (value, restParams){
        restParams.criterias['category'] = value;
        return restParams;
    });

    restDataStore.addFilter("byClasscontent", function (value, restParams){
        restParams.criterias['uid'] = value;
        return restParams;
    });

    restDataStore.addFilter("byTitle", function (value, restParams){
        restParams.criterias['title'] = value;
        return restParams;
    });

    restDataStore.addFilter("byType", function (value, restParams){
        restParams.criterias['type'] = value;
        return restParams;
    });

   return restDataStore;
});