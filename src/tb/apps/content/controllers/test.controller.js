/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['jquery', 'tb.core'], function (jQuery, bbCore) {

    'use strict';

    bbCore.ControllerManager.registerController('TestController', {
        appName: 'content',
        imports: ['test.manager'],

        onInit: function () {
            console.log('content onInit');
        },

        homeAction: function () {
            console.log(' contentApp homeAction');
        },

        listAction: function () {
            return;
        },

        paramsAction: function () {
            jQuery('.jumbotron').html(jQuery('<p>app:[content]MainController:' + 'paramAction</p>'));
        }
    });
});
