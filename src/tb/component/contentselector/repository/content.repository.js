define(['BackBone'], function () {

    var ContentCollection = Backbone.Collection.extend({});

    /* Repository */
    var ContentRepository = new JS.Class({

        defaultConfig: {},
        initialize: function () {
            this.contentCollections = [];
        },

        findWhere: function () {
        }
    });
});