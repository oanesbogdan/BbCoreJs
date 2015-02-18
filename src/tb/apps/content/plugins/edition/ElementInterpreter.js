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

(function () {

    'use strict';

    define(['tb.core.ApplicationManager'], function (ApplicationManager) {

        var association = {
                'Element/Text': 'Text'
            };

        return {

            load: function (name, req, onload) {

                ApplicationManager.invokeService('content.main.getDefinitionManager').done(function (DefinitionManager) {

                    var definition = DefinitionManager.find(name),
                        realName = association[name];

                    if (definition.properties.is_container === true) {
                        realName = 'ContentSet';
                    } else if (realName === undefined) {
                        realName = 'All';
                    }

                    if (null !== definition) {
                        req(['plugin.edition.elements/' + realName], function (elementObject) {
                            onload(elementObject.init(definition));
                        }, function () {
                            onload(null);
                        });
                    } else {
                        onload(null);
                    }
                });
            }
        };
    });
}());