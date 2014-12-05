require.config({
    paths: {
        'dataStore': 'src/tb/component/datastore/DataStore'
    }
});

define(['dataStore'], function (DataStore) {
    return DataStore;
});