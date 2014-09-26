require.config({
    baseUrl: './',
    urlArgs: 'cb=' + Math.random(),
    paths: {
        'jquery': 'lib/jquery/jquery',
        'jsclass' : 'node_modules/jsclass/min/core',
        'underscore': 'lib/underscore/underscore',
        'tb.core': 'src/tb/main',
        'BackBone': 'lib/backbone/backbone',
        'jasmine': 'node_modules/grunt-contrib-jasmine/vendor/jasmine-2.0.0/jasmine',
        'jasmine-html': 'node_modules/grunt-contrib-jasmine/vendor/jasmine-2.0.0/jasmine-html',
        'spec': 'specs/'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        BackBone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine'],
            exports: 'jasmine'
        }
    }
});