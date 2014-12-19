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
    ['tb.core', 'tb.core.Renderer'],
    function (Core, renderer) {
        'use strict';

        Core.ControllerManager.registerController('GroupController', {

            appName: 'user',

            config: {
                imports: ['user/repository/group.repository'],
                define: {
                    indexService: ['user/views/group.view.list', 'text!user/templates/groups.list.twig']
                }
            },

            /**
             * Initialize of Page Controller
             */
            onInit: function (req) {
                this.repository = req('user/repository/group.repository');
            },

            /**
             * Index action
             * Show the index in the edit contribution toolbar
             */
            indexService: function (req, popin) {
                var View = req('user/views/group.view.list'),
                    template = req('text!user/templates/groups.list.twig');


                this.repository.paginate().then(
                    function (groups) {
                        var i;
                        for (i = groups.length - 1; i >= 0; i = i - 1) {
                            groups[i] = new View({group: groups[i]});
                        }

                        popin.addGroups(renderer.render(template, groups));
                    },
                    function () {
                        popin.addGroups('');
                        Core.exception.silent('GroupControllerEception', 500, 'Group REST paginate call fail');
                    }
                );
            }
        });
    }
);