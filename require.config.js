require.config({
    baseUrl: 'resources/',
    catchError: true,
    paths: {
        'jquery': 'bower_components/jquery/dist/jquery.min',
        'jsclass' : 'bower_components/jsclass/class',
        'underscore':'bower_components/underscore/underscore-min',
        'bb.core': 'src/tb/main',
        'BackBone':'bower_components/backbone/backbone'
    },
    'shim': {
        'BackBone': {}
    }
});
