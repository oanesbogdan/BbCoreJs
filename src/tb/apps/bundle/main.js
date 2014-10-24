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
require.config({
    paths: {
        'bundle.routes': 'src/tb/apps/bundle/routes',
        'bundle.main.controller': 'src/tb/apps/bundle/controllers/main.controller',
        'bundle.repository': 'src/tb/apps/bundle/repository/bundle.repository',

        //Views
        'bundle.view.list': 'src/tb/apps/bundle/views/bundle.view.list',
        'bundle.view.index': 'src/tb/apps/bundle/views/bundle.view.index',

        //Templates
        'bundle/tpl/list': 'src/tb/apps/bundle/templates/list.twig',
        'bundle/tpl/index': 'src/tb/apps/bundle/templates/index.twig'
    }
});

define('app.bundle', ['tb.core'], function (BbCore) {
    'use strict';

    /**
     * bundle application declaration
     */
    BbCore.ApplicationManager.registerApplication('bundle', {
        /**
         * occurs on initialization of bundle application
         */
        onInit: function () {
            console.log('init bundle application');
        },

        /**
         * occurs on start of bundle application
         */
        onStart: function () {
            console.log('start bundle application');
        },

        /**
         * occurs on stop of bundle application
         */
        onStop: function () {
            console.log('stop bundle application');
        },

        /**
         * occurs on error of bundle application
         */
        onError: function () {
            console.log('error in bundle application');
        }
    });

});
