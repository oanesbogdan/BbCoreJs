define('tb.core.ViewManager', ['tb.core.Api', 'BackBone'], function (bbCore) {
    var Api = {
        register: '',
        get: ''
    };
    bbCore.register('ViewManager', Api);

    return Api;
});