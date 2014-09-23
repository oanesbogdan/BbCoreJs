module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '',
                process: function (src, filepath) {
                    return '\n/* ' + filepath + ' */\n' + src;
                }
            },
            toolbar: {
                src: ['src/toolbar/**/*.js'],
                dest: 'build/toolbar.js'
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "./",
                    mainConfigFile: "require.config.js",
                    name: "<%= concat.toolbar.dest %>", // assumes a production build using almond
                    out: "build/<%= pkg.name %>.min.js"
                }
            }
        },
        bower: {
            target: {
                rjsConfig: 'app/config.js'
            },
            install: {}
        },

        requirejs_config_generator: {
            development: {
                "baseUrl": "",
                "deps": [],
                "paths": {},
                "shim": {}
            },
            production: {

            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
            },
            dist: {
                files: {
                    '<%= concat.toolbar.dest %>.min.js': ['<%= concat.toolbar.dest %>']
                }
            }
        },
        cssmin: {
            compress: {
                files: {
                    'css/style.css': ['src/css/style.css']
                }
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'qunit']
        },

        csslint: {
            strict: {
                options: {
                    "import": 2
                },
                src: ['src/css/*.css']
            }
        },

        jasmine: {
            test: {
                src: 'src/js/*.js',
                options: {
                    specs: 'test/*.spec.js',
                    vendor: 'bower_components/**/*.js'
                }
            },

            istanbul: {
                src: '<%= jasmine.test.src %>',
                options: {
                    vendor: '<%= jasmine.test.options.vendor %>',
                    specs: '<%= jasmine.test.options.specs %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/json/coverage.json',
                        report: [
                            {type: 'lcov', options: {dir: 'coverage'}},
                            {type: 'text-summary'}
                        ]
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-requirejs'); //enabling plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-istanbul-coverage');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-requirejs-config-generator');

    grunt.registerTask('default', ['bower', 'concat', 'requirejs']);
    /* grunt:test */
    grunt.registerTask("test",["jasmine"]);
};