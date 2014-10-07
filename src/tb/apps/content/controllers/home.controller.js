/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['tb.core', 'jquery'], function (bbCore, jQuery) {
    'use strict';

    bbCore.ControllerManager.registerController('MainController', {
        appName: 'content',
        config: { imports: ['content.test.manager']},

        /**
         * occurs on init of content home controller
         */
        onInit: function () {
            console.log('content onInit');
        },

        /**
         * Returns home route result
         */
        homeAction: function () {
            console.log('contentApp homeAction');
        },

        /**
         * Returns list route result
         */
        listAction: function () {
            return;
        },

        /**
         * Returns params route result
         */
        paramsAction: function () {
            jQuery('.jumbotron').html(jQuery('<p>app: content<br>controller:MainController<br>action: paramAction</p>'));
        }

    });

});


