define(
    [
        'tb.core',
        'content.dnd.manager',
        'content.mouseevent.manager',
        'content.save.manager',
        'content.view.contribution.index',
        'definition.manager',
        'content.repository'
    ],
    function (Core,
              DndManager,
              MouseEventManager,
              SaveManager,
              ContributionIndexView,
              DefinitionManager,
              ContentRepository) {

        'use strict';

        Core.ControllerManager.registerController('MainController', {

            appName: 'content',

            config: {
                imports: ['content.repository']
            },

            /**
             * Initialize of Bundle Controller
             */
            onInit: function () {
                this.repository = require('content.repository');
            },

            /**
             * Call method save into SaveManager
             */
            saveService: function () {
                SaveManager.save();
            },

            contributionIndexAction: function () {

                var self = this;

                if (this.contribution_loaded !== true) {
                    ContentRepository.findCategories().done(function (categories) {
                        var view = new ContributionIndexView({'categories': categories});
                        view.render();
                        self.contribution_loaded = true;
                    });
                }
            },

            findDefinitionsService: function (page_uid) {
                return this.repository.findDefinitions(page_uid);
            },

            listenDOMService: function (definitions) {
                DefinitionManager.setDefinitions(definitions);

                DndManager.listen();
                MouseEventManager.listen();
            }
        });
    }
);
