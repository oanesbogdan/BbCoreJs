require.config({
    paths: {
        'contribution.routes': 'src/tb/apps/contribution/routes',
        'contribution.main.controller': 'src/tb/apps/contribution/controllers/main.controller',

        //Views
        'contribution.view.index': 'src/tb/apps/contribution/views/contribution.view.index',

        //Templates
        'contribution/tpl/index': 'src/tb/apps/contribution/templates/index.twig'
    }
});

define('app.contribution', ['Core'], function (Core) {
    'use strict';

    /**
     * Contribution application declaration
     */
    Core.ApplicationManager.registerApplication('contribution', {});
});
