define(['tb.core', 'jquery'], function (bbCore, jQuery) {
    'use strict';

    bbCore.ControllerManager.registerController('MainController', {
        appName: 'layout',
        config: { imports: ['layout.test.managers']},
        onInit: function () {
            /*require("layout.test.manager");*/
            return "onInit";
        },

        homeAction: function () {
            jQuery('.jumbotron').html(jQuery('<p> app: layout <br/> controller: MainController <br> action: homeAction</p>'));
        },

        listAction: function () {
            console.log('arguments', arguments);
            jQuery('.jumbotron').html(jQuery('<p> app: layout <br/> controller: MainController <br> action: listAction</p>'));
        },

        paramsAction: function () {
            console.log('inside MainController:params');
        }
    });
});
