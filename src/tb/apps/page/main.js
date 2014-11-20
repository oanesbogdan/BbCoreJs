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
        'page.routes': 'src/tb/apps/page/routes',
        'page.repository': 'src/tb/apps/page/repository/page.repository',

        //Controllers
        'page.main.controller': 'src/tb/apps/page/controllers/main.controller',

        //Forms
        'page.abstract.form': 'src/tb/apps/page/forms/AbstractPage.form',
        'page.form': 'src/tb/apps/page/forms/Page.form',

        //Views
        'page.view.contribution.index': 'src/tb/apps/page/views/page.view.contribution.index',
        'page.view.delete': 'src/tb/apps/page/views/page.view.delete',
        'page.view.create': 'src/tb/apps/page/views/page.view.create',
        'page.view.edit': 'src/tb/apps/page/views/page.view.edit',
        'page.view.new': 'src/tb/apps/page/views/page.view.new',
        'page.view.clone': 'src/tb/apps/page/views/page.view.clone',

        //Templates
        'page/tpl/contribution/index': 'src/tb/apps/page/templates/contribution.index.twig',
        'page/tpl/contribution/scheduling_publication': 'src/tb/apps/page/templates/contribution-scheduling.dialog.twig'
    }
});

define('app.page', ['tb.core'], function (BbCore) {
    'use strict';

    /**
     * page application declaration
     */
    BbCore.ApplicationManager.registerApplication('page', {
        /**
         * occurs on initialization of page application
         */
        onInit: function () {
            console.log('init page application');
        },

        /**
         * occurs on start of page application
         */
        onStart: function () {
            console.log('start page application');
        },

        /**
         * occurs on stop of page application
         */
        onStop: function () {
            console.log('stop page application');
        },

        /**
         * occurs on error of page application
         */
        onError: function () {
            console.log('error in page application');
        }
    });

});
