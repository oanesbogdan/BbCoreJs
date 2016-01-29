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

define(
    [
        'Core',
        'content.pluginmanager',
        'text!content/tpl/block_informations',
        'component!translator',
        'Core/Renderer',
        'component!popin',
        'moment',
        'jsclass'
    ],
    function (
        Core,
        PluginManager,
        blockDescriptionTpl,
        Translator,
        Renderer,
        PopinManager,
        moment
    ) {

        'use strict';

        PluginManager.registerPlugin('infos', {

            onInit: function () {
                return;
            },

            /**
             * Edit the content
             */
            showInfos: function () {

                var self = this,
                    currentContent = this.getCurrentContent(),
                    definition = currentContent.definition,
                    block = {
                        category: definition.properties.name,
                        description: definition.properties.description,
                        thumbnail: definition.image,
                        uid : currentContent.uid
                    };

                if (this.informationsPopin === undefined) {
                    this.informationsPopin = PopinManager.createPopIn();

                    this.informationsPopin.setTitle(Translator.translate('block_informations'));
                    this.informationsPopin.setId('bb-block-informations');
                    Core.ApplicationManager.invokeService('content.main.registerPopin', 'blockInformations', this.informationsPopin);
                }

                currentContent.getInfo().done(function (info) {
                    var tpl;

                    block.created = moment.unix(parseInt(info.created, 10)).format('HH:mm DD/MM/YYYY');
                    block.updated = moment.unix(parseInt(info.modified, 10)).format('HH:mm DD/MM/YYYY');
                    block.revision = info.revision;

                    tpl = Renderer.render(blockDescriptionTpl, {'block': block});

                    self.informationsPopin.setContent(tpl, true);
                    self.informationsPopin.display();
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
             * Get actions
             * @returns {Array}
             */
            getActions: function () {
                var self = this;

                return [
                    {
                        name: 'Infos',
                        ico: 'fa fa-info-circle',
                        label: Translator.translate('block_informations'),
                        cmd: self.createCommand(self.showInfos, self),
                        checkContext: function () {
                            return self.canApplyOnContext();
                        }
                    }
                ];
            }
        });
    }
);