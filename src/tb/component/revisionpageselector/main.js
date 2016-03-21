/*
 * Copyright (c) 2011-2013 Lp digital system
 *
 * This file is part of BackBee.
 *
 * BackBuilder5 is free software: you can redistribute it and/or modify
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

require.config({
    paths: {
        'revisionpageselector.templates': 'src/tb/component/revisionpageselector/templates'
    }
});

define(
    'tb.component/revisionpageselector/main',
    [
        'Core',
        'Core/Renderer',
        'content.repository',
        'revision.repository',
        'revisionselector.managers/Draft',
        'revisionselector.managers/Save',
        'component!popin',
        'component!translator',
        'component!notify',
        'text!revisionpageselector.templates/tree.twig',
        'text!revisionpageselector.templates/item.twig',
        'jquery',
        'jsclass'
    ],
    function (Core, Renderer, ContentRepository, RevisionRepository, DraftManager, SaveManager, PopinManager, Translator, Notify, treeTemplate, itemTemplate, jQuery) {

        'use strict';

        var popinConfig = {
                width: 944,
                height: 'auto',
                modal: true
            },

            RevisionPageSelector = new JS.Class({

                revisionSelectorClass: '.bb-revision-page-selector',
                seeDetailsClass: '.bb-revision-see-details',
                revisionListClass: '.bb-revision-list',
                contentRevisionListClass: '.bb-revision-selector',

                /**
                 * Initialize of Revision manage
                 */
                initialize: function (config) {
                    var self = this;

                    this.config = config;

                    this.buildPopin();

                    this.selector = '#' + this.popin.getId() + ' ' + this.revisionSelectorClass;

                    Core.ApplicationManager.invokeService('page.main.getSaveManager').done(function (SaveManager) {
                        self.SaveManager = SaveManager;
                    });
                },

                /**
                 * Bind events
                 */
                bindEvents: function () {
                    var self = this;
                    jQuery(this.seeDetailsClass).on('click', function () {
                        jQuery(self.revisionListClass).toggle();
                    });
                },

                /**
                 * Build the popin
                 */
                buildPopin: function () {
                    var title = (this.config.popinTitle !== undefined) ? this.config.popinTitle : '';

                    this.popin = PopinManager.createPopIn({
                        position: { my: "center top", at: "center top+" + jQuery('#' + Core.get('menu.id')).height()}
                    });
                    this.popin.setTitle(title);
                    this.popin.addOptions(popinConfig);
                },

                getCheckedData: function () {
                    var data = jQuery(this.selector + ' input[data-savable="true"]:checked'),
                        result = [];

                    data.each(function () {
                        result.push(jQuery(this).data('key'));
                    });

                    return result;
                },

                /**
                 * Check if there are content drafts
                 * If yes save them and then save page modifications
                 *
                 * @param {Boolean} hasDrafts
                 * @returns {undefined}
                 */
                checkAndSaveDrafts: function (hasDrafts) {
                    var self = this;

                    this.popin.mask();

                    if (hasDrafts === true) {

                        Core.ApplicationManager.invokeService('content.main.save').done(function (promise) {
                            promise.done(function () {
                                RevisionRepository.save(SaveManager.save('#' + self.popin.getId() + ' ' + this.contentRevisionListClass), 'commit').done(function () {
                                    Notify.success(Translator.translate('contents_validated'));
                                    self.save();
                                });
                            });
                        });
                    } else {
                        self.save();
                    }
                },

                /**
                 * Apply the save to the callback
                 */
                save: function () {
                    if (this.config.hasOwnProperty('onSave')) {
                        this.config.onSave(this.getCheckedData(), this.popin);
                    }
                },

                renderItems: function (items) {
                    var key,
                        template = '';

                    if (items !== undefined) {

                        for (key in items) {
                            if (items.hasOwnProperty(key)) {
                                template = template + Renderer.render(itemTemplate, {'item': items[key]});
                            }
                        }
                    }

                    return template;
                },

                /**
                 * Show popin with revisions
                 */
                show: function () {
                    this.popin.display();
                    var self = this,
                        items = this.SaveManager.validateData(self.config.currentPage),
                        config = {
                            items: self.renderItems(items),
                            title: self.config.title,
                            noContentMsg: self.config.noContentMsg,
                            questionMsg: self.config.questionMsg
                        };

                    if (items.hasOwnProperty('state') && parseInt(items.state.value, 10) === 1) {
                        this.popin.mask();
                        ContentRepository.getDrafts().done(function (drafts) {
                            if (Object.keys(drafts).length > 0) {
                                config.questionMsg = Translator.translate('confirm_save_online_changes_made_to_page');
                                config.drafts = DraftManager.computeDraft(drafts);
                                self.setPopInContent(config, true);
                            } else {
                                self.setPopInContent(config, false);
                            }

                            self.popin.unmask();
                        });
                    } else {
                        this.setPopInContent(config, false);
                    }
                },

                /**
                 * Set the corresponding content and buttons for popin
                 *
                 * @param {Object} config
                 * @param {Boolean} hasDrafts
                 * @returns {undefined}
                 */
                setPopInContent: function (config, hasDrafts) {
                    var self = this,
                        buttonName = 'Ok';

                    if (config.items.length > 0) {
                        buttonName = Translator.translate('yes');
                    }
                    this.popin.addButton(buttonName, function () {
                        self.checkAndSaveDrafts(hasDrafts);
                    });
                    if (config.items.length > 0) {
                        this.popin.addButton(Translator.translate('no'), function () {
                            this.popin.hide();
                        });
                    }
                    this.popin.setContent(Renderer.render(treeTemplate, config));
                    this.bindEvents();
                }
            });

        return {
            create: function (config) {
                return new RevisionPageSelector(config);
            }
        };
    }
);
