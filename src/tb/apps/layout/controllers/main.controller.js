define(['tb.core', 'jquery'], function (bbCore, jQuery) {
    'use strict';
    bbCore.ControllerManager.registerController('MainController', {
        appName: 'layout',
        config: {
            imports: ['layout.test.manager']
        },
        onInit: function () {
            /*require("layout.test.manager");*/
            this.rootView = jQuery(".jumbotron");
            this.tplRenderer = bbCore.TemplateRenderer.getInstance({});
        },
        onEnabled: function () {
            console.log("layout:MainController Inside onEnabled method");
        },
        onDisabled: function () {
            console.log("layout:MainController Inside OnDisabled method");
        },
        homeAction: function () {
            try {
                var responseHtml,
                    data = {
                        appName: 'Indeed',
                        templateName: 'homeTemplate',
                        radical: 'staying'
                    };
                responseHtml = this.tplRenderer.render('src/tb/apps/layout/templates/home.tpl', {
                    data: data
                }); //action append, replace
                jQuery(responseHtml).on('click', '.sred', function () {
                    alert("this is it");
                });
                jQuery(this.rootView).html(responseHtml);
            } catch (e) {
                console.log(e);
            }
        },
        listAction: function (page, section) {
            console.log(page, section);
            jQuery('.jumbotron').html(jQuery('<p> app: layout <br/> controller: MainController <br> action: listAction</p>'));
        },
        paramsAction: function () {
            console.log('inside MainController:params');
        }
    });
});