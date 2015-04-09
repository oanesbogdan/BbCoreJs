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

define(
    [
        'Core/ApplicationManager',
        'jquery',
        'content.manager',
        'component!popin',
        'component!contentformbuilder',
        'component!formbuilder',
        'component!formsubmitter'
    ],
    function (ApplicationManager, jQuery, ContentManager, PopinManager, ContentFormBuilder, FormBuilder, FormSubmitter) {

        'use strict';

        var Edition = {

            contentSetClass: '.contentset',
            config: {onSave: null},

            show: function (content, config) {
                this.config = config || {};
                if (content !== undefined) {
                    this.content = content;
                    this.createPopin();
                    this.edit();
                }
            },

            createPopin: function () {
                if (this.popin) {
                    this.popin.destroy();
                }
                this.popin = PopinManager.createPopIn();
                this.popin.setTitle('Edit');
                this.popin.addOption('width', '500px');
            },

            getDialog: function () {
                var dialog = this.popin || null;
                return dialog;
            },

            getFormConfig: function () {

                var self = this,
                    dfd = new jQuery.Deferred();

                this.content.getData('elements').done(function (elements) {

                    var key,
                        object,
                        element,
                        elementArray = [];

                    for (key in elements) {
                        if (elements.hasOwnProperty(key)) {

                            element = elements[key];
                            object = {
                                'type': element.type,
                                'uid': element.uid,
                                'name': key
                            };

                            elementArray.push(object);
                        }
                    }

                    self.getElementsConfig(elementArray).done(function () {
                        dfd.resolve(self.buildConfig(arguments));
                    });
                });

                return dfd.promise();
            },

            buildConfig: function (parameters) {
                var key,
                    param,
                    config = {
                        'elements': {},
                        'onSubmit': jQuery.proxy(this.onSubmit, this)
                    };

                for (key in parameters) {
                    if (parameters.hasOwnProperty(key)) {
                        param = parameters[key];

                        if (param !== null) {
                            param.popinInstance = this.popin;
                            config.elements[param.object_name] = param;
                        }
                    }
                }

                return config;
            },

            getElementsConfig: function (elementsArray) {

                var key,
                    promises = [],
                    object;

                for (key in elementsArray) {
                    if (elementsArray.hasOwnProperty(key)) {

                        object = elementsArray[key];

                        promises.push(ContentFormBuilder.getConfig(object.type, object));
                    }
                }

                return jQuery.when.apply(undefined, promises).promise();
            },

            /**
             * Edit the content
             */
            edit: function () {
                var self = this;

                this.popin.display();
                this.popin.mask();

                this.getFormConfig().done(function (config) {
                    FormBuilder.renderForm(config).done(function (html) {
                        self.popin.setContent(html);
                        self.popin.unmask();
                    });
                });
            },

            onSubmit: function (data, form) {
                var self = this;

                FormSubmitter.process(data, form).done(function (res) {

                    self.computeData(res);

                    ApplicationManager.invokeService('content.main.save').done(function (promise) {
                        promise.done(function () {

                            if (typeof self.config.onSave === "function") {
                                self.config.onSave(data);
                            }

                            self.content.refresh().done(function () {
                                self.content.refresh();

                                self.popin.hide();
                            });

                            self.config.onSave = null;
                        });
                    });
                });
            },

            computeData: function (data) {
                var element,
                    contentElements = this.content.data.elements,
                    key,
                    item,
                    value;

                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        value = data[key];
                        item = contentElements[key];

                        element = ContentManager.buildElement(item);

                        if (element.type === 'Element/Text') {
                            if (element.get('value') !== value) {
                                element.set('value', value);
                            }
                        } else {
                            if (value !== null) {
                                element.setElements(value);
                            }
                        }
                    }
                }
            }
        };

        return {
            show: jQuery.proxy(Edition.show, Edition),
            getDialog: jQuery.proxy(Edition.getDialog, Edition)
        };
    }
);