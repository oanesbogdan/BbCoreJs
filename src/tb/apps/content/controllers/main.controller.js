define(
    [
        'tb.core',
        'content.dnd.manager',
        'content.mouseevent.manager',
        'content.save.manager',
        'content.view.contribution.index',
        'definition.manager',
        'content.repository',
        'revision.repository',
        'component!revisionselector'
    ],
    function (Core,
              DndManager,
              MouseEventManager,
              SaveManager,
              ContributionIndexView,
              DefinitionManager,
              ContentRepository,
              RevisionRepository,
              RevisionSelector) {

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
             * Return the content repository
             */
            getRepositoryService: function () {
                return this.repository;
            },

            /**
             * Return the definition manager
             */
            getDefinitionManagerService: function () {
                return DefinitionManager;
            },

            /**
             * Call method save into SaveManager
             */
            saveService: function () {
                SaveManager.save();
            },

            /**
             * Show the revision selector
             * @returns {undefined}
             */
            validateService: function () {
                var config = {
                        onSave: function (data, popin) {
                            popin.mask();
                            RevisionRepository.save(data, 'commit').done(function () {
                                popin.hide();
                            });
                        }
                    };

                new RevisionSelector(config).show();
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
