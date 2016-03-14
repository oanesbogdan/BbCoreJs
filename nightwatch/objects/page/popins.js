/*
 * Copyright (c) 2011-2016 Lp digital system
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

/**
 * Page popins object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

var createCommands = {
    // create a new page
    createNewPage: function () {
        'use strict';

        this
            .assert.elementPresent('@title')
            .assert.elementPresent('@alttitle')
            .assert.elementPresent('@layout')
            .assert.elementPresent('@submit')
            .setValue('@title', this.api.globals.pageTree.createNewPage)
            .click('@layoutFirstNonEmptyOption')
            .click('@submit');

        return this;
    }
};

var deleteCommands = {
    // assert that all elements from delete popin are present
    assertElementsPresent: function () {
        'use strict';

        this
            .assert.elementPresent('@warningTitle')
            .assert.elementPresent('@warningText')
            .assert.elementPresent('@cancelButton')
            .assert.elementPresent('@validateButton');

        return this;
    }
};

module.exports = {
    sections: {
        createPopin: {
            selector: '.create-new-page-popin',
            commands: [createCommands],
            elements: {
                title: {
                    selector: 'div.element_title input[type=text]'
                },
                alttitle: {
                    selector: 'div.element_alttitle input[type=text]'
                },
                layout: {
                    selector: 'div.element_layout_uid select'
                },
                layoutFirstNonEmptyOption: {
                    selector: 'div.element_layout_uid select option:nth-child(2)'
                },
                submit: {
                    selector: 'button.bb-submit-form'
                }
            }
        },
        editPopin: {
            selector: '.edit-page-popin',
            elements: {
                closeButton: {
                    selector: 'div.ui-dialog-titlebar button.ui-dialog-titlebar-close'
                }
            }
        },
        deletePopin: {
            selector: '.delete-page-popin',
            commands: [deleteCommands],
            elements: {
                warningTitle: {
                    selector: 'h3.text-danger'
                },
                warningText: {
                    selector: 'p.text-danger'
                },
                cancelButton: {
                    selector: 'button.bb-delete-page-cancel'
                },
                validateButton: {
                    selector: 'button.bb-delete-page-validate'
                },
                closeButton: {
                    selector: 'div.ui-dialog-titlebar button.ui-dialog-titlebar-close'
                }
            }
        }
    }
};