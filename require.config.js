require.config({
    baseUrl: "/",
    catchError: true,
    paths: {
        "jquery": "bower_components/jquery/dist/jquery.min",
        "jsclass" : "lib/jsclass/min/core",
        "underscore":"bower_components/underscore/underscore-min",
        "bb.core": "/src/tb/main",
         "BackBone":"bower_components/backbone/backbone"
    },
    "shim": {
        "BackBone": {}
    }
});
