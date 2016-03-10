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
 * Tests for page tree popin in BackBee
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      Marian Hodis <marian.hodis@lp-digital.fr>
 */

var disabledClass = 'disabled',
    toggleClosedClass = 'jqtree-closed';

module.exports = {
    /**
     * Login in BackBee and set some usefull global variables
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    before : function (client) {
        'use strict';

        // login in BackBee
        client.login();

        // instantiate the necessary page objects
        this.pageTreeObject = client.page.tree();
        this.contextMenuSection = this.pageTreeObject.section.contextMenu;
        this.pagePopinsObject = client.page.popins();
    },

    /**
     * Wait before each test
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    beforeEach : function (client) {
        'use strict';

        client.pause(client.globals.loadTime.defaultWait);
    },

    /**
     * Test the opening and the position of the page tree popin
     * The position is based on x and y offsets
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test open and position of page tree popin' : function (client) {
        'use strict';

        // click the tree button and assert the visibility of the page tree popin
        this.pageTreeObject
            .waitForElementVisible('@openPageTreeButton', client.globals.loadTime.toolbar)
            .click('@openPageTreeButton')
            .waitForElementVisible('@pageTree', client.globals.loadTime.pageTree.loadPopin)
            // get the page tree popin position and compare the offsets
            .getLocation(this.pageTreeObject.elements.pageTree.selector, function (location) {
                this.assert.ok(
                    location.value.x < client.globals.pageTree.position.x && location.value.y < client.globals.pageTree.position.y,
                    'Check page tree popin position to be top left'
                );
            });
    },

    /**
     * Click on another area when the popin is open and test that this doesn't close the popin
     * 
     * @returns {undefined}
     */
    'Test if clicking on another area doens\'t close the popin' : function () {
        'use strict';

        // page tree popin is opened from previous test, click on BackBee image and test if page tree is still opened
        this.pageTreeObject
            .click('@navBarBrand')
            .assert.visible('@pageTree');
    },

    /**
     * Move, close then reopen page tree popin and check that position of popin is the same
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Move, close and reopen page tree popin and check that position of popin is the same' : function (client) {
        'use strict';

        var self = this;

        // test if the page tree dialog and the close button are visible
        this.pageTreeObject
            .assert.visible('@pageTreeDialog')
            .assert.visible('@closePopinButton')
            .api.pause(client.globals.loadTime.defaultWait)
            // move the popin to a new position
            .moveToElement(this.pageTreeObject.elements.pageTreeDialog.selector, 5, 5)
            .mouseButtonDown('left')
            .moveToElement('body', 150, 150)
            .mouseButtonUp('left')
            // get the location of the popin before closing
            .getLocation('css selector', this.pageTreeObject.elements.pageTreeDialog.selector, function (locationBeforeClosing) {
                self.pageTreeObject
                    //  close popin and reopen popin
                    .click('@closePopinButton')
                    .click('@openPageTreeButton')
                    // get the location of the popin after reopening
                    .getLocation('css selector', self.pageTreeObject.elements.pageTreeDialog.selector, function (locationAfterReopening) {
                        // test x and y offsets of the two locations to be equal
                        this.assert.ok(
                            locationBeforeClosing.value.x === locationAfterReopening.value.x && locationBeforeClosing.value.y === locationAfterReopening.value.y,
                            'Check page tree popin keeps location after the move and closure'
                        );
                    });
            });
    },

    /**
     * Test the folder only checkbox
     * 
     * @returns {undefined}
     */
    'Test the folder only checkbox' : function () {
        'use strict';

        this.pageTreeObject.section.search
            .clickShowFolderCheckbox()
            .checkShowFolderCheckboxCheckedResults()
            .clickShowFolderCheckbox()
            .checkShowFolderCheckboxNotCheckedResults();
    },

    /**
     * Test drag and drop page at same level shows position
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test drag and drop page at same level shows position' : function (client) {
        'use strict';

        var self = this;

        // drag first page beneath the second page without dropping
        client
            .moveToElement(this.pageTreeObject.elements.firstChildNode.selector, 0, 0)
            .mouseButtonDown('left')
            .pause(client.globals.loadTime.defaultWait)
            .element('css selector', this.pageTreeObject.elements.secondChildNode.selector, function (result) {
                client.elementIdSize(result.value.ELEMENT, function (size) {
                    client.moveToElement(self.pageTreeObject.elements.secondChildNode.selector, 0, size.value.height);
                });
            });
        // test if the ghost element is present and has background-color
        this.pageTreeObject
            .assert.elementPresent('@ghostChildNode')
            .expect.element('@ghostChildNodeSpan').to.have.css('background-color', 'Check if drag page at same level shows position');
        // don't actually move the page
        client
            .moveToElement(this.pageTreeObject.elements.firstChildNode.selector, 0, 0)
            .mouseButtonUp('left');
    },

    /**
     * Test drag and drop page at another level shows position
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test drag and drop page at another level shows position' : function (client) {
        'use strict';

        var self = this;

        // drag first page over the second page without dropping
        client
            .moveToElement(this.pageTreeObject.elements.firstChildNode.selector, 0, 0)
            .mouseButtonDown('left')
            .pause(client.globals.loadTime.defaultWait)
            .moveToElement(self.pageTreeObject.elements.secondChildNode.selector, 0, 5);
        // test if the hover element is visible
        this.pageTreeObject.assert.visible('@secondChildNodeBorderSpan', 'Check if drag page at another level shows position');
        // don't actually move the page
        client
            .moveToElement(this.pageTreeObject.elements.firstChildNode.selector, 0, 0)
            .mouseButtonUp('left');
    },

    /**
     * Test selected state of a page when clicked
     * 
     * @returns {undefined}
     */
    'Test selected state of a page when clicked' : function () {
        'use strict';

        this.pageTreeObject
            .click('@firstChildNode')
            .expect.element('@firstChildNode').to.have.css('background-image', 'Check if the clicked page has a selected state');
    },

    /**
     * Test double click on a page
     * Loading of the page that was double-clicked, the interface is on the "Edit" section and popin tree reappears in the same configuration
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test double click on a page does the redirect and the popin is open' : function (client) {
        'use strict';

        var self = this;

        // get the old url
        client.url(function (oldUrl) {
            // go to first page and double click it
            client
                .element('css selector', self.pageTreeObject.elements.firstChildNode.selector, function (result) {
                    client.moveTo(result.value.ELEMENT, 0, 0, function () {
                        client.doubleClick();
                    });
                })
                // wait for the refresh to be done
                .pause(client.globals.loadTime.toolbar)
                .url(function (currentUrl) {
                    // get the new url and check that is different then the old url
                    this.assert.ok(oldUrl.value !== currentUrl.value, 'Check if the redirect has been made');
                });
            // test the page tree popin to be visible again
            self.pageTreeObject.expect.element('@pageTree').to.be.visible.after(client.globals.loadTime.pageTree.loadPopin);
        });
    },

    /**
     * Test right click on page opens context menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test right click on page opens context menu' : function (client) {
        'use strict';

        var self = this;

        client.element('css selector', this.pageTreeObject.elements.firstChildNode.selector, function (result) {
            client.moveTo(result.value.ELEMENT, 0, 0, function () {
                client.mouseButtonClick('right');
                self.pageTreeObject.expect.section('@contextMenu').to.be.visible.before(client.globals.loadTime.defaultWait);
            });
        });
    },

    /**
     * Test context menu on homepage
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test context menu on homepage' : function (client) {
        'use strict';

        var self = this;

        client.element('css selector', this.pageTreeObject.elements.rootNode.selector, function (result) {
            client.moveTo(result.value.ELEMENT, 0, 0, function () {
                client.mouseButtonClick('right');
                self.pageTreeObject.expect.section('@contextMenu').to.be.visible.before(client.globals.loadTime.defaultWait);
            });
        });
        this.contextMenuSection.checkHomeDisplayedButtons();
    },

    /**
     * Test context menu after clicking on copy
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test context menu after clicking on copy' : function (client) {
        'use strict';

        this.pageTreeObject
            .contextMenuAction('copyButton', this.pageTreeObject.elements.firstChildNode.selector)
            .expect.element('@firstChildNodeSpan').to.have.css('outline-style', 'Check if the copied page has a dotted frame');
        // open the context menu on the second page under home
        client.element('css selector', this.pageTreeObject.elements.secondChildNode.selector, function (result) {
            client.moveTo(result.value.ELEMENT, 0, 0, function () {
                client.mouseButtonClick('right');
            });
        });
        // check if the paste, paste before, paste after buttons are displayed
        this.contextMenuSection.checkCopyDisplayedButtons();
    },

    /**
     * Test create button from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test create button from contextual menu' : function (client) {
        'use strict';

        this.pageTreeObject
            .contextMenuAction('addButton', this.pageTreeObject.elements.firstChildNode.selector)
            // test if the page tree popin is still open
            .assert.elementPresent('@pageTree');
        // test if the create page popin appears
        this.pagePopinsObject.expect.section('@createPopin').to.be.visible.after(client.globals.loadTime.pageTree.createPagePopin);
        client.pause(client.globals.loadTime.pageTree.createPagePopin);
        // test the create page form and create a new page
        this.pagePopinsObject.section.createPopin.createNewPage();
        client.pause(client.globals.loadTime.pageTree.createPage);
        // open the first page in tree
        this.pageTreeObject.click('@firstChildNodeOpenSubpages');
        client.pause(client.globals.loadTime.pageTree.waitForSubpagesToShow);
        // check if the page created before is the first subpage
        this.pageTreeObject.checkNewCreatedPage();
    },

    /**
     * Test edit button from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test edit button from contextual menu' : function (client) {
        'use strict';

        this.pageTreeObject
            .contextMenuAction('editButton', this.pageTreeObject.elements.firstChildNode.selector)
            // test if the page tree popin is still open
            .assert.elementPresent('@pageTree');
        // test if the edit page popin appears
        this.pagePopinsObject.expect.section('@editPopin').to.be.visible.after(client.globals.loadTime.pageTree.editPagePopin);
        client.pause(client.globals.loadTime.pageTree.editPagePopin);
        // close the edit popin
        this.pagePopinsObject.section.editPopin.click('@closeButton');
    },

    /**
     * Test delete from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test delete from contextual menu' : function (client) {
        'use strict';

        this.pageTreeObject
            // make sure to have context menu closed by clicking somewhere else
            .contextMenuAction('removeButton', this.pageTreeObject.elements.firstChildNode.selector)
            // test if the page tree popin is still open
            .assert.elementPresent('@pageTree');
        // test if the delete page popin appears
        this.pagePopinsObject.expect.section('@deletePopin').to.be.visible.after(client.globals.loadTime.pageTree.deletePagePopin);
        client.pause(client.globals.loadTime.pageTree.deletePagePopin);
        // test that text and buttons are displayed
        this.pagePopinsObject.section.deletePopin
            .assertElementsPresent()
            // close the delete popin
            .click('@closeButton');
    },

    /**
     * Test browse to from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test browse to from contextual menu' : function (client) {
        'use strict';

        var self = this;

        client.url(function (oldUrl) {
            self.pageTreeObject.contextMenuAction('browseToButton', self.pageTreeObject.elements.rootNode.selector);
            client
                .pause(client.globals.loadTime.toolbar)
                // get the new url
                .url(function (currentUrl) {
                    // check old url with the new url
                    this.assert.ok(oldUrl.value !== currentUrl.value, 'Check if the redirect has been made');
                    self.pageTreeObject.assert.elementPresent('@pageTree');
                });
        });
    },

    /**
     * Test paste as subpage from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test paste as subpage from contextual menu' : function (client) {
        'use strict';

        var pageName;

        this.pageTreeObject
            .contextMenuAction('cutButton', this.pageTreeObject.elements.secondChildNode.selector)
            .getText(this.pageTreeObject.elements.secondChildNode.selector, function (result) {
                pageName = result.value;
            })
            .expect.element('@secondChildNodeSpan').to.have.css('outline-style', 'Check if the cutted page has a dotted frame');
        this.pageTreeObject
            .contextMenuAction('pasteButton', this.pageTreeObject.elements.firstChildNode.selector)
            // click and pause to load the subpages
            .click('@firstChildNodeOpenSubpages');
        client
            .pause(client.globals.loadTime.pageTree.waitForSubpagesToShow)
            // test if the page name is the same in the new position
            .getText(this.pageTreeObject.elements.firstChildNodeFirstSubpage.selector, function (result) {
                this.assert.ok(pageName === result.value, 'Check if the page was successfully moved as a subpage');
            });
    },

    /**
     * Test paste before from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test paste before from contextual menu' : function (client) {
        'use strict';

        var pageName;

        this.pageTreeObject
            .contextMenuAction('cutButton', this.pageTreeObject.elements.secondChildNode.selector)
            // get the second page name
            .getText(this.pageTreeObject.elements.secondChildNode.selector, function (result) {
                pageName = result.value;
            })
            .contextMenuAction('pasteBeforeButton', this.pageTreeObject.elements.firstChildNode.selector)
            .api.pause(client.globals.loadTime.minimumWait)
            // test if the page name is the same in the new position
            .getText(this.pageTreeObject.elements.firstChildNode.selector, function (result) {
                this.assert.ok(pageName === result.value, 'Check if the page was successfully moved before');
            });
    },

    /**
     * Test paste after from contextual menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test paste after from contextual menu' : function (client) {
        'use strict';

        var pageName;

        this.pageTreeObject
            .contextMenuAction('cutButton', this.pageTreeObject.elements.firstChildNode.selector)
            // get the first page name
            .getText(this.pageTreeObject.elements.firstChildNode.selector, function (result) {
                pageName = result.value;
            })
            .contextMenuAction('pasteAfterButton', this.pageTreeObject.elements.secondChildNode.selector)
            .api.pause(client.globals.loadTime.minimumWait)
            // test if the page name is the same in the new position
            .getText(this.pageTreeObject.elements.secondChildNode.selector, function (result) {
                this.assert.ok(pageName === result.value, 'Check if the page was successfully moved after');
            });
    },

    /**
     * Test click arrow of folder shows subpages
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test click arrow of folder shows subpages' : function (client) {
        'use strict';

        var self = this;

        // click and pause to load the subpages
        this.pageTreeObject.click('@firstChildNodeOpenSubpages');
        // check state of toggler, if closed then click on it again
        client
            .element('css selector', this.pageTreeObject.elements.firstChildNodeOpenSubpages.selector, function (result) {
                client.elementIdAttribute(result.value.ELEMENT, 'class', function (classResult) {
                    if (classResult.value.indexOf(toggleClosedClass) > -1) {
                        self.pageTreeObject.click('@firstChildNodeOpenSubpages');
                    }
                });
            })
            .pause(client.globals.loadTime.pageTree.waitForSubpagesToShow)
            .elements('css selector', this.pageTreeObject.elements.firstChildNodeSubpages.selector, function (result) {
                result.value.forEach(function (element) {
                    client.elementIdDisplayed(element.ELEMENT, function (displayed) {
                        this.assert.ok(displayed.value === true, 'Check subpage to be displayed');
                    });
                });
            });
    },

    /**
     * Test click arrow of folder hides subpages
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test click arrow of folder hides subpages' : function (client) {
        'use strict';

        // click and pause to hide the subpages
        this.pageTreeObject.click('@firstChildNodeOpenSubpages');
        client
            .pause(client.globals.loadTime.pageTree.waitForSubpagesToShow)
            .elements('css selector', this.pageTreeObject.elements.firstChildNodeSubpages.selector, function (result) {
                result.value.forEach(function (element) {
                    client.elementIdDisplayed(element.ELEMENT, function (displayed) {
                        this.assert.ok(displayed.value === false, 'Check subpage to not be displayed');
                    });
                });
            });
    },

    /**
     * Test actions dropdown
     * 
     * @returns {undefined}
     */
    'Test actions dropdown' : function () {
        'use strict';

        // check if the actions dropdown is present and is not disabled anymore
        this.pageTreeObject
            .click('@secondChildNode')
            .assert.elementPresent('@actionButton')
            .assert.cssClassNotPresent('@actionButton', disabledClass)
            .assert.elementPresent('@actionButtonDropdown')
            .assert.cssClassNotPresent('@actionButtonDropdown', disabledClass);
        // check available actions against contextul menu actions
        this.pageTreeObject.section.actionsMenu.checkActionsAgainstContextMenu();
    },

    /**
     * Test create button from actions menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test create button from actions menu' : function (client) {
        'use strict';

        // activate actions menu and open the list of available actions
        this.pageTreeObject
            .click('@secondChildNode')
            .click('@actionButtonDropdown');
        // click on the add button from the actions menu
        this.pageTreeObject.section.actionsMenu.click('@addButton');
        // test if the page tree popin is still open
        this.pageTreeObject.assert.elementPresent('@pageTree');
        // test if the create page popin appears
        this.pagePopinsObject.expect.section('@createPopin').to.be.visible.after(client.globals.loadTime.pageTree.createPagePopin);
        client.pause(client.globals.loadTime.pageTree.createPagePopin);
        // test the create page form and create a new page
        this.pagePopinsObject.section.createPopin.createNewPage();
        client.pause(client.globals.loadTime.pageTree.createPage);
        // open the first page in tree
        this.pageTreeObject
            .click('@firstChildNodeOpenSubpages')
            .api.pause(client.globals.loadTime.pageTree.waitForSubpagesToShow);
        // check if the page created before is the first subpage
        this.pageTreeObject.checkNewCreatedPage();
    },

    /**
     * Test edit button from actions menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test edit button from actions menu' : function (client) {
        'use strict';

        // activate actions menu and open the list of available actions
        this.pageTreeObject
            .click('@secondChildNode')
            .click('@actionButtonDropdown');
        // click on the add button from the actions menu
        this.pageTreeObject.section.actionsMenu.click('@editButton');
        // test if the page tree popin is still open
        this.pageTreeObject.assert.elementPresent('@pageTree');
        // test if the edit page popin appears
        this.pagePopinsObject.expect.section('@editPopin').to.be.visible.after(client.globals.loadTime.pageTree.editPagePopin);
        client.pause(client.globals.loadTime.pageTree.editPagePopin);
        // close the edit popin
        this.pagePopinsObject.section.editPopin.click('@closeButton');
    },

    /**
     * Test delete from actions menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test delete from actions menu' : function (client) {
        'use strict';

        // activate actions menu and open the list of available actions
        this.pageTreeObject
            .click('@firstChildNode')
            .click('@actionButtonDropdown');
        // click on the delete button from the actions menu
        this.pageTreeObject.section.actionsMenu.click('@removeButton');
        // test if the page tree popin is still open
        this.pageTreeObject.assert.elementPresent('@pageTree');
        // test if the delete page popin appears
        this.pagePopinsObject.expect.section('@deletePopin').to.be.visible.after(client.globals.loadTime.pageTree.deletePagePopin);
        client.pause(client.globals.loadTime.pageTree.deletePagePopin);
        // test that text and buttons are displayed
        this.pagePopinsObject.section.deletePopin
            .assertElementsPresent()
            // close the delete popin
            .click('@closeButton');
    },

    /**
     * Test browse to from actions menu
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    'Test browse to from actions menu' : function (client) {
        'use strict';

        var self = this;

        client.url(function (oldUrl) {
            self.pageTreeObject
                    .click('@secondChildNode')
                    // open actions menu
                    .click('@actionButtonDropdown');
            // click on browse to
            self.pageTreeObject.section.actionsMenu.click('@browseToButton');
            client
                .pause(client.globals.loadTime.toolbar)
                .url(function (currentUrl) {
                    // get the new url and check to be different then the old url
                    this.assert.ok(oldUrl.value !== currentUrl.value, 'Check if the redirect has been made');
                    self.pageTreeObject.assert.elementPresent('@pageTree');
                });
        });
    },

    /**
     * Test search page tree
     * 
     * @returns {undefined}
     */
    'Test search page tree' : function () {
        'use strict';

        this.pageTreeObject.section.search
            .search()
            .checkSearchResults()
            .clearValue('@searchInput')
            .click('@submitButton');
    },

    /**
     * After all tests are ran we logout and end the client
     * 
     * @param {Object} client
     * @returns {undefined}
     */
    after : function (client) {
        'use strict';

        client
            .logout()
            .end();
    }
};