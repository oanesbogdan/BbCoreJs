require.config({
    paths: {
        'cs-templates': 'src/tb/component/contentselector/templates'
    }
});

define(['require', 'jsclass', 'nunjucks', 'text!cs-templates/content.grid.view.tpl', 'text!cs-templates/content.list.view.tpl'], function (require) {

    var nunjucks = require('nunjucks'),


    ContentRenderer = new JS.Class({
        // defaultConfig : {},
        initialize: function () {
            this.renderCollection = {};
            this.templates = {
                    list : require('text!cs-templates/content.list.view.tpl'),
                    grid: require('text!cs-templates/content.grid.view.tpl')
                };
        },
        /* use cache, load item template according to render mode*/
        render: function (renderMode, item) {
            return nunjucks.renderString(this.templates[renderMode], item);
        }
    });

    return ContentRenderer;

});