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
        'content.container.manager',
        'content.repository',
        'jsclass'
    ],
    function (ContentContainer,
              ContentRepository
            ) {

        'use strict';

        var SaveManager = new JS.Class({

            /**
             * Save all content updated
             */
            save: function () {
                var contents = ContentContainer.getContentsUpdated(),
                    content,
                    key;

                for (key in contents) {
                    if (contents.hasOwnProperty(key)) {
                        content = contents[key];
                        this.commit(content);
                        this.push(content);
                    }
                }
            },

            /**
             * Update elements and parameters
             * @param {Object} content
             */
            commit: function (content) {
                content.updateRevision();
            },

            /**
             * Save in database a content and merge diff from revision
             * @param {Object} content
             */
            push: function (content) {
                if (content.isSavable()) {
                    ContentRepository.save(content.revision).done(function () {
                        //merge revision to content (wait parameters)
                        return;
                    });
                }
            }
        });

        return new JS.Singleton(SaveManager);
    }
);