define(['tb.core', 'jquery'], function (bbCore, jQuery) {
    'use strict';

    bbCore.ControllerManager.registerController('MainController', {
        appName: 'layout',
        config: { imports: ['layout.test.manager', 'text!layout/tpl/home']},
        onInit: function (require) {
            /*require("layout.test.manager");*/
            this.listTpl = require("text!layout/tpl/home");
            return "onInit";
        },

        onEnabled: function () {
            console.log("layout:MainController Inside onEnabled method");
        },

        onDisabled: function () {
            console.log("layout:MainController Inside OnDisabled method");
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
