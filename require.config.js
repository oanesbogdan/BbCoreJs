require.config({
    baseUrl: 'resources/',
    catchError: true,
    paths: {
        'jquery': 'lib/jquery/jquery',
        'jsclass' : 'node_modules/jsclass/min/core',
        'underscore': 'lib/underscore/underscore',
        'tb.core': 'src/tb/main',
        'BackBone': 'lib/backbone/backbone'
    },
    'shim': {
        'BackBone': {}
    }
});
