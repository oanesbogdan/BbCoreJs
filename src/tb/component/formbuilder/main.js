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

define(['tb.core.Api', 'jquery', 'tb.component/formbuilder/form/Form', 'tb.core.Utils', 'jsclass'], function (Core, jQuery, FormConstructor, Utils) {
    'use strict';

    /**
     * FormBuilder object
     */
    var FormBuilder = new JS.Class({
        /**
         *
         * config.elements:
         *      name:
         *          type: 'text'
         *          label: 'My name'
         *          value: ''
         *
         * @param {type} config
         */
        renderForm: function (config) {

            var key,
                elements,
                elementConfig,
                typeFormated,
                keyClass,
                keyView,
                self = this,
                keyTemplate,
                keyFormTemplate,
                keyFormView,
                mapKey,
                mappingRequire = {},
                mappingTemplate = [],
                dfd = new jQuery.Deferred();

            if (!config.hasOwnProperty('elements')) {
                Core.exception('MissingPropertyException', 500, 'Property "elements" not found');
            }

            //Load form in config or a default form
            if (!config.hasOwnProperty('form')) {
                config.form = {};
            }

            if (typeof config.onSubmit === 'function') {
                config.form.onSubmit = config.onSubmit;
            }

            if (typeof config.onValidate === 'function') {
                config.form.onValidate = config.onValidate;
            }

            if (!config.form.hasOwnProperty('template')) {
                keyFormTemplate = 'form/template';
                mappingRequire[keyFormTemplate] = 'src/tb/component/formbuilder/form/templates/form.twig';
                mappingTemplate.push(keyFormTemplate);
                config.form.template = keyFormTemplate;
            }

            if (!config.form.hasOwnProperty('view')) {
                keyFormView = 'form.view';
                mappingRequire[keyFormView] = 'src/tb/component/formbuilder/form/views/form.view';
                config.form.view = keyFormView;
            }

            //Set the config (template/view)
            this.form = new FormConstructor(config.form);

            elements = config.elements;
            for (key in elements) {
                if (elements.hasOwnProperty(key)) {
                    elementConfig = elements[key];

                    typeFormated = elementConfig.type.substr(0, 1).toUpperCase() + elementConfig.type.substr(1);
                    keyClass = 'form.element.' + typeFormated;
                    elementConfig.class = keyClass;
                    mappingRequire[keyClass] = 'src/tb/component/formbuilder/form/element/' + typeFormated;

                    if (elementConfig.hasOwnProperty('template')) {
                        keyTemplate = 'form/element/' + this.form.getId() + key + '/template';
                        mappingRequire[keyTemplate] = elementConfig.template;
                    } else {
                        keyTemplate = 'form/element/' + elementConfig.type + '/template';
                        mappingRequire[keyTemplate] = 'src/tb/component/formbuilder/form/element/templates/' + elementConfig.type + '.twig';
                    }
                    elementConfig.template = keyTemplate;
                    mappingTemplate.push(keyTemplate);

                    keyView = 'form.element.view.' + elementConfig.type;
                    elementConfig.view = keyView;
                    mappingRequire[keyView] = 'src/tb/component/formbuilder/form/element/views/form.element.view.' + elementConfig.type;

                    this.form.add(key, elementConfig);
                }
            }


            require.config({paths: mappingRequire});

            for (key in mappingTemplate) {
                if (mappingTemplate.hasOwnProperty(key)) {
                    for (mapKey in mappingRequire) {
                        if (mappingRequire.hasOwnProperty(mapKey)) {
                            if (mappingTemplate.hasOwnProperty(key)) {
                                keyTemplate = mappingTemplate[key];
                                if (mapKey === keyTemplate) {
                                    mappingRequire['text!' + keyTemplate] = mappingRequire[mapKey];
                                    delete mappingRequire[keyTemplate];
                                }
                            }
                        }
                    }
                }
            }

            Utils.requireWithPromise(Object.keys(mappingRequire)).done(function () {
                dfd.resolve(self.form.render());
            }).fail(function (e) {
                dfd.reject(e);
            });

            return dfd.promise();
        }
    });

    return new JS.Singleton(FormBuilder);
});
