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
define('tb.core.Config', ['require', 'tb.core.Api'], function (require) {
    'use strict';

    var Core = require('tb.core.Api'),

        container = {},

        injectCoreConfig = function (config) {
            var key;
            for (key in config) {
                if (config.hasOwnProperty(key) && Core.hasOwnProperty(key)) {
                    try {
                        Core[key].init(config[key]);
                    } catch (e) {
                        Core.exception.silent('CoreConfigurationException', 12300, 'Config injection fail for ' + key + ' core object with message : ' + e);
                    }
                }
            }
        },

        initConfig = function (config) {
            if (config.hasOwnProperty('core')) {
                injectCoreConfig(config.core);
                delete config.core;
            }
            container = Object.freeze(config);
        },

        find = function (sections, config) {
            var section = sections.pop();

            if (config.hasOwnProperty(section)) {

                if (sections.length === 1) {
                    return find(sections, config[section]);
                }
                return config[section];
            }
            return;
        },

        getConfig = function (namespace) {
            var sections = namespace.split(':');

            return find(sections.reverse(), container);
        };


    Core.register('initConfig', initConfig);
    Core.register('Config', getConfig);
});
