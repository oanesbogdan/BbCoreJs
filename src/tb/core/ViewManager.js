define('tb.core.ViewManager', ['tb.core.Core', 'BackBone'], function (bbCore) {
    var Api = {
        register: '',
        get: ''
    };
    bbCore.register('ViewManager', Api);

    return Api;
});