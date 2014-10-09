define(['tb.core', 'jquery'], function (bbCore, jQuery) {
    'use strict';

    bbCore.ControllerManager.registerController('MainController', {
        appName: 'main',
        imports: [],

        onInit: function () {
            console.log('on init is called');
        },

        indexAction: function () {
            jQuery('.jumbotron').html(jQuery('<p> app: layout <br/> controller: MainController <br> action: homeAction</p>'));
        }
    });
});
