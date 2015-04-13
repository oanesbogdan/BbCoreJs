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
require.config({
    baseUrl: 'resources/toolbar/',
    paths: {
        'component': 'src/tb/component/component',

        'Core': 'dist/vendor.min',
        'jquery': 'dist/vendor.min',
        'jqueryui': 'dist/vendor.min',
        'jsclass' : 'dist/vendor.min',
        'underscore': 'dist/vendor.min',
        'nunjucks': 'dist/vendor.min',
        'BackBone': 'dist/vendor.min',
        'text': 'dist/vendor.min',
        'moment': 'dist/vendor.min',
        'URIjs/URI': 'dist/vendor.min',
        'datetimepicker': 'dist/vendor.min',
        'jquery-layout' : 'dist/vendor.min',
        'jqLayout': 'dist/vendor.min',
        'lib.jqtree': 'dist/vendor.min',
        'jssimplepagination': 'dist/vendor.min',
        'bootstrapjs': 'dist/vendor.min',
        'ckeeditor': 'dist/vendor.min',
        'dropzone': 'dist/vendor.min',

        'cryptojs.core': 'dist/vendor.min',
        'cryptojs.md5': 'dist/vendor.min'
    },
    'shim': {
        underscore: {
            exports: '_'
        },
        BackBone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        Core: {
            deps: ['BackBone', 'jquery', 'jsclass', 'underscore', 'nunjucks', 'URIjs/URI']
        },
        bootstrapjs: {
            deps: ['jquery']
        },
        'lib.jqtree': {
            deps: ['jquery']
        },
        'jquery-layout': {
            deps: ['jquery']
        },
        'cryptojs.core': {
            exports: "CryptoJS"
        },
        'cryptojs.md5': {
            deps: ['cryptojs.core'],
            exports: "CryptoJS"
        }
    },
    deps: ['src/tb/init'],
    callback: function (init) {
        'use strict';
        init.listen();
    }
});