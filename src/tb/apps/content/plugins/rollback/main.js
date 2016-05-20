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
        'text!content/tpl/rollback_items',
        'content.pluginmanager',
        'component!translator',
        'component!popin',
        'revision.repository',
        'Core/Renderer',
        'moment',
        'jquery',
        'jsclass'
    ],
    function (Core, itemsTemplate, PluginManager, Translator, PopinManager, RevisionRepository, Renderer, moment, jQuery) {

        'use strict';

        PluginManager.registerPlugin('rollback', {

            /**
             * Initialization of plugin
             */
            onInit: function () {

                var self = this;

                this.popin = PopinManager.createPopIn({
                    modal: true,
                    position: { my: "center top", at: "center top+" + jQuery('#' + Core.get('menu.id')).height()}
                });

                this.popin.setTitle(Translator.translate('rollback_content_title'));
                this.popin.addButton('Ok', function () {
                    var $dialog = jQuery('#' + self.popin.getId()),
                        $current = $dialog.find('.item[data-current="true"]'),
                        type = $current.data('type').replace('\\', '/'),
                        uid = $current.data('uid'),
                        revision = $current.data('revision');

                    if (type && uid) {
                        self.popin.mask();
                        RevisionRepository.revert(uid, type, revision).done(function () {
                            self.popin.hide();
                            self.popin.unmask();
                            self.getCurrentContent().refresh();
                        });
                    }
                });
            },

            rollback: function () {
                var content = this.getCurrentContent(),
                    self = this;

                this.popin.display();
                this.popin.mask();
                RevisionRepository.findAllByUidAndType(content.uid, content.type).done(function (revisions) {
                    var key,
                        revision,
                        html;

                    for (key in revisions) {
                        if (revisions.hasOwnProperty(key)) {
                            revision = revisions[key];

                            revision.created = moment.unix(parseInt(revision.created, 10)).format('DD/MM/YYYY HH:mm');
                            revision.modified = moment.unix(parseInt(revision.modified, 10)).format('DD/MM/YYYY HH:mm');
                            revision.hasPrev = revisions[parseInt(key, 10) - 1] !== undefined;
                            revision.hasNext = revisions[parseInt(key, 10) + 1] !== undefined;
                        }
                    }

                    html = jQuery(Renderer.render(itemsTemplate, {'revisions': revisions}));

                    html.on('click', '.btn-revision', self.onBtnRevisionClick.bind(self));

                    self.popin.setContent(html);

                    self.popin.unmask();
                });
            },

            onBtnRevisionClick: function (event) {
                var $currentTarget = jQuery(event.currentTarget),
                    $parent = $currentTarget.parents('.item:first'),
                    $next,
                    $prev;

                $parent.addClass('hidden');
                $parent.attr('data-current', 'false');

                if ($currentTarget.hasClass('next')) {
                    $next = $parent.next();
                    $next.removeClass('hidden');
                    $next.attr('data-current', 'true');
                } else {
                    $prev = $parent.prev();
                    $prev.removeClass('hidden');
                    $prev.attr('data-current', 'true');
                }
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
                        name: 'rollback',
                        ico: 'fa fa-undo',
                        label: Translator.translate('rollback_content_title'),
                        cmd: self.createCommand(self.rollback, self),
                        checkContext: function () {
                            return true;
                        }
                    }
                ];
            }
        });
    }
);