/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBuilder5.
 *
 * BackBuilder5 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBuilder5 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.
 */
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        license: '/*\n * Copyright (c) 2011-2013 Lp digital system\n *\n * This file is part of BackBuilder5.\n *\n * BackBuilder5 is free software: you can redistribute it and/or modify\n * it under the terms of the GNU General Public License as published by\n * the Free Software Foundation, either version 3 of the License, or\n * (at your option) any later version.\n *\n * BackBuilder5 is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n * GNU General Public License for more details.\n *\n * You should have received a copy of the GNU General Public License\n * along with BackBuilder5. If not, see <http://www.gnu.org/licenses/>.\n */\n',

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
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n<%= license %>'
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
            files: ['Gruntfile.js', 'src/**/*.js', 'specs/**/*.js'],
            options: {
                jshintrc: '.jshintrc',
                predef: ['xdescribe']
            }
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
                        'describe',
                        'xdescribe',
                        'spyOn',
                        'jasmine',
                        'sessionStorage',
                        'window',
                        'before',
                        'beforeEach',
                        'after',
                        'afterEach',
                        'xit'
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
                        'Backbone',
                        'JS',
                        'load' // temp remove it
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
                src: ['<%= dir.src %>/core/**/*.js'],
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