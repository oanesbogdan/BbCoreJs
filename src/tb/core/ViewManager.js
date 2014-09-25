define('tb.core.ViewManager', ['tb.core.Api', 'BackBone'], function (Api) {
    var ViewManager = {
        register: '',
        get: ''
    };
    Api.register('ViewManager', ViewManager);

    return ViewManager;
});