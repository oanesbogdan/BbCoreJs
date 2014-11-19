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
define(['tb.core', 'bundle.view.list', 'bundle.view.index'], function (Core, ListView, IndexView) {
    'use strict';

    Core.ControllerManager.registerController('MainController', {

        appName: 'bundle',

        config: {
            imports: ['bundle.repository']
        },

        /**
         * Initialize of Bundle Controller
         */
        onInit: function () {
            this.bundles = null;
            this.repository = require('bundle.repository');
            this.mainApp =  Core.get('application.main');
        },

        /**
         * Index action
         * Show the first bundle in toolbar
         */
        indexAction: function () {
            this.listAndRender(IndexView);
        },

        /**
         * List action
         * Show all bundle in toolbar
         */
        listAction: function () {

            if (null === this.bundles) {
                this.listAndRender(ListView);
            } else {
                this.renderView(ListView, this.bundles);
            }
        },

        /**
         * Call the driver handler for return the list and
         * use the view for render the html
         *
         * @param {Object} ConstructorView
         * @returns {bundle.controller_L1.bundle.controllerAnonym$1}
         */
        listAndRender: function (ConstructorView) {
            var self = this;

            this.repository.list().done(function (datas) {
                self.bundles = {bundles: datas};
                self.renderView(ConstructorView, self.bundles);
            });
        },

        /**
         * Call the view for render data in the DOM
         * @param {Object} ConstructorView
         * @param {Object} datas
         */
        renderView: function (ConstructorView, datas) {
            var view = new ConstructorView({datas: datas});
            view.render();
        }
    });
});
