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

require.config({
    paths: {
        //Elements
        'plugin.edition.elements': 'src/tb/apps/content/plugins/edition/elements',

        'ElementInterpreter': 'src/tb/apps/content/plugins/edition/ElementInterpreter'
    }
});

define(
    [
        'require',
        'tb.core.ApplicationManager',
        'jquery',
        'tb.core.Utils',
        'content.pluginmanager',
        'content.manager',
        'content.container',
        'component!formbuilder',
        'component!popin',
        'jsclass'
    ],
    function (require, ApplicationManager, jQuery, Utils, PluginManager, ContentManager, ContentContainer, FormBuilder, PopinManager) {

        'use strict';

        PluginManager.registerPlugin('edition', {

            contentSetClass: '.contentset',

            /**
             * Initialization of plugin
             */
            onInit: function () {
                this.createPopin();
            },

            /**
             * Create popin for elements form
             */
            createPopin: function () {
                this.popin = PopinManager.createPopIn();
                this.popin.setTitle('Edit');
                this.popin.addOption('width', '500px');
            },

            getFormConfig: function () {

                var self = this,
                    dfd = new jQuery.Deferred(),
                    content = this.getCurrentContent();

                content.getData('elements').done(function (elements) {

                    var key,
                        object,
                        def,
                        element,
                        elementArray = [],
                        requireArray = [];

                    for (key in elements) {
                        if (elements.hasOwnProperty(key)) {

                            element = elements[key];
                            def = 'ElementInterpreter!' + element.type;
                            object = {
                                'def': def,
                                'type': element.type,
                                'uid': element.uid,
                                'name': key
                            };

                            elementArray.push(object);
                            requireArray.push(def);
                        }
                    }

                    Utils.requireWithPromise(requireArray).done(function () {
                        self.getElementsConfig(elementArray).done(function () {
                            dfd.resolve(self.buildConfig(arguments));
                        });
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
                        param.popinInstance = this.popin;
                        config.elements[param.object_name] = param;
                    }
                }

                return config;
            },

            getElementsConfig: function (elementsArray) {

                var key,
                    promises = [],
                    element,
                    object;

                for (key in elementsArray) {
                    if (elementsArray.hasOwnProperty(key)) {

                        object = elementsArray[key];
                        element = require(object.def);

                        if (element !== null) {
                            promises.push(element.getConfig(object));
                        }
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
                var self = this,
                    content = this.getCurrentContent();

                this.computeData(data);
                this.computeContentSet(form);

                ApplicationManager.invokeService('content.main.save').done(function (promise) {
                    promise.done(function () {
                        content.refresh().done(function () {
                            content.refresh();

                            ContentContainer.clear();
                            self.popin.hide();
                        });
                    });
                });
            },

            computeContentSet: function (form) {
                var self = this,
                    formElement = jQuery('#' + form.id),
                    contentSets = formElement.find(this.contentSetClass);

                contentSets.each(function () {
                    var contentSetElement = jQuery(this),
                        uid = contentSetElement.data('uid'),
                        type = contentSetElement.data('type'),
                        contentSet = ContentManager.buildElement({'uid': uid, 'type': type}),
                        elements = self.buildContentSetElements(contentSetElement);

                    self.compareElements(contentSet, elements);
                });
            },

            compareElements: function (contentSet, elements) {
                var currentElements = contentSet.data.elements,
                    i,
                    doSet = false;

                if (currentElements.length !== elements.length) {
                    doSet = true;
                } else {
                    for (i = 0; i < elements.length; i = i + 1) {
                        if (elements[i].uid !== currentElements[i].uid) {
                            doSet = true;
                            break;
                        }
                    }
                }

                if (doSet === true) {
                    contentSet.setElements(elements);
                }

            },

            buildContentSetElements: function (contentSetElement) {
                var li = contentSetElement.find('li'),
                    elements = [];

                li.each(function () {
                    var $li = jQuery(this);

                    elements.push({'uid': $li.data('uid'), 'type': $li.data('type')});
                });

                return elements;
            },

            computeData: function (data) {
                var content = this.getCurrentContent(),
                    element,
                    contentElements = content.data.elements,
                    key,
                    item,
                    value;

                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        value = data[key];
                        item = contentElements[key];

                        element = ContentManager.buildElement(item);
                        if (element.get('value') !== value) {
                            element.set('value', value);
                        }
                    }
                }
            },

            /**
             * Verify if the plugin can be apply on the context
             * @returns {Boolean}
             */
            canApplyOnContext: function () {
                return true;
            },

            /**
             * Get actions
             * @returns {Array}
             */
            getActions: function () {
                var self = this;

                return [
                    {
                        name: 'Edit',
                        ico: 'fa fa-circle-o',
                        label: 'Edit the content',
                        cmd: self.createCommand(self.edit, self),
                        checkContext: function () {
                            return true;
                        }
                    }
                ];
            }
        });
    }
);