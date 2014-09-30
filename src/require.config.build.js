require.config({
    baseUrl: 'resources/',
    catchError: true,
    paths: {
        'jquery': 'lib/jquery/jquery',
        'jsclass' : 'lib/jsclass/class',
        'underscore': 'lib/underscore/underscore',
        'tb.core': 'build/main.min', // 'src/tb/main',
        'BackBone': 'lib/backbone/backbone',
        'moment': 'lib/moment/moment'
    },
    'shim': {
        'BackBone': {}
    }
});