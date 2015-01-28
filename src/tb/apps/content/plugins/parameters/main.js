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

define(
    [
        'content.pluginmanager',
        'component!popin',
        'component!formbuilder',
        'jsclass'
    ],
    function (PluginManager, Popin, FormBuilder) {

        'use strict';

        PluginManager.registerPlugin('parameters', {

            /**
             * Initialization of plugin
             */
            onInit: function () {
                this.createPopin();
                this.content = this.getCurrentContent();
            },

            /**
             * Create popin for parameters form
             */
            createPopin: function () {
                this.popin = Popin.createPopIn();
                this.popin.setTitle('Parameters');
            },

            /**
             * Build form from parameters and show popin
             */
            showParameters: function () {
                var self = this;

                this.content.getData().done(function () {
                    var parameters = self.content.getParameters(),
                        config = {
                            elements: parameters,
                            onSubmit: function (data) {
                                if (Object.keys(data).length > 0) {
                                    self.content.setParameters(data);
                                }
                                self.popin.hide();
                            }
                        };

                    FormBuilder.renderForm(config).done(function (html) {
                        self.popin.setContent(html);
                        self.popin.display();
                    });
                });
            },

            /**
             * Verify if the plugin can be apply on the context
             * @returns {Boolean}
             */
            canApplyOnContext: function () {
                return true;
            },

            /**
             * 
             * @returns {Array}
             */
            getActions: function () {
                var self = this;

                return [
                    {
                        name: 'parameters',
                        ico: 'fa fa-circle-o',
                        label: 'Parameters',
                        cmd: self.createCommand(self.showParameters, self),
                        checkContext: function () {
                            return true;
                        }
                    }
                ];
            }
        });
    }
);