require.config({
    baseUrl: 'resources/',
    catchError: true,
    paths: {
        'jquery': 'lib/jquery/jquery',
        'jsclass' : 'lib/jsclass/class',
        'underscore': 'lib/underscore/underscore',
        'tb.core': 'src/tb/main',
        'BackBone': 'lib/backbone/backbone'
    },
    'shim': {
        'BackBone': {}
    }
});
