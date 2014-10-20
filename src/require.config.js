require.config({
    baseUrl: 'resources/',
    catchError: true,
    paths: {
        'jquery': 'lib/jquery/jquery',
        'jsclass' : 'node_modules/jsclass/min/core',
        'underscore': 'lib/underscore/underscore',
        'handlebars': 'lib/handlebars/handlebars',
        'tb.core': 'src/tb/main',
        'BackBone': 'lib/backbone/backbone',
        'moment': 'lib/moment/moment',
        'text': 'lib/requirejs-text/text',
        'URIjs': 'lib/uri.js'
    },
    'shim': {
        underscore: {
            exports: '_'
        },
        BackBone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        Bootstrap: {
            deps: ['jquery']
        }

    }
});
