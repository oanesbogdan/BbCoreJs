(function () {
    'use strict';

    define('tb.core.Utils', ['jquery', 'tb.core.Api'], function (jQuery, Api) {


        /**
         * Simple data container with action events
         * Events : [onInit, onAdd, onChange, onReplace, onDestroy, onDelete]
         *
         **/
        var SmartList = function (config) {

                config = config || {};
                this.name = config.name || 'list_' + new Date().getTime();
                this.dataContainer = {};
                this.itemCount = 0;
                this.keyId = null;
                this.maxEntry = null;
                /*events*/
                this.onChange = function () { return; };
                this.onDestroy = function () { return; };
                this.onInit = function () { return; };
                this.onAdd = function () { return; };
                this.onReplace = function () { return; };
                this.onDelete = function () { return; };

                if (typeof this.init !== 'function') {
                    this.init = function (config) {
                        var data = config.data || {};

                        this.onChange = ((typeof config.onChange === 'function') ? config.onChange : this.onChange);
                        this.onDestroy = ((typeof config.onDestroy === 'function') ? config.onDestroy : this.onDestroy);

                        if (config.idKey) {
                            this.keyId = config.idKey;
                        }

                        this.onInit = ((typeof config.onInit === 'function') ? config.onInit : this.onInit);
                        this.onAdd = ((typeof config.onAdd === 'function') ? config.onAdd : this.onAdd);
                        this.onReplace = ((typeof config.onReplace === 'function') ? config.onReplace : this.onReplace);
                        this.onDelete = ((typeof config.onDelete === 'function') ? config.onDelete : this.onDelete);

                        if (config.maxEntry) {
                            this.maxEntry = parseInt(config.maxEntry, 10);
                        }

                        this.setData(data);
                        this.itemCount = this.getSize();
                    };
                }

                /**
                 * Set max entry into the Smartlist
                 * @param {number} maxEntry [max entry authorized]
                 */
                SmartList.prototype.setMaxEntry = function (maxEntry) {
                    this.maxEntry = maxEntry || null;
                };

                /**
                 * Setter
                 * @param {string} key   [value identifier]
                 * @param {mixed}  value [value]
                 */
                SmartList.prototype.set =  function (key, value) {
                    if (this.dataContainer[key] === undefined) {
                        var bound = this.itemCount + 1;

                        if (this.maxEntry && (bound > this.maxEntry)) {
                            return;
                        }

                        this.itemCount = bound;
                    }
                    this.dataContainer[key] = value;
                    this.onChange(this.dataContainer, this.name, value);

                    return this.dataContainer;
                };

                /**
                 * Getter
                 * @param  {string} key [value identifier]
                 * @return {mixed}      [value]
                 */
                SmartList.prototype.get = function (key) {
                    return this.dataContainer[key] || false;
                };

                /**
                 * Destroy the Smartlist
                 */
                SmartList.prototype.destroy = function () {
                    var self = this;

                    this.dataContainer = {};
                    this.itemCount = 0;
                    this.onDestroy(self);
                };

                /**
                 * Reset the Smartlist
                 */
                SmartList.prototype.reset = function () {
                    this.destroy();
                };

                /**
                 * Get all datas
                 * @return {object} [the data container]
                 */
                SmartList.prototype.getData = function () {
                    return this.dataContainer;
                };

                /**
                 * Transform the data container into an Array
                 * @param  {boolean} clear [true if you want a clean array]
                 * @return {array}         [data conainer as array]
                 */
                SmartList.prototype.toArray = function (clear) {
                    var cleanData = [];

                    if (clear) {
                        jQuery.each(this.dataContainer, function (key) {
                            cleanData.push(this.dataContainer[key]);
                        });
                    } else {
                        cleanData = jQuery.makeArray(this.dataContainer);
                    }

                    return cleanData;
                };

                /**
                 * Replace item
                 * @param  {[type]} item [description]
                 * @return {[type]}      [description]
                 */
                SmartList.prototype.replaceItem = function (item) {
                    this.dataContainer[item[this.keyId]] = item;
                    this.onReplace(this.dataContainer, this.name, item);
                };

                /**
                 * Delete Item
                 * @param  {[type]} item [description]
                 * @return {[type]}      [description]
                 */
                SmartList.prototype.deleteItem = function (item) {
                    delete this.dataContainer[item[this.keyId]];
                    this.itemCount = this.itemCount - 1;
                    this.onDelete(this.dataContainer, this.name, item);
                };

                /**
                 * Delete item by identifier
                 * @param  {string} identifier [description]
                 */
                SmartList.prototype.deleteItemById = function (identifier) {
                    delete this.dataContainer[identifier];
                    this.itemCount = this.itemCount - 1;
                    this.onDelete(this.dataContainer, this.name, identifier);
                };

                /**
                 * Set data
                 * @param {mixed}  data  [Data to store]
                 * @param {string} key   [Data identifier]
                 */
                SmartList.prototype.setData = function (data, key) {
                    var self = this;

                    data = data || {};

                    if (key) {
                        self.keyId = key;
                    }
                    if (jQuery.isArray(data)) {
                        jQuery.each(data, function (i, item) {
                            var itemId = data[i][self.keyId];

                            self.set(itemId, item);
                        });
                    } else {
                        this.dataContainer = data;
                    }
                    this.onInit(this.dataContainer);
                };

                /**
                 * Add data
                 * @param {mixed} data [Data to store]
                 */
                SmartList.prototype.addData = function (data) {
                    var self = this,
                        items = [];

                    data = data || {};

                    if (jQuery.isArray(data)) {
                        jQuery.each(data, function (i, item) {
                            var itemId = data[i][self.keyId];
                            // newKey = self.keyId + '_' + itemId;

                            self.set(itemId, item);
                            items.push(item);
                        });
                    } else {
                        this.dataContainer = jQuery.extend(true, this.dataContainer, data);
                    }

                    this.onAdd(items);
                };

                /**
                 * Get Smartlist size
                 * @return {number} [the object size]
                 */
                SmartList.prototype.getSize = function () {
                    var items = this.toArray(true);
                    return items.length;
                };

                return this.init(config);
            },

            /**
             * require with Promise
             * @param  {[type]} dep [description]
             * @return {[type]}     [description]
             */
            requireWithPromise = function (dep) {
                var def = new jQuery.Deferred();

                require(
                    dep,
                    function () {
                        def.resolve.apply(this, arguments);
                    },
                    function (reason) {
                        def.reject(reason);
                    }
                );

                return def.promise();
            },

            /**
             * [DbManager description]
             */
            DbManager = function () {

                var dbContainer = {},

                    /**
                     * Update local storage
                     * @param  {mixed}  value      [value to keep in storage]
                     * @param  {string} identifier [Database identifier]
                     */
                    updateLocalStorage = function (value, identifier) {
                        var dbToString = JSON.stringify(value);

                        identifier = identifier || 'none';

                        localStorage.setItem(identifier, dbToString);
                    },

                    /**
                     * Delete a database
                     * @param  {[type]} list [description]
                     * @return {[type]}      [description]
                     */
                    deleteDb = function (list) {
                        if (typeof list === 'object') {
                            localStorage.setItem(list.name, '{}');
                        }
                    },

                    /**
                     * Create a Storage Configuration object
                     * @param  {string} identifier [config identifier]
                     * @param  {object} data       [config data]
                     * @return {object}            [Config object]
                     */
                    createConfig = function (identifier, data) {
                        var config = {};

                        config.data = data;
                        config.name = identifier;
                        config.onChange = updateLocalStorage;
                        config.onDelete = updateLocalStorage;
                        config.onDestroy = deleteDb;

                        return config;
                    },

                    /**
                     * Get local stored data
                     * @param  {string} identifier [value identifier]
                     * @return {mixed}             [the stored data]
                     */
                    getLocalData = function (identifier) {
                        return JSON.parse(identifier);
                    },

                    /**
                     * Create or retrieve db in local storage
                     * @param  {string} identifier [description]
                     * @return {object}        [description]
                     */
                    createOrRetrieveDb = function (identifier) {
                        var result = false,
                            data = localStorage.getItem(identifier) || null;

                        if (data) {
                            result = getLocalData(data);
                        }

                        if (!data) {
                            result = localStorage.setItem(identifier, '{}');
                            result = {};
                        }

                        return result;
                    },

                    /**
                     * Create storage
                     * @param  {object} data       [config data]
                     * @param  {string} identifier [config identifier]
                     * @return {SmartList}         [An object stared]
                     */
                    createStorage = function (data, identifier) {
                        return new SmartList(createConfig(identifier, data));
                    },

                    /**
                     * Init Db Manager
                     * @param  {[type]} dbName [description]
                     * @return {[type]}        [description]
                     */
                    init = function (dbName) {
                        var data = createOrRetrieveDb(dbName),
                            storageItem = createStorage(data, dbName);

                        dbContainer[dbName] = storageItem;

                        if (!localStorage) {
                            throw 'localStorage can\'t be found'; // new Exception('localStorage can\'t be found');
                        }

                        return storageItem;
                    },

                    /**
                     * Get the database
                     * @param  {[type]} identifier [database identifier]
                     * @return {object}            [the database]
                     */
                    getDb = function (identifier) {
                        if (identifier !== undefined) {
                            return dbContainer[identifier];
                        }
                    };

                return {
                    init: init,
                    getDb: getDb
                };
            };

        Api.register('bb.DBManager', DbManager);
        Api.register('SmartList', SmartList);

        return {
            DbManager: DbManager,
            SmartList: SmartList,
            requireWithPromise: requireWithPromise
        };
    });
}());
