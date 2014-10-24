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
define(['tb.core', 'jquery', 'content.test.manager'], function (bbCore, jQuery) {
    'use strict';
    bbCore.ControllerManager.registerController('MainController', {
        appName: 'content',
        config: {
            imports: ['content.test.manager']
        },
        /**
         * occurs on init of content home controller
         */
        onInit: function () {
            console.log('content onInit');
        },
        /**
         * Returns home route result
         */
        homeAction: function () {
            console.log('contentApp homeAction');
        },
        /**
         * Returns list route result
         */
        listAction: function () {
            return;
        },
        /**
         * Returns params route result
         */
        paramsAction: function () {
            jQuery('.jumbotron').html(jQuery('<p>app: content<br>controller:MainController<br>action: paramAction</p>'));
        }
    });
});