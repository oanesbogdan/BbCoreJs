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
 * Page tree object
 *
 * @category    NightWatch
 * @subcategory PageObjects
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

var commands = {
    checkNewCreatedPage: function () {
        'use strict';

        var self = this;

        this.getText('@firstChildNodeFirstSubpage', function (result) {
            self.assert.ok(result.value === self.api.globals.pageTree.createNewPage, 'Check if the new created page is the first subpage');
        });

        return this;
    },
    contextMenuAction: function (button, elementSelector) {
        'use strict';

        var self = this,
            contextMenuSection = this.section.contextMenu;

        this
            // make sure to have context menu closed by clicking somewhere else
            .click('@navBarBrand')
            // click copy from the context menu on the first page under home
            .api.element('css selector', elementSelector, function (result) {
                self.api.moveTo(result.value.ELEMENT, 0, 0, function () {
                    self.api.mouseButtonClick('right');
                    contextMenuSection.click('@' + button);
                });
            });

        return this;
    }
};

var searchCommands = {
    search: function () {
        'use strict';

        var loadTime = this.api.globals.loadTime.pageTree;

        this
            .waitForElementVisible('@searchInput', loadTime.searchInput)
            .setValue('@searchInput', this.api.globals.pageTree.searchForPage)
            .waitForElementVisible('@submitButton', loadTime.searchSubmitButton)
            .click('@submitButton');

        this.api.pause(loadTime.waitForSearchResults);

        return this;
    },
    checkSearchResults: function () {
        'use strict';

        var self = this,
            iterator = 1;

        this.api
            .elements('css selector', this.elements.resultItem.selector, function (result) {
                result.value.forEach(function (element) {
                    self.api.elementIdText(element.ELEMENT, function () {
                        self.api.assert.containsText(
                            self.elements.resultItem.selector + ':nth-child(' + iterator + ')',
                            self.api.globals.pageTree.searchForPage,
                            'Check if results contain the searched text'
                        );
                    });
                    if (iterator < result.value.length) {
                        iterator += 1;
                    }
                });
            })
            .pause(this.api.globals.loadTime.pageTree.waitForSearchResults);

        return this;
    },
    // click on the show folder checkbox
    clickShowFolderCheckbox: function () {
        'use strict';

        this
            .waitForElementVisible('@showFoldersCheckbox', this.api.globals.loadTime.defaultWait)
            .click('@showFoldersCheckbox');

        return this;
    },

    // check the results for show folder checkbox when it's checked
    checkShowFolderCheckboxCheckedResults: function () {
        'use strict';

        var self = this;

        this.api.elements('css selector', this.elements.resultItemFolder.selector, function (result) {
            result.value.map(function (value) {
                self.api.elementIdDisplayed(value.ELEMENT, function (displayed) {
                    self.assert.ok(displayed.value === true, 'Check if folder is displayed');
                });
            });
        });
        this.api.elements('css selector', this.elements.resultItemNonFolder.selector, function (result) {
            result.value.map(function (value) {
                self.api.elementIdDisplayed(value.ELEMENT, function (displayed) {
                    self.assert.ok(displayed.value === false, 'Check non folders to be hidden');
                });
            });
        });

        return this;
    },
    // check that all pages are displayed after unchecking the show folder checkbox
    checkShowFolderCheckboxNotCheckedResults: function () {
        'use strict';

        var self = this;

        this.api.elements('css selector', this.elements.resultItem.selector, function (result) {
            result.value.forEach(function (element) {
                self.api.elementIdDisplayed(element.ELEMENT, function (displayed) {
                    self.assert.ok(displayed.value === true, 'Check page to be displayed');
                });
            });
        });

        return this;
    }
};

var homePageContextMenuButtons = ['addButton', 'editButton', 'browseToButton'];

var contextMenuCommands = {
    // check if the add, edit and browse to buttons are displayed in homepage context menu and the rest to be hidden
    checkHomeDisplayedButtons: function () {
        'use strict';

        var element;

        for (element in this.elements) {
            if (this.elements.hasOwnProperty(element) && element !== 'listItem') {
                if (homePageContextMenuButtons.indexOf(element) !== -1) {
                    this.expect.element(this.elements[element].selector).to.be.visible.after(this.api.globals.loadTime.defaultWait);
                } else {
                    this.expect.element(this.elements[element].selector).to.not.be.visible.after(this.api.globals.loadTime.defaultWait);
                }
            }
        }
    },
    // check if the paste, paste before, paste after buttons are displayed
    checkCopyDisplayedButtons: function () {
        'use strict';

        // check paste button to be visible
        this.assert.visible('@pasteButton');
        // check paste before button to be visible
        this.assert.visible('@pasteBeforeButton');
        // check paste after button to be visible
        this.assert.visible('@pasteAfterButton');

        return this;
    }
};

var actionsMenuCommands = {
    checkActionsAgainstContextMenu: function () {
        'use strict';

        var self = this,
            contextMenuSection = this.parent.section.contextMenu;

        // open the context menu
        this.api.element('css selector', this.parent.elements.firstChildNode.selector, function (result) {
            self.api.moveTo(result.value.ELEMENT, 0, 0, function () {
                self.api.mouseButtonClick('right');
            });
        });

        // loop through all options from actions menu
        this.api.elements('css selector', this.elements.listItem.selector, function (result) {
            result.value.forEach(function (element) {
                // get the data attribte and check that in context menu this is visible
                self.api.elementIdAttribute(element.ELEMENT, 'data-button-key', function (attributeResult) {
                    contextMenuSection.assert.visible('.' + attributeResult.value);
                });
            });
        });

        return this;
    }
};

module.exports = {
    commands: [commands],
    elements: {
        navBarBrand: {
            selector: 'span.navbar-brand img'
        },
        openPageTreeButton: {
            selector: 'button#bundle-toolbar-tree'
        },
        pageTreeDialog: {
            selector: '[aria-describedby="bb-page-tree"] > div.ui-draggable-handle:nth-child(1)'
        },
        pageTree: {
            selector: 'div#bb-page-tree'
        },
        actionButton: {
            selector: 'div#bb-page-tree .contents-action button:nth-child(1)'
        },
        actionButtonDropdown: {
            selector: 'div#bb-page-tree .contents-action button.dropdown-toggle'
        },
        rootNode: {
            selector: 'div.bb5-treeview ul li:nth-child(1) div'
        },
        firstChildNode: {
            selector: 'div.bb5-treeview ul li ul li:nth-child(1) div'
        },
        firstChildNodeFirstSubpage: {
            selector: 'div.bb5-treeview ul li ul li:nth-child(1) ul.jqtree_common li:nth-child(1) span'
        },
        firstChildNodeSubpages: {
            selector: 'div.bb5-treeview ul li ul li:nth-child(1) ul.jqtree_common li'
        },
        firstChildNodeOpenSubpages: {
            selector: 'div.bb5-treeview ul li ul li div a.jqtree-toggler:nth-child(1)'
        },
        firstChildNodeSpan: {
            selector: 'div.bb5-treeview ul li ul li:nth-child(1) .jqtree-title'
        },
        secondChildNode: {
            selector: 'div.bb5-treeview ul li ul li:nth-child(2) div'
        },
        secondChildNodeBorderSpan: {
            selector: 'div.bb5-treeview ul li ul li:nth-child(2) span.jqtree-border'
        },
        secondChildNodeSpan: {
            selector: 'div.bb5-treeview ul li ul li:nth-child(2) .jqtree-title'
        },
        ghostChildNode: {
            selector: 'div.bb5-treeview ul li ul li.jqtree-ghost'
        },
        ghostChildNodeSpan: {
            selector: 'div.bb5-treeview ul li ul li.jqtree-ghost span.jqtree-line'
        },
        closePopinButton: {
            selector: '[aria-describedby="bb-page-tree"] > div.ui-draggable-handle:nth-child(1) button.ui-dialog-titlebar-close'
        }
    },
    sections: {
        search: {
            selector: 'div#bb-page-tree',
            commands: [searchCommands],
            elements: {
                searchInput: {
                    selector: 'div.search-bar input[type=text]'
                },
                showFoldersCheckbox: {
                    selector: 'div.action-ctn.folder-filter input[type=checkbox]'
                },
                submitButton: {
                    selector: '.search-bar button.searchButton'
                },
                resultItemFolder: {
                    selector: 'div.bb5-treeview ul li.jqtree_common.jqtree-folder'
                },
                resultItemNonFolder: {
                    selector: 'div.bb5-treeview ul li.jqtree_common:not(.jqtree-folder)'
                },
                resultItem: {
                    selector: 'div.bb5-treeview ul li.jqtree_common'
                }
            }
        },
        contextMenu: {
            selector: 'div.bb5-context-menu',
            commands: [contextMenuCommands],
            elements: {
                listItem: {
                    selector: 'ul li'
                },
                addButton: {
                    selector: 'button.bb5-context-menu-add'
                },
                editButton: {
                    selector: 'button.bb5-context-menu-edit'
                },
                removeButton: {
                    selector: 'button.bb5-context-menu-remove'
                },
                copyButton: {
                    selector: 'button.bb5-context-menu-copy'
                },
                pasteButton: {
                    selector: 'button.bb5-context-menu-paste'
                },
                pasteBeforeButton: {
                    selector: 'button.bb5-context-menu-paste-before'
                },
                pasteAfterButton: {
                    selector: 'button.bb5-context-menu-paste-after'
                },
                cutButton: {
                    selector: 'button.bb5-context-menu-cut'
                },
                browseToButton: {
                    selector: 'button.bb5-context-menu-flyto'
                }
            }
        },
        actionsMenu: {
            selector: 'div#bb-page-tree div.contents-action ul.dropdown-menu',
            commands: [actionsMenuCommands],
            elements: {
                listItem: {
                    selector: 'li.menu-item'
                },
                addButton: {
                    selector: '[data-button-key="bb5-context-menu-add"]'
                },
                editButton: {
                    selector: '[data-button-key=bb5-context-menu-edit]'
                },
                removeButton: {
                    selector: '[data-button-key=bb5-context-menu-remove]'
                },
                copyButton: {
                    selector: '[data-button-key=bb5-context-menu-copy]'
                },
                pasteButton: {
                    selector: '[data-button-key=bb5-context-menu-paste]'
                },
                pasteBeforeButton: {
                    selector: '[data-button-key=bb5-context-menu-paste-before]'
                },
                pasteAfterButton: {
                    selector: '[data-button-key=bb5-context-menu-paste-after]'
                },
                cutButton: {
                    selector: '[data-button-key=bb5-context-menu-cut]'
                },
                browseToButton: {
                    selector: '[data-button-key=bb5-context-menu-flyto]'
                }
            }
        }
    }
};