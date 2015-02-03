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
        'tb.core',
        'content.repository',
        'content.models.ContentRevision',
        'jquery',
        'content.manager',
        'jsclass'
    ],
    function (Core, ContentRepository, ContentRevision, jQuery) {

        'use strict';

        var AbstractContent = new JS.Class({

            mainTag: '#bb5-ui',

            contentClass: '.bb-content',

            /**
             * Initialize AbstractContent
             *
             * @param {Object} config
             */
            initialize: function (config) {

                this.updated = false;

                this.computeMandatoryConfig(config);

                this.populate();

                this.bindEvents();

                this.revision = new ContentRevision(config);
            },

            /**
             * Set the state of content
             * @param {Boolean} isUpdate
             */
            setUpdated: function (isUpdate) {
                if (typeof isUpdate === 'boolean') {
                    this.updated = isUpdate;
                }
            },

            set: function (key, value) {
                if (key === 'value') {
                    this.revision.addElement(key, value);

                    this.setUpdated(true);
                } else {
                    this[key] = value;
                }

                this.setUpdated(true);
            },

            /**
             * Return a property of object if exist
             * @param {String} key
             * @returns {Mixed}
             */
            get: function (key) {
                var result;

                if (key === 'value') {
                    result = this.revision.getElement(key);
                    if (result === undefined) {
                        result = this[key];
                    }
                } else {
                    result = this[key];
                }

                return result;
            },

            /**
             * Find parameters
             * If the revision have parameters, the parameters of
             * revision will be returned else the parameters of data.
             * Its possible that data don't have parameters, in this case
             * undefined will be returned
             * @returns {Mixed]
             */
            findParameters: function () {
                var result,
                    dataParameters = this.data.parameters,
                    revisionParameters = this.revision.parameters,
                    key;

                if (revisionParameters !== undefined) {

                    for (key in dataParameters) {
                        if (dataParameters.hasOwnProperty(key)) {
                            if (revisionParameters.hasOwnProperty(key)) {
                                dataParameters[key].value = revisionParameters[key];
                            }
                        }
                    }
                    result = dataParameters;
                } else {
                    result = dataParameters;
                }

                return result;
            },

            getParameters: function (key) {
                var keys,
                    i,
                    result,
                    parameters;

                if (this.data !== undefined) {
                    parameters = this.findParameters();

                    if (key === undefined) {
                        result = parameters;
                    } else {
                        if (key.indexOf(':') !== -1) {
                            keys = key.split(':');

                            for (i in keys) {
                                if (keys.hasOwnProperty(i)) {
                                    if (parameters.hasOwnProperty(keys[i])) {
                                        parameters = parameters[keys[i]];
                                    } else {
                                        result = parameters;
                                        break;
                                    }
                                }
                            }
                        } else {
                            result = parameters[key];
                        }
                    }
                }

                return result;
            },

            /**
             * Set parameters to revision if a difference exist between new 
             * and old parameters
             * @param {Object} parameters
             */
            setParameters: function (parameters) {
                var dataParameters,
                    data,
                    key;

                if (this.hasOwnProperty('data')) {

                    data = this.data;
                    dataParameters = data.parameters;

                    if (typeof parameters === 'object' && Object.keys(parameters).length > 0) {

                        for (key in parameters) {
                            if (parameters.hasOwnProperty(key)) {
                                if (dataParameters.hasOwnProperty(key)) {
                                    if (dataParameters[key].value === parameters[key]) {
                                        delete parameters[key];
                                    }
                                }
                            }
                        }

                        if (Object.keys(parameters).length > 0) {
                            this.revision.setParameters(parameters);
                            this.setUpdated(true);
                        }
                    }
                }

            },

            /**
             * Retrieve the data and set the data
             */
            retrieveData: function () {
                var self = this;

                this.getData().done(function (data) {
                    self.data = data;
                });
            },

            /**
             * If data not exist a request has been send for recieve data
             * @returns {Promise}
             */
            getData: function (key, async) {
                var self = this,
                    dfd = jQuery.Deferred(),
                    func = function (data, key) {
                        var result = null;

                        if (key !== undefined) {
                            result = data[key];
                        } else {
                            result = data;
                        }

                        return result;
                    };

                if (this.data === undefined) {
                    ContentRepository.findData(this.type, this.uid).done(function (data) {
                        self.data = data;
                        dfd.resolve(func(data, key));
                    });
                } else {
                    if (async === false) {
                        return func(this.data, key);
                    }
                    dfd.resolve(func(this.data, key));
                }

                return dfd.promise();
            },

            updateRevision: function () {
                return this.revision;
            },

            isSavable: function () {
                return !this.revision.isEmpty();
            },

            /**
             * Add properties to the content like bb-content class or id
             */
            populate: function () {
                this.jQueryObject.attr('data-bb-id', this.id);
            },

            /**
             * Bind events of content
             */
            bindEvents: function () {
                jQuery('html').off().on('click', jQuery.proxy(this.onClickOut, this));
                this.jQueryObject.on('click', jQuery.proxy(this.onClick, this));
                this.jQueryObject.on('mouseenter', jQuery.proxy(this.onMouseEnter, this));
                this.jQueryObject.on('mouseleave', jQuery.proxy(this.onMouseLeave, this));
            },

            /**
             * Select the content
             */
            select: function () {
                this.addClass('bb-content-selected');
            },

            /*
             * Unselect the content
             */
            unSelect: function () {
                this.removeClass('bb-content-selected');
            },

            /**
             * compute and verify the config
             * jQueryObject, objectIdentifier and id must be set
             *
             * @param {Object} config
             */
            computeMandatoryConfig: function (config) {
                var key;

                if (typeof config.jQueryObject !== 'object') {
                    Core.exception('BadTypeException', 500, 'The jQueryObject must be set');
                }

                if (typeof config.uid !== 'string') {
                    Core.exception('BadTypeException', 500, 'The uid must be set');
                }

                if (typeof config.type !== 'string') {
                    Core.exception('BadTypeException', 500, 'The type must be set');
                }

                for (key in config) {
                    if (config.hasOwnProperty(key)) {
                        this[key] = config[key];
                    }
                }

                this.id = Math.random().toString(36).substr(2);
            },

            /**
             * Return the property of definition or all definition if key is not informed
             * @param {String} key
             * @returns {Mixed}
             */
            getDefinition: function (key) {
                var result = null;

                if (key) {
                    if (this.definition.hasOwnProperty(key)) {
                        result = this.definition[key];
                    }
                } else {
                    result = this.definition;
                }

                return result;
            },

            /**
             * Get Parent as content
             * @returns {Array}
             */
            getParent: function () {
                var parentNode = this.jQueryObject.parents(this.contentClass + ':first');

                return require('content.manager').getContentByNode(parentNode);
            },

            /**
             * Return the html of content
             * @param {String} renderMode
             * @returns {Promise}
             */
            getHtml: function (renderMode) {
                return ContentRepository.getHtml(this.type, this.uid, renderMode);
            },

            /**
             * Return if content is a ContentSet
             * @returns {Boolean}
             */
            isAContentSet: function () {
                return this.definition.properties.is_container;
            },

            /**
             * Add a class to the content
             * @param {String} className
             */
            addClass: function (className) {
                this.jQueryObject.addClass(className);
            },

            /**
             * RemoveClass to the content
             * @param {String} className
             */
            removeClass: function (className) {
                this.jQueryObject.removeClass(className);
            }
        });

        return AbstractContent;
    }
);
