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

define('tb.component/formbuilder/main', ['tb.core.Api', 'jquery', 'tb.component/formbuilder/form/Form', 'tb.core.Utils', 'jsclass'], function (Core, jQuery, FormConstructor, Utils) {
    'use strict';

    /**
     * FormBuilder object
     */
    var formPath = 'src/tb/component/formbuilder/form/',

        FormBuilder = new JS.Class({
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

                var form = {},
                    dfd = new jQuery.Deferred();

                if (!config.hasOwnProperty('elements')) {
                    Core.exception('MissingPropertyException', 500, 'Property "elements" not found');
                }

                config = jQuery.extend({}, config);

                this.mappingRequire = {};
                this.mappingTemplate = [];

                this.parseGlobalConfig(config);
                this.parseFormConfig(config.form);

                form = new FormConstructor(config.form);

                this.parseElementConfig(config.elements, form);

                require.config({paths: this.mappingRequire});

                this.mapTemplate();

                Utils.requireWithPromise(Object.keys(this.mappingRequire)).done(function () {
                    dfd.resolve(form.render());
                }).fail(function (e) {
                    dfd.reject(e);
                });

                return dfd.promise();
            },

            parseGlobalConfig: function (config) {
                if (!config.hasOwnProperty('form')) {
                    config.form = jQuery.extend({}, {});
                }

                if (typeof config.onSubmit === 'function') {
                    config.form.onSubmit = config.onSubmit;
                }

                if (typeof config.onValidate === 'function') {
                    config.form.onValidate = config.onValidate;
                }
            },

            parseFormConfig: function (formConfig) {
                var keyFormTemplate,
                    keyFormView;

                if (!formConfig.hasOwnProperty('template')) {
                    keyFormTemplate = 'form/template';
                    this.mappingRequire[keyFormTemplate] = formPath + 'templates/form.twig';
                    this.mappingTemplate.push(keyFormTemplate);
                    formConfig.template = keyFormTemplate;
                }

                if (!formConfig.hasOwnProperty('view')) {
                    keyFormView = 'form.view';
                    this.mappingRequire[keyFormView] = formPath + 'views/form.view';
                    formConfig.view = keyFormView;
                }
            },

            parseElementConfig: function (elements, form) {
                var key,
                    elementConfig,
                    typeFormated,
                    keyClass,
                    keyTemplate,
                    keyView;

                for (key in elements) {
                    if (elements.hasOwnProperty(key)) {
                        elementConfig = jQuery.extend({}, elements[key]);

                        typeFormated = elementConfig.type.substr(0, 1).toUpperCase() + elementConfig.type.substr(1);

                        //Class
                        keyClass = 'form.element.' + typeFormated;
                        elementConfig.class = keyClass;
                        this.mappingRequire[keyClass] = formPath + 'element/' + typeFormated;


                        //Template
                        if (elementConfig.hasOwnProperty('template')) {
                            keyTemplate = 'form/element/' + form.getId() + key + '/template';
                            this.mappingRequire[keyTemplate] = elementConfig.template;
                        } else {
                            keyTemplate = 'form/element/' + elementConfig.type + '/template';
                            this.mappingRequire[keyTemplate] = formPath + 'element/templates/' + elementConfig.type + '.twig';
                        }
                        elementConfig.template = keyTemplate;
                        this.mappingTemplate.push(keyTemplate);


                        //View
                        keyView = 'form.element.view.' + elementConfig.type;
                        elementConfig.view = keyView;
                        this.mappingRequire[keyView] = formPath + 'element/views/form.element.view.' + elementConfig.type;

                        form.add(key, elementConfig);
                    }
                }
            },

            mapTemplate: function () {
                var key,
                    mapKey,
                    keyTemplate;

                for (key in this.mappingTemplate) {
                    if (this.mappingTemplate.hasOwnProperty(key)) {
                        for (mapKey in this.mappingRequire) {
                            if (this.mappingRequire.hasOwnProperty(mapKey)) {
                                if (this.mappingTemplate.hasOwnProperty(key)) {
                                    keyTemplate = this.mappingTemplate[key];
                                    if (mapKey === keyTemplate) {
                                        this.mappingRequire['text!' + keyTemplate] = this.mappingRequire[mapKey];
                                        delete this.mappingRequire[keyTemplate];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

    return new JS.Singleton(FormBuilder);
});
