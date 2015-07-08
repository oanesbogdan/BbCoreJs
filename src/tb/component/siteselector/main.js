define(
    'tb.component/siteselector/main',
    [
        'underscore',
        'Core/Renderer',
        'Core/DriverHandler',
        'Core/RestDriver',
        'text!tb.component/siteselector/selector.twig',
        'BackBone',
        'jquery',
        'Core'
    ],
    function (underscore, Renderer, CoreDriverHandler, CoreRestDriver, tpl, Backbone, jQuery) {
        'use strict';

        var sites = [],
            trans = require('Core').get('trans') || function (value) { return value; },
            bindChangeEvent = function (render, api) {
                render = jQuery(render);
                render.on("change", "select", function () {
                    api.trigger("siteChange", this.value);
                });
                return render;
            },

            loadSites = function () {
                var dfd = jQuery.Deferred();

                if (sites.length === 0) {
                    CoreDriverHandler.addDriver('rest', CoreRestDriver);
                    CoreDriverHandler.read('site').then(
                        function (sitesAvailable) {
                            sites = underscore.toArray(sitesAvailable);
                            dfd.resolve(sites);
                        },
                        function (reason) {
                            dfd.reject(reason);
                        }
                    );
                } else {
                    dfd.resolve(sites);
                }
                return dfd.promise();
            },

            exposeApi = function (config) {
                var api = {

                    identifier: 'site-selector',

                    widget: jQuery("<div><select><option>" + trans("loading_sites") + "</option></select></div>").clone(),

                    config: jQuery.extend(true, {}, config),

                    sites: [],

                    render: function (identifier) {

                        var self = this;
                        this.identifier = identifier || this.identifier;

                        jQuery(this.widget).attr("id", this.identifier).attr("disabled");

                        loadSites().then(function (sites) {
                            var selected = self.config.selected || false,
                                render = Renderer.render(tpl, { sites: sites, selected: selected });
                            jQuery(self.widget).html(render);
                            bindChangeEvent(self.widget, self);
                            self.trigger("ready");
                        });

                        return this.widget;
                    },

                    getSelectedSite: function () {
                        return jQuery(this.widget).find("select").eq(0).val();
                    },

                    getJqueryElement: function () {
                        return jQuery(this.widget);
                    }
                };

                api.sites = sites;
                jQuery.extend(api, {}, Backbone.Events);
                return api;
            };

        return {
            createSiteSelector: function (config) {
                config = config || {};
                return Object.create(exposeApi(config));
            }
        };
    }
);