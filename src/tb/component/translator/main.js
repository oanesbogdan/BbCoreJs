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
define('tb.component/translator/main', ['component!logger', 'jquery'], function (Logger, jQuery) {
    'use strict';

        /*
         * BackBee Translator component
         * Allow to set multiples dictionnary files
         *
         * Can be accessed throught templates using global function 'trans'
         * Ex: <h1>{{ trans('hello_world') }}</h1> will return "Hello world"
         *
         * // /i18n/en_US/global.js
         * {
         *      'hello_world' : 'Hello world'
         * }
         */
    var Translator = {
            init: function (config) {
                this.base = config.base;
                this.catalog = {};
                this.config = config;
                this.locale = config.locale;
                this.loadCatalog();
            },

            getLocale:  function () {
                return this.locale;
            },

            setLocale: function (locale) {
                this.loadCatalog();
                this.locale = locale;
            },

            getDefaultLocale: function () {
                return this.config.locale;
            },

            translate: function (key) {
                var translation = key;
                if (this.catalog[key] !== undefined) {
                    translation = this.catalog[key];
                } else if (this.getDefaultCatalog()[key] !== undefined) {
                    Logger.notice('The key "' + key + '" has not translation in the selected catalog.');
                    translation = this.getDefaultCatalog()[key];
                } else {
                    Logger.warning('The key "' + key + '" is malformed.');
                }

                return translation;
            },

            getCatalog: function () {
                return this.catalog;
            },

            getDefaultCatalog: function () {
                this.loadCatalog(this.getDefaultLocale());

                return this.catalog;
            },

            loadCatalog: function (locale) {
                var self = this,
                    myLocale = (locale === undefined) ? self.locale : locale;
                jQuery.ajax({
                    'url': self.base + '/' + myLocale + '/global.json',
                    'data': 'json',
                    'async': false
                })
                    .done(function (response) {
                        self.catalog = JSON.parse(response, true);
                    });
            }
        };

    return Translator;
});
