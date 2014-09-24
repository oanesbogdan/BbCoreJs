require.config({
    baseUrl: 'resources/',
    catchError: true,
    paths: {
        'jquery': 'build/libs.min',
        'jsclass' : 'lib/jsclass/class',
        'underscore':'build/libs.min',
        'tb.core': 'build/main.min', // 'src/tb/main',
        'BackBone':'lib/backbone/backbone'
    },
    'shim': {
        'BackBone': {}
    }
});