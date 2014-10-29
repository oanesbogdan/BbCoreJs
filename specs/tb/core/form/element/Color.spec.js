define(['form.element.view.color', 'form.element.Color', 'text!src/tb/core/form/element/templates/color.twig'], function (view, TextConstructor, template) {
    'use strict';

    describe('Testing ElementColor', function () {

        var config = {
                type: 'color',
                label: 'My color',
                value: '0000',
                disabled: true
            },
            formTag = 'hZ1e',
            element = new TextConstructor('my_calor', config, formTag, view, template);

        it('Testing initialize', function () {

            expect(element.template.length).toBeGreaterThan(0);
            expect(element.getValue()).toEqual(config.value);
        });

        it('Testing render', function () {
            
            expect(element.render().length).toBeGreaterThan(0);
        });
    });
});
