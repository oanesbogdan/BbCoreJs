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
define(['tb.core', 'tb.core.FormBuilder', 'tb.core.PopInManager'], function (Core, FormBuilder, PopInManager) {

    'use strict';

    /**
     * View of bundle's index
     * @type {Object} Backbone.View
     */
    var MainViewTestform = Backbone.View.extend({

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} MainViewTestform
         */
        render: function () {
            var config = {
                    elements: {
                        'civility': {
                            type: 'radio',
                            options: {m: 'Mme', mlle: 'Mlle', mr: 'Mr'},
                            checked: ['mlle'],
                            inline: true,
                            label: 'Civilité'
                        },
                        'name': {
                            type: 'select',
                            label: 'My name',
                            options: {titi: 'titi', toto: 'toto'}
                        },
                        'lastname': {
                            type: 'text',
                            label: 'My last name'
                        },
                        'password': {
                            type: 'password',
                            label: 'My password'
                        },
                        'description': {
                            type: 'textarea',
                            label: 'My description'
                        },
                        'cgv': {
                            type: 'checkbox',
                            options: {'cgv': 'Conditions générales de ventes'},
                            inline: true
                        }
                    }
                };


            FormBuilder.renderForm(config).done(function (html) {
                var popin = PopInManager.createPopIn();
                popin.setTitle('Formulaire');
                popin.setContent(html);
                PopInManager.display(popin);
            }).fail(function (e) {
                console.log(e);
            });

            console.log('coucou !');

            return this;
        }
    });

    return MainViewTestform;
});