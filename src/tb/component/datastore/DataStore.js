define(['require', 'jquery', 'BackBone', 'tb.core.Api', 'underscore', 'jsclass', 'tb.core.DriverHandler', 'tb.core.RestDriver'], function (require, jQuery, BackBone, coreApi, underscore) {
    var CoreDriverHandler = require('tb.core.DriverHandler'),
    CoreRestDriver = require('tb.core.RestDriver'),

    AbstactDataStore = new JS.Class({

        defaultConfig: {
            idKey: 'uid'
        },

        initialize: function (config) {
            jQuery.extend(this, {}, BackBone.Events);
            this.config = jQuery.extend({}, this.defaultConfig, config);
            this.filters = {};
            this.sorters = {};
            this.start = 0;
            this.limit = 25;
            this.data = [];
            this.notifyChange = true;

            this.tasksQueue = [];
        },

        addFilter: function (name, def) {
            if (!name || typeof name !== "string") {
                throw "Exception:addFilter filter name should be a string";
            }
            if (!def || typeof def !== 'function') {
                throw "Exception:addFilter def should be a function";
            }
            this.filters[name] = def;
        },

        addSorter: function (name, def) {
            if (!name || typeof name !== "string") {
                throw "Exception:addSorter filter name should be a string";
            }
            if (!def || typeof def !== 'function') {
                throw "Exception:addSorter def should be a function";
            }
            this.sorters[name] = def;
        },

        setStart : function (start) {
            this.start = start;
            return this;
        },

        setLimit: function (limit) {
            this.limit = limit;
            return this;
        },

        getActionInfos: function (name) {
            var actionInfos = name.split(":");
            return this[actionInfos[0]][actionInfos[1]];
        },

        processTasks: function () {},

        applyFilter: function (name) {
            var task = {
                name: 'filters:' + name,
                params: []
            };
            var params = jQuery.merge([], arguments);
            params.shift();
            task.params = params;
            this.tasksQueue.push(task);
            return this;
        },

        applySorter: function (name) {
            var orderTask = {
                name: 'sorters:' + name,
                params: []
            };
            var params = jQuery.merge([], arguments);
            params.shift();
            orderTask.params = params;
            this.tasksQueue.push(orderTask);
            return this;
        },

        processData: function (data) {
            return data;
        },

        unApplyFilter: function (filterName) {
            this.tasksQueue = underscore.reject(this.tasksQueue, function (task) { return task.name === "filters:"+filterName});
            return this;
        },

        clear: function () {
            this.tasksQueue = [];
            this.start = 0;
            this.limit = 25;
        },

        load: function () {},

        setData: function (data) {
            this.data = this.processData(data);
            if (this.notifyChange) {
                this.trigger("dataStateUpdate", this.data);
            }
        },

        execute: function (silent) {
            this.notifyChange = (typeof silent === "boolean") ? silent : true;
            return this.processTasks();
        }
    }),

    /* JSON Adapter */
    JsonDataStore = new JS.Class(AbstactDataStore, {
        initialize: function (config) {
            this.callSuper(config);
            var data = (this.config.hasOwnProperty('data')) ? this.config.data : [];
            this.dataList = new coreApi.SmartList({
                idKey: this.config.idKey,
                data: data
            });
            this.createGenericSorter();
            this.createGenericFilter();
            /* state before  filtrer*/
            this.previousDataState = {};
        },

        createGenericSorter: function () {
            this.addSorter("fieldSorter", function (fieldName, direction, data) {
                if (!direction && typeof direction !== "string") throw "a Sort direction must be provided";
                if (direction == "desc") {
                    data.sort(function (a, b) {
                        if (a.hasOwnProperty(fieldName) && b.hasOwnProperty(fieldName)) {
                            return a[fieldName] < b[fieldName];
                        }
                    });
                }

                if (direction == "asc") {
                    data.sort(function (a, b) {
                        if (a.hasOwnProperty(fieldName) && b.hasOwnProperty(fieldName)) {
                            return data[fieldName] > data[fieldName];
                        }
                    });
                }
                return data;
            });
        },

        createGenericFilter: function (fieldName, operator, value) {
            return;
        },

        processTasks: function () {
            var self = this;
            var dataState = this.dataList.toArray(true);
            jQuery.each(this.tasksQueue, function (i, task) {
                try {
                    var taskAction = self.getActionInfos(task.name);
                    if (!taskAction) {
                        throw "processTasks:taskFunc for task " + task.name
                    }
                    task.params.push(dataState);
                    dataState = taskAction.apply({}, task.params);
                } catch (e) {
                    return true;
                }
            });
            /* notify the new state */
            this.setData(dataState);
        }
    });

    /* RestDataAdapter */
    RestDataStore = new JS.Class(AbstactDataStore, {
        defaultConfig: {
            autoLoad: false,
            restBaseUrl: '/rest/1'
        },

        initialize: function (config) {
            config = jQuery.extend({}, this.defaultConfig, config);
            this.callSuper(config);
            this.notifyChange = true;
            this.initRestHandler();
            this.createGenericFilter();
            if (this.config.autoLoad) {
                this.load();
            }
        },
        createGenericFilter : function() {
           /* this.addFilter("criteria", function (fieldname, name, value) {

            });*/
        },

        initRestHandler: function () {
            CoreRestDriver.setBaseUrl(this.config.restBaseUrl);
            CoreDriverHandler.addDriver('rest', CoreRestDriver);
        },


        /* build resquest here */
        processTasks: function () {
            var self = this,
            resParams = {limit : 1, sorters : {} , start : this.start, criterias: {}},
            resultPromise = new $.Deferred();
            resParams['limit'] = this.limit;
            jQuery.each(this.tasksQueue, function(i, task) {
               try{
                   var taskAction = self.getActionInfos(task.name);
                   task.params.push(resParams);
                   resParams = taskAction.apply({}, task.params);
               }catch (e) {
                   return true; //continue
                  self.trigger("restDataStoreError", e);
               }
            });

            CoreDriverHandler.read(this.config.resourceEndpoint, resParams.criterias, resParams.sorters, resParams.start, this.limit).done(function(data) {
                self.setData(data);
                resultPromise.resolve(data);
            },resultPromise.reject);

            return resultPromise;
        },

        count: function () {
            return this.data.length;
        }

    });

    return {
        JsonDataStore: JsonDataStore,
        RestDataStore: RestDataStore
    }
});