module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /**
         * toolbar files and directories
         */
        dir: {
            src: 'src/tb',
            build: 'build',
            lib: 'lib',
            specs: 'specs'
        },
        components: {
            core: 'toolbar.core',
            config: 'require.config'
        },
        libs: {
            backbone: 'backbone/backbone.js',
            handlebars: 'handlebars/handlebars.js',
            jquery: 'jquery/jquery.js',
            jsclass: 'jsclass/class.js',
            parallel: 'paralleljs/lib/*.js',
            underscore: 'underscore/underscore.js'
        },

        /**
         * application dependencies
         */
        bower: {
            target: {
                rjsConfig: 'app/config.js'
            },
            install: {}
        },

        requirejs: {
            compile: {
                options: {
                    baseUrl: "./",
                    mainConfigFile: "<%= dir.src %>/require.config.js",
                    name: "<%= concat.core.dest %>",
                    out: "<%= dir.build %>/<%= components.core %>.min.js"
                }
            }
        },

        /**
         * application building
         */
        concat: {
            options: {
                separator: '',
                process: function (src, filepath) {
                    return '\n/* ' + filepath + ' */\n' + src;
                }
            },
            core: {
                src: ['<%= dir.src %>/core/**/*.js'],
                dest: '<%= dir.build %>/<%= components.core %>.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
            },
            core: {
                files: {
                    '<%= dir.build %>/<%= components.core %>.min.js': ['<%= concat.core.dest %>']
                }
            },
            main: {
                files: {
                    '<%= dir.build %>/main.min.js': ['<%= dir.src %>/main.build.js']
                }
            },
            libs: {
                files: {
                    '<%= dir.build %>/libs.min.js': [
                        '<%= dir.lib %>/<%= libs.jquery %>',
                        '<%= dir.lib %>/<%= libs.underscore %>',
                        '<%= dir.lib %>/<%= libs.jsclass %>',
                        '<%= dir.lib %>/<%= libs.backbone %>',
                        '<%= dir.lib %>/<%= libs.parallel %>',
                        '<%= dir.lib %>/<%= libs.handlebars %>'
                    ]
                }
            },
            config: {
                files: {
                    '<%= dir.build %>/<%= components.config %>.min.js': ['src/<%= components.config %>.build.js']
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

        /**
         * code style
         */
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'specs/**/*.js']
            // options: {
            //     jshintrc: '.jshintrc'
            // }
        },

        jslint: {
            grunt: {
                src: ['Gruntfile.js'],
                directives: {
                    predef: [
                        'module',
                        'require'
                    ]
                }
            },
            test: {
                src: ['specs/**/*.js'],
                directives: {
                    node: true,
                    nomen: true,
                    predef: [
                        'define',
                        'require',
                        'it',
                        'expect',
                        '__dirname',
                        'describe'
                    ]
                }
            },
            sources: {
                src: ['src/**/*.js'],
                directives: {
                    browser: true,
                    devel: true,
                    todo: true,
                    predef: [
                        'define',
                        'require',
                        'module',
                        'JS'
                    ]
                }
            }
        },

        csslint: {
            strict: {
                options: {
                    'import': 2
                },
                src: ['src/css/*.css']
            }
        },

        /**
         * application testing
         */
        jasmine: {

            test: {
                src: '<%= dir.src %>/core/**/*.js',
                options: {
                    specs: '<%= dir.specs %>/**/*.spec.js',
                    helpers: '<%= dir.specs %>/**/*.helper.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        baseUrl: '',
                        requireConfigFile: '<%= dir.specs %>/require.config.js'
                    }
                }
            },

            coverage: {
                src: '<%= jasmine.test.src %>',
                options: {
                    specs: '<%= jasmine.test.options.specs %>',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/json/coverage.json',
                        report: [
                            {type: 'cobertura', options: {dir: 'coverage'}},
                            {type: 'lcov', options: {dir: 'coverage'}},
                            {type: 'text-summary'}
                        ],
                        template: require('grunt-template-jasmine-requirejs'),
                        templateOptions: {
                            baseUrl: '',
                            requireConfigFile: '<%= dir.specs %>/require.config.js'
                        }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower-requirejs');
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
    grunt.loadNpmTasks('grunt-jslint');

    // grunt tasks
    grunt.registerTask('default', ['bower', 'jshint', 'jslint', 'jasmine:test', 'concat', 'uglify']);
    grunt.registerTask('test', ['bower', 'jshint', 'jslint', 'jasmine:coverage']);
    grunt.registerTask('build', ['bower', 'concat', 'uglify']);
    grunt.registerTask('jenkins', ['bower', 'jshint', 'jslint', 'jasmine:coverage', 'concat', 'uglify']);
};