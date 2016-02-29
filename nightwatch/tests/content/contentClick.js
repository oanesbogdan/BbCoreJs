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
 * Content object
 *
 * @category    NightWatch
 * @subcategory Tests
 * @copyright   Lp digital system
 * @author      flavia.fodor@lp-digital.fr
 */

module.exports = {

   /**
    * Before doing the tests, login into the backend
    * 
    */
    before : function (client) {
        'use strict';

        client.login();

        this.pageObject = client.page.content();
        this.sections = this.pageObject.section;
    },

    /**
     * Test if border appears
     * 
     * Checks if after clicking a content the border appears
     * 
     */
    'Test content border and plugins' : function (client) {
        'use strict';

        var elementContent, sectionEl, sectionPlugin;
        for (sectionEl in this.sections) {

            if (this.sections.hasOwnProperty(sectionEl)) {

                elementContent = this.sections[sectionEl];

                client
                     .pause(client.globals.loadTime.toolbar)
                     .click('li#edit-tab-content > a')
                     .clickContent(client, elementContent.selector)
                     .pause(client.globals.loadTime.clickContent)
                     // Checks if after clicking a content the border appears
                     .waitForElementPresent(elementContent.elements.contentSelected.selector, client.globals.loadTime.defaultWait)
                     .assert.visible(elementContent.elements.contentSelected.selector)
                     // Test if plugins appear
                     .waitForElementPresent(elementContent.elements.contentPlugins.selector, client.globals.loadTime.defaultWait)
                     .assert.visible(elementContent.elements.contentPlugins.selector);

                // Checks if after clicking a content all it's plugins appear
                for (sectionPlugin in elementContent.section.plugins.elements) {
                    if (elementContent.section.plugins.elements.hasOwnProperty(sectionPlugin)) {
                        client.assert.visible(elementContent.section.plugins.elements[sectionPlugin].selector);
                    }
                }
            }
        }
    },

    after: function (client) {
        'use strict';

        client.end();
    }
};



