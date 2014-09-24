require.config({
    baseUrl: 'resources/',
    catchError: true,
    paths: {
        'jquery': 'build/libs.min',
        'jsclass' : 'build/libs.min',
        'underscore':'build/libs.min',
        'tb.core': 'build/main.min', // 'src/tb/main',
        'BackBone':'build/libs.min'
    },
    'shim': {
        'BackBone': {}
    }
});