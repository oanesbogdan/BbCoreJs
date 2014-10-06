define(['tb.core'], function (bbCore) {
    'use strict';

    bbCore.ControllerManager.registerController('TestController', {
        appName: 'layout',

        config: {
            imports: ['test.manager', 'rte.manager']
        },

        /*Appelle init après les dépendences*/
        onInit: function (require) {
            console.log(require);
        },

        homeAction: function () {
            console.log('... homeAction ...');
            return this.render('#placeHolder', '/path/template', {});
        },

        listAction: function () {
            console.log('... listAction ...');
        },

        displayLayoutAction: function () {
            var layouts = {}, /* new Layout() */
                self = this;

            this.loadTemplate('/path/template').done(function (tpl) {
                self.render(tpl, {
                    layout: layouts
                });
            });
        }
    });

});
