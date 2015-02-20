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
define('tb.component/translator/main', ['component!logger', 'jquery', 'tb.core'], function (Logger, jQuery, Core) {
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
         *
         * @author Mickaël Andrieu <mickael.andrieu@lp-digital.fr>
         */
    var Translator = {
            init: function (config) {
                this.base = config.base;
                this.catalogs = {};
                this.default_locale =  config.locale || 'en_US';
                this.locale = this.default_locale;
                this.loadCatalog();

                Core.Mediator.subscribe('on:renderer:init', function (Renderer) {
                    Renderer.addFilter('trans', jQuery.proxy(this.translate, this));
                }, this);
            },

            getLocale:  function () {
                return this.locale;
            },

            setLocale: function (locale) {
                this.loadCatalog(locale);
                this.locale = locale;
            },

            getDefaultLocale: function () {
                return this.defaut_locale;
            },

            translate: function (key) {
                var translation = key;
                if (this.getCatalog(this.locale)[key] !== undefined) {
                    translation = this.getCatalog(this.locale)[key];
                } else if (this.locale !== this.default_locale && this.getCatalog(this.default_locale)[key] !== undefined) {
                    Logger.notice('The key "' + key + '" has not translation in the selected catalog.');
                    translation = this.getCatalog(this.default_locale)[key];
                } else {
                    Logger.warning('The key "' + key + '" is malformed.');
                }

                return translation;
            },

            getCatalog: function (locale) {
                if (this.catalogs[locale] === undefined) {
                    this.loadCatalog(locale);
                }

                return this.catalogs[locale];
            },

            loadCatalog: function (locale) {
                var self = this;
                jQuery.ajax({
                    'url': self.base + '/' + locale + '/global.json',
                    'data': 'json',
                    'async': false
                })
                    .done(function (response) {
                        self.catalogs[locale] = JSON.parse(response);
                    });
            }
        };

    return Translator;
});
