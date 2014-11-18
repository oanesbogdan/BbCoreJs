define([
    'tb.core.Api', 
    'jquery', 
    'page.repository', 
    'page.form',
    'tb.core.ViewManager',
    'text!page/tpl/manage_list',
    'jquery-layout'
], function (Api, jQuery, PageRepository, PageForm, ViewManager, template, Layout) {

    'use strict';

    /**
     * View of new page
     * @type {Object} Backbone.View
     */
    var PageViewReview = Backbone.View.extend({

        /**
         * Initialize of PageViewReview
         */
        initialize: function (parent_uid) {
            this.popin = Api.component('popin').createPopIn();
            //this.formBuilder = Api.component('formbuilder');
            this.parent_uid = parent_uid;
        },

        computeLayouts: function (layouts) {
            var key,
                layout,
                data = {'': ''};

            for (key in layouts) {
                if (layouts.hasOwnProperty(key)) {
                    layout = layouts[key];
                    data[layout.uid] = layout.label;
                }
            }

            return data;
        },

        onSubmit: function (data) {
            var self = this;

            if (typeof this.parent_uid === 'string') {
                data.parent_uid = this.parent_uid;
            }

            PageRepository.save(data, function () {
                self.popin.hide();
            });
        },

        onValidate: function (form, data) {
            if (!data.hasOwnProperty('layout_uid') || data.layout_uid.trim().length === 0) {
                form.addError('layout_uid', 'Template is required.');
            }
        },

        /**
         * Render the template into the DOM with the ViewManager
         * @returns {Object} PageViewReview
         */
        render: function () {
            var self = this;

            self.popin.setTitle('Review pages');
            self.popin.setContent('');
            self.popin.setOptions({
                "height" : 700 > $(window).height()-(20*2) ? $(window).height()-(20*2) : 700 ,
		"width" : 1244 > $(window).width()-(20*2) ? $(window).width()-(20*2) : 1244,
            });
            self.popin.display();
            self.popin.mask();
            
            
            
            PageRepository.search({state: 1}, 0, 50, function(pages){
                var content = ViewManager.render(template, {'pages': pages});
                self.popin.setContent(content);
                
                jQuery('#content-library-pane-wrapper').layout({
                    applyDefaultStyles: true, 
                    closable:false
                });
                
                self.popin.unmask();
            });
            
            return this;
        }
    });

    return PageViewReview;
});