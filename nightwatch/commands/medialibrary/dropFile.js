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
 * Custom command for droping an imagge in an hidden input
 * Checks if the provided url is a valid url
 *
 * @category    NightWatch
 * @subcategory CustomCommands
 * @copyright   Lp digital system
 * @author      Bogdan Oanes <bogdan.oanes@lp-digital.fr>
 */

var path = require('path');

module.exports.command = function (indexNumber, className, fileName, callback) {
    'use strict';

    var self = this,
        fileFullPath = path.resolve(path.dirname()) + fileName;

    this.execute(
        function (indexNumber, className) {
            var hiddenElement = document.getElementsByClassName(className);

            hiddenElement[indexNumber].style.visibility = 'visible';
            hiddenElement[indexNumber].style.zIndex = '999999';
            hiddenElement[indexNumber].style.width = '10px';
            hiddenElement[indexNumber].style.height = '10px';

            return true;
        },

        [indexNumber, className],

        function (result) {
            if (typeof callback === 'function') {
                callback.call(self, result);
            }
        }
    ).pause(2000).setValue('input.' + className + ':last-child', fileFullPath);

    return this;
};