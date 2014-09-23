define(['jquery', 'bb.Api'], function(jQuery, bbApi) {

    var DbManager = null,

        SmartList = null,

        /**
         * [DbManager description]
         */
        DbManager = function () {

            var _db = null,

                _dbName = null,

                _dbContainer = {},

                /**
                 * Init Db Manager
                 * @param  {[type]} dbName [description]
                 * @return {[type]}        [description]
                 */
                _init = function (dbName) {
                    var data = _createOrRetrieveDb(dbName),
                        storageItem = _createStorage(data,dbName),

                    _dbContainer[dbName] = storageItem;

                    if(!localStorage) {
                        throw new Exception('localStorage can\'t be found');
                    }

                    return storageItem;
                },

                /**
                 * Update local storage
                 * @param  {mixed}  value      [value to keep in storage]
                 * @param  {string} identifier [Database identifier]
                 */
                _updateLocalStorage = function (value, identifier) {
                    var identifier = identifier || 'none',
                        dbToString = JSON.stringify(newStorage);

                    localStorage.setItem(identifier, dbToString);
                };

                /**
                 * Create or retrieve db in local storage
                 * @param  {string} identifier [description]
                 * @return {object}        [description]
                 */
                _createOrRetrieveDb = function (identifier) {
                    var result = false,
                        data = localStorage.getItem(identifier) || null;

                    if (data) {
                        result = _getLocalData(data);
                    }

                    if (!data) {
                        result = localStorage.setItem(identifier, '{}');
                        result = {};
                    }

                    return result;
                },

                /**
                 * Get local stored data
                 * @param  {string} identifier [value identifier]
                 * @return {mixed}             [the stored data]
                 */
                _getLocalData = function (identifier) {
                    return JSON.parse(identifier);
                },

                /**
                 * Get the database
                 * @param  {[type]} identifier [database identifier]
                 * @return {object}            [the database]
                 */
                _getDb = function (identifier) {
                    if (identifier !== undefined) {
                        return _dbContainer[identifier];
                    }
                },

                /**
                 * Delete a database
                 * @param  {[type]} list [description]
                 * @return {[type]}      [description]
                 */
                _deleteDb = function(list){
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
                _createConfig = function (identifier, data) {
                    var config = {};

                    config.data = data;
                    config.name = identifier;
                    config.onChange = _updateLocalStorage;
                    config.onDelete = _updateLocalStorage;
                    config.onDestroy = _deleteDb;

                    return config
                },

                /**
                 * Create storage
                 * @param  {object} data       [config data]
                 * @param  {string} identifier [config identifier]
                 * @return {SmartList}         [An object stared]
                 */
                _createStorage = function (data, identifier) {
                    return new SmartList(_createConfig(identifier, data));
                };


            return {
                init : _init,
                getDb:_getDb
            };
        },

        /*
        * Simple data container with action events
        * Events : [onInit, onAdd, onChange, onReplace, onDestroy, onDelete]
        *
        **/
        SmartList = function (config) {
            var config = config || {};

            this.name = config.name || 'list_' + new Date().getTime();
            this.dataContainer = {};
            this.itemCount = 0;
            this.keyId = null;
            this.maxEntry = null;
            /*events*/
            this.onChange = function () {};
            this.onDestroy = function () {};
            this.onInit = function () {};
            this.onAdd = function () {};
            this.onReplace = function () {};
            this.onDelete = function () {};

            if (typeof this.init !== 'function') {
                this.init = function (config) {
                    var data = ((config.data) ? config.data : {});

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
                        this.maxEntry = parseInt(config.maxEntry);
                    }

                    this.setData(data);
                    this.itemCount = this.getSize();
                }
            }

            /**
             * Set max entry into the Smartlist
             * @param {number} maxEntry [max entry authorized]
             */
            SmartList.prototype.setMaxEntry = function (maxEntry) {
                this.maxEntry = (maxEntry) || null;
            }

            /**
             * Setter
             * @param {string} key   [value identifier]
             * @param {mixed}  value [value]
             */
            SmartList.prototype.set =  function (key, value) {
                if (this.dataContainer[key] === undefined) {
                    var bound = this.itemCount + 1;

                    if ( this.maxEntry && (bound > this.maxEntry)) {
                        return;
                    }

                    this.itemCount = bound
                }
                this.dataContainer[key] = value;
                this.onChange.call(this, this.dataContainer, this.name, value);

                return this.dataContainer;
            }

            /**
             * Getter
             * @param  {string} key [value identifier]
             * @return {mixed}      [value]
             */
            SmartList.prototype.get = function (key) {
                return this.dataContainer[key] || false;
            }

            /**
             * Destroy the Smartlist
             */
            SmartList.prototype.destroy = function () {
                var self = this;

                this.dataContainer = {};
                this.itemCount = 0;
                this.onDestroy.call(this,self);
            }

            /**
             * Reset the Smartlist
             */
            SmartList.prototype.reset = function () {
                this.destroy();
            }

            /**
             * Get all datas
             * @return {object} [the data container]
             */
            SmartList.prototype.getData = function () {
                return this.dataContainer;
            }

            /**
             * Transform the data container into an Array
             * @param  {boolean} clear [true if you want a clean array]
             * @return {array}         [data conainer as array]
             */
            SmartList.prototype.toArray = function (clear) {
                var cleanData = [];

                if(clear) {
                    jQuery.each(this.dataContainer, function (key, item) {
                        cleanData.push(item);
                    });
                } else {
                    var cleanData = jQuery.makeArray(this.dataContainer);
                }

                return cleanData;
            }

            /**
             * Replace item
             * @param  {[type]} item [description]
             * @return {[type]}      [description]
             */
            SmartList.prototype.replaceItem = function (item) {
                this.dataContainer[item[this.keyId]] = item;
                this.onReplace.call(this, this.dataContainer, this.name, item);
            }

            /**
             * Delete Item
             * @param  {[type]} item [description]
             * @return {[type]}      [description]
             */
            SmartList.prototype.deleteItem = function (item) {
                delete(this.dataContainer[item[this.keyId]]);
                this.itemCount = this.itemCount - 1;
                this.onDelete.call(this, this.dataContainer, this.name, item);
            }

            /**
             * Delete item by identifier
             * @param  {string} identifier [description]
             */
            SmartList.prototype.deleteItemById = function (identifier) {
                delete(this.dataContainer[identifier]);
                this.itemCount = this.itemCount - 1;
                this.onDelete.call(this, this.dataContainer, this.name, identifier);
            }

            /**
             * Set data
             * @param {mixed}  data  [Data to store]
             * @param {string} key   [Data identifier]
             */
            SmartList.prototype.setData = function (data, key) {
                var self = this,
                    data = ((data) ? data : {});

                if (keyId) {
                    self.keyId = key;
                }
                if (bb.jquery.isArray(data)) {
                    bb.jquery.each(data, function (i, item {
                        var itemId = item[self.keyId];

                        self.set(itemId, item);
                    });
                } else {
                    this.dataContainer = data;
                }
                this.onInit.call(this, this.dataContainer);
            }

            /**
             * Add data
             * @param {mixed} data [Data to store]
             */
            SmartList.prototype.addData = function (data) {
                var self = this,
                    items = [],
                    data = ((data) ? data : {});

                if (bb.jquery.isArray(data)) {
                    bb.jquery.each(data, function (i, item) {
                        var itemId = item[self.keyId],
                            newKey = self.keyId + '_' + itemId;

                        self.set(itemId, item);
                        items.push(item);
                    });
                } else {
                    this.dataContainer = bb.jquery.extend(true, this.dataContainer, data);
                }

                this.onAdd.call(this, items);
            }

            /**
             * Get Smartlist size
             * @return {number} [the object size]
             */
            SmartList.prototype.getSize = function(){
                var items = this.toArray(true);
                return items.length;
            }

            return this.init(config);
        },

        /**
         * require with Promise
         * @param  {[type]} dep [description]
         * @return {[type]}     [description]
         */
        _requireWithPromise = function (dep) {
            var def = new jQuery.Deferred();

            require(
                dep,
                function () {
                    def.resolve.apply(this, arguments);
                },
                function (reason) {
                    def.reject(reason);
                }
            )
            return def.promise();
        };

    bbApi.register('bb.DBManager', DbManager);
    bbApi.register('SmartList', SmartList);

    return {
        DbManager: DbManager,
        SmartList: SmartList,
        requireWithPromise: _requireWithPromise
    }
});
