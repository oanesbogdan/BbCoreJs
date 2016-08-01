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
        'jquery',
        'jsclass'
    ],
    function (jQuery) {

        'use strict';

        var Keyword = {

            services: {
                'ContentManager': 'content.main.getContentManager',
                'DefinitionManager': 'content.main.getDefinitionManager',
                'ContentRepository': 'content.main.getRepository',
                'KeywordRepository': 'content.main.getKeywordRepository'
            },

            init: function (definition) {
                this.definition = definition;

                return this;
            },

            getConfig: function (object, content) {
                var self = this,
                    dfd = jQuery.Deferred(),
                    config;

                this.buildElements(object).done(function (elements) {
                    self.getKeywords(elements).done(function (keywords) {
                        config = {
                            'type': 'keywordSelector',
                            'label': object.label || object.name,
                            'object_name': object.name,
                            'value': self.getValue(keywords)
                        };

                        content[object.name + '_values'] = config.value;

                        dfd.resolve(config);
                    });
                });

                return dfd.promise();
            },

            getValue: function (elements) {
                var key,
                    element,
                    value = [];


                for (key in elements) {
                    if (elements.hasOwnProperty(key)) {
                        element = elements[key];
                        if (element !== null) {
                            value.push({
                                'keyword': element.keyword,
                                'uid': element.uid,
                                'object_uid': element.object_uid
                            });
                        }
                    }
                }

                return value;
            },

            getKeywords: function (elements) {
                var keywords = {},
                    dfd = jQuery.Deferred(),
                    uid,
                    key,
                    element;

                for (key in elements) {
                    if (elements.hasOwnProperty(key)) {
                        element = elements[key];
                        if (element !== null) {
                            uid = element.elements.value;

                            if (uid && typeof uid === 'string') {
                                keywords[uid] = element;
                            }
                        }
                    }
                }

                if (Object.keys(keywords).length > 0) {
                    this.KeywordRepository.findByUids(Object.keys(keywords), true).done(function (data) {
                        var key2;

                        for (key2 in data) {
                            if (data.hasOwnProperty(key2)) {
                                data[key2].object_uid = keywords[data[key2].uid].object_uid;
                            }
                        }

                        dfd.resolve(data);
                    });
                } else {
                    dfd.resolve([]);
                }

                return dfd.promise();
            },

            buildElements: function (object) {
                var uids = [],
                    dfd = jQuery.Deferred(),
                    key;

                if (!jQuery.isArray(object.elements)) {
                    if (undefined !== object.uid) {
                        uids.push(object.uid);
                    }
                } else {
                    for (key in object.elements) {
                        if (object.elements.hasOwnProperty(key)) {
                            uids.push(object.elements[key].uid);
                        }
                    }
                }

                if (uids.length > 0) {
                    this.ContentRepository.findByUids(uids, true).done(function (data) {
                        var key2;

                        for (key2 in data) {
                            if (data.hasOwnProperty(key2)) {
                                data[key2].object_uid = data[key2].uid;
                            }
                        }

                        dfd.resolve(data);
                    });
                } else {
                    dfd.resolve([]);
                }

                return dfd.promise();
            }
        };

        return Keyword;
    }
);