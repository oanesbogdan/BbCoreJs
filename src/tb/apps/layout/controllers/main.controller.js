define(['tb.core', 'jquery', "handlebars"], function (bbCore, jQuery) {
    'use strict';

    bbCore.ControllerManager.registerController('MainController', {
        appName: 'layout',
        config: { imports: ['layout.test.manager', 'text!layout/tpl/home']},
        onInit: function (require) {
            /*require("layout.test.manager");*/
            this.homeTpl = require("text!layout/tpl/home");
            this.rootView = jQuery(".jumbotron");
            return "onInit";
        },

        onEnabled: function () {
            console.log("layout:MainController Inside onEnabled method");
        },

        onDisabled: function () {
            console.log("layout:MainController Inside OnDisabled method");
        },

        homeAction: function () {
            var contentTpl,
                data,
                html;
            /*global Handlebars */
            Handlebars.registerHelper("radical", function () {
                return new Handlebars.SafeString("<p>radical blaze</p>");
            });

            contentTpl = Handlebars.compile(this.homeTpl);
            data = { appName: "Layout", templateName: "home"};
            html = contentTpl(data);
            this.rootView.html(html);
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
