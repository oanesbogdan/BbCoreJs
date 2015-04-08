/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBee is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * BackBee is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with BackBee. If not, see <http://www.gnu.org/licenses/>.
 */
module.exports = function (grunt) {
    'use strict';

    var path = (grunt.option('path') !== undefined) ? grunt.option('path') : undefined;
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        license: '/*\n * Copyright (c) 2011-2013 Lp digital system\n *\n * This file is part of BackBee.\n *\n * BackBee is free software: you can redistribute it and/or modify\n * it under the terms of the GNU General Public License as published by\n * the Free Software Foundation, either version 3 of the License, or\n * (at your option) any later version.\n *\n * BackBee is distributed in the hope that it will be useful,\n * but WITHOUT ANY WARRANTY; without even the implied warranty of\n * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n * GNU General Public License for more details.\n *\n * You should have received a copy of the GNU General Public License\n * along with BackBee. If not, see <http://www.gnu.org/licenses/>.\n */\n',

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

        /**
         * application building
         */
        less: {
            css: {
                cleancss: true,
                files: {
                    'dist/css/bb-ui.css': 'less/bb-ui.less',
                    'dist/css/bb-ui-login.css': 'less/bb-ui-login.less'
                }
            }
        },
        cssmin: {
            compress: {
                files: {
                    'dist/css/bb-ui.min.css': ['dist/css/bb-ui.css'],
                    'dist/css/bb-ui-login.min.css': ['dist/css/bb-ui-login.css'],
                    'dist/css/vendor.min.css': ['dist/css/vendor.css']
                }
            }
        },

        copy: {
            font: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/components-font-awesome/',
                        src: 'fonts/*',
                        dest: 'dist/',
                        filter: 'isFile'
                    }
                ]
            },
            core: {
                files: [
                    {
                        expand: true,
                        cwd: 'bower_components/backbee-core-js/dist/',
                        src: '*.js',
                        dest: 'dist/',
                        filter: 'isFile'
                    }
                ]
            }
        },

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
            },
            vendorcss: {
                src: [
                    'bower_components/components-font-awesome/css/font-awesome.css',
                    'bower_components/datetimepicker/jquery.datetimepicker.css',
                    'bower_components/dropzone/dist/dropzone.css'
                ],
                dest: 'dist/css/vendor.css'
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
                        'xit',
                        'xdescribe'
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
        lesslint: {
            src: ['less/*.less']
        },

        /**
         * application testing
         */
        jasmine: {

            test: {
                src: ['<%= dir.src %>/component/**/*.js'],
                options: {
                    specs: path || '<%= dir.specs %>/**/*.spec.js',
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
                    specs: path || '<%= dir.specs %>/**/*.spec.js',
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
        },
        requirejs: {
            vendor: {
                options: {
                    baseUrl: './',
                    mainConfigFile: 'src/require.config.build.js',
                    name: 'src/vendor.js',
                    out: 'dist/vendor.js',
                    generateSourceMaps: false,
                    preserveLicenseComments: false,
                    paths: {
                        'component': 'src/tb/component/component',
                        'Core': 'bower_components/backbee-core-js/dist/Core',

                        'jquery': 'bower_components/jquery/dist/jquery',
                        'jqueryui': 'bower_components/jquery-ui/jquery-ui',
                        'jsclass' : 'node_modules/jsclass/min/core',
                        'underscore': 'bower_components/underscore/underscore',
                        'nunjucks': 'bower_components/nunjucks/browser/nunjucks',
                        'BackBone': 'bower_components/backbone/backbone',
                        'text': 'bower_components/requirejs-text/text',
                        'moment': 'bower_components/moment/moment',
                        'URIjs/URI': 'bower_components/uri.js/src/URI',
                        'datetimepicker': 'bower_components/datetimepicker/jquery.datetimepicker',
                        'jquery-layout' : 'bower_components/jquery.layout/dist/jquery.layout-latest',
                        'jqLayout': 'bower_components/jquery.layout/dist/jquery.layout-latest',
                        'lib.jqtree': 'bower_components/jqtree/tree.jquery',
                        'jssimplepagination': 'bower_components/jssimplepagination/jquery.simplePagination',
                        'bootstrapjs': 'bower_components/bootstrap/dist/js/bootstrap',
                        'ckeeditor': 'bower_components/ckeeditor/ckeditor',
                        'dropzone': 'bower_components/dropzone/dist/dropzone',

                        'cryptojs.core': 'bower_components/cryptojslib/components/core',
                        'cryptojs.md5': 'bower_components/cryptojslib/components/md5'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-lesslint');

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-istanbul-coverage');

    // grunt tasks
    grunt.registerTask('default', ['less:css', 'jshint', 'jslint', 'jasmine:coverage', 'concat', 'uglify']);
    grunt.registerTask('test', ['less:css', 'jshint', 'jslint', 'jasmine:coverage']);
    grunt.registerTask('build', ['less:css', 'requirejs', 'cssmin', 'copy']);
};
