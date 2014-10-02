define('tb.core.DriverHandler', ['underscore', 'jsclass'], function (us) {
    'use strict';

    /**
     *
     * @type {JS}
     */
    var DriverHandler = new JS.Class({

        /**
         * Driver strategies constants
         */
        STOP_ON_FIRST_DRIVER_STRATEGY: 0,
        EXECUTE_ALL_DRIVER_STRATEGY: 1,

        /**
         * Every available actions
         * @type {Array}
         */
        AVAILABLE_ACTIONS: ['create', 'read', 'update', 'delete', 'patch', 'link'],

        /**
         * Contains every declared drivers
         * @type {Object}
         */
        drivers: {},

        /**
         * the identifier of the default driver to use
         * @type {String}
         */
        defaultDriverId: null,

        /**
         * Contains every declared 'type/action/drivers' mappings
         * @type {Object}
         */
        mappings: {},

        /**
         * Checks if driver with id provided already added
         * @param  {String}  id the driver identifier we want to check existence
         * @return {Boolean} true if driver already added, else false
         */
        hasDriver: function (id) {
            return us.contains(us.keys(this.drivers), id);
        },

        /**
         * Add provided driver with id as key if it does not exist yet
         * @param  {String} id     associated identifier of the driver we are adding
         * @param  {Object} driver the driver to add
         * @return {Object} self
         */
        addDriver: function (id, driver, isDefault) {

            if (false === this.hasDriver(id)) {
                this.drivers[id] = driver;
            }

            if (true === isDefault || null === this.defaultDriverId) {
                this.defaultDriver(id);
            }

            return this;
        },

        /**
         * Define the driver associated with provided id as default driver; it happens only if the driver exist
         * @param  {String} id [description]
         * @return {Object}    self
         */
        defaultDriver: function (id) {
            if (true === this.hasDriver(id)) {
                this.defaultDriverId = id;
            }

            return this;
        },

        /**
         * Add 'type/action/drivers' map into DriverHandler; it defines by type which drivers to use
         * for any action; note that this mapping is not a requirement and the fallback will use the
         * default driver
         * @param {String} type     type or namespace of your entity
         * @param {Object} mappings
         * @return {Object} DriverHandler
         */
        addActionDriverMapping: function (type, mappings) {
            var row;

            if (true === Array.isArray(mappings)) {
                for (row in mappings) {
                    if (mappings.hasOwnProperty(row)) {
                        row = mappings[row];
                        if (true === this.isValidActionDriverMapping(row)) {
                            if (false === this.mappings.hasOwnProperty(type)) {
                                this.mappings[type] = {};
                            }

                            this.mappings[type][row.action] = row;
                        }
                    }
                }
            }

            return this;
        },

        /**
         * The mapping action/drivers row is valid if:
         *     - row object has action property
         *     - row object has drivers property; drivers property is array; drivers property is not empty
         *     - row object strategy property is optionnal
         * @param  {Object}  row the mapping action/drivers row
         * @return {Boolean}     true if row has atleast action and drivers properties, else false
         */
        isValidActionDriverMapping: function (row) {
            var driver;

            if (false === row.hasOwnProperty('action') || false === row.hasOwnProperty('drivers')) {
                return false;
            }

            if (false === us.contains(this.AVAILABLE_ACTIONS, row.action)) {
                return false;
            }

            if (false === Array.isArray(row.drivers) || 0 === row.drivers.length) {
                return false;
            }

            for (driver in row.drivers) {
                if (row.drivers.hasOwnProperty(driver)) {
                    driver = row.drivers[driver];
                    if (false === this.hasDriver(driver)) {
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Perform a create request
         * @param  {String}   type     type/namespace of your entity
         * @param  {Object}   datas    contains every datas required to create your entity
         * @param  {Function} callback
         */
        create: function (type, datas, callback) {
            this.doGenericAction('create', type, {datas: datas}, callback);
        },

        /**
         * Perform a read request
         * @param  {String}   type      type/namespace of your entity
         * @param  {Object}   criterias
         * @param  {Object}   orderBy
         * @param  {Number}   start
         * @param  {Number}   limit
         * @param  {Function} callback
         */
        read: function (type, criterias, orderBy, start, limit, callback) {
            this.doGenericAction('read', type, this.formatDatas({}, criterias, orderBy, start, limit), callback);
        },

        /**
         * Perform an update request
         * @param  {String}   type      type/namespace of your entity
         * @param  {Object}   datas
         * @param  {Object}   criterias
         * @param  {Object}   orderBy
         * @param  {Number}   start
         * @param  {Number}   limit
         * @param  {Function} callback
         */
        update: function (type, datas, criterias, orderBy, start, limit, callback) {
            this.doGenericAction('update', type, this.formatDatas(datas, criterias, orderBy, start, limit), callback);
        },

        /**
         * Perform an delete request
         * @param  {String}   type      type/namespace of your entity
         * @param  {Object}   criterias
         * @param  {Object}   orderBy
         * @param  {Number}   start
         * @param  {Number}   limit
         * @param  {Function} callback
         */
        delete: function (type, criterias, orderBy, start, limit, callback) {
            this.doGenericAction('delete', type, this.formatDatas({}, criterias, orderBy, start, limit), callback);
        },

        /**
         * Perform an link request
         * @param  {String}   type      type/namespace of your entity
         * @param  {Object}   datas
         * @param  {Object}   criterias
         * @param  {Object}   orderBy
         * @param  {Number}   start
         * @param  {Number}   limit
         * @param  {Function} callback
         */
        link: function (type, datas, criterias, orderBy, start, limit, callback) {
            this.doGenericAction('link', type, this.formatDatas(datas, criterias, orderBy, start, limit), callback);
        },

        /**
         * Perform an patch request
         * @param  {String}   type      type/namespace of your entity
         * @param  {Object}   datas
         * @param  {Object}   criterias
         * @param  {Object}   orderBy
         * @param  {Number}   start
         * @param  {Number}   limit
         * @param  {Function} callback
         */
        patch: function (type, datas, criterias, orderBy, start, limit, callback) {
            this.doGenericAction('patch', type, this.formatDatas(datas, criterias, orderBy, start, limit), callback);
        },

        /**
         * Generate a well formated datas object from criterias, orderBy,start and limit parameters
         * @param  {String} type      type/namespace of your entity
         * @param  {Object} criterias
         * @param  {Object} orderBy
         * @param  {Number} start
         * @param  {Number} limit
         * @return {Object}
         */
        formatDatas: function (datas, criterias, orderBy, start, limit) {
            return {
                datas: datas,
                criterias: criterias || {},
                orderBy: orderBy || {},
                start: start || 0,
                limit: limit || null
            };
        },

        /**
         * Generic way to find action/driver mapping with type and then call handle() on every valid drivers
         * @param  {String}   action   the name of the action to execute
         * @param  {String}   type     type/namespace of your entity
         * @param  {Object}   datas
         * @param  {Function} callback
         */
        doGenericAction: function (action, type, datas, callback) {
            var drivers = this.getDriversByTypeAndAction(type, action),
                // result,
                driver;

            for (driver in drivers.list) {
                if (drivers.list.hasOwnProperty(driver)) {
                    this.drivers[drivers.list[driver]].handle(action, type, datas, callback);

                    // if (this.STOP_ON_FIRST_DRIVER_STRATEGY === drivers.strategy) {
                    //     if (false !== result) {
                    //         return;
                    //     }
                    // } else if (this.EXECUTE_ALL_DRIVER_STRATEGY === drivers.strategy) {
                    //     if (false === result) {
                    //         return;
                    //     }
                    // }
                }
            }
        },

        /**
         * Allows us to retrieve drivers and its strategy by providing type and action
         * @param  {String} type   type/namespace of your entity
         * @param  {String} action the action we are looking for its drivers
         * @return {Object}
         */
        getDriversByTypeAndAction: function (type, action) {
            var drivers = null;

            if (this.mappings.hasOwnProperty(type) && this.mappings[type].hasOwnProperty(action)) {
                drivers = {
                    list: this.mappings[type][action].drivers,
                    strategy: this.STOP_ON_FIRST_DRIVER_STRATEGY
                };

                if (this.mappings[type][action].hasOwnProperty('strategy')) {
                    drivers.strategy = this.mappings[type][action].strategy;
                }
            }

            if (null === drivers) {
                drivers = {
                    list: [this.defaultDriverId],
                    strategy: this.STOP_ON_FIRST_DRIVER_STRATEGY
                };
            }

            return drivers;
        }

    });

    return new JS.Singleton(DriverHandler);
});
