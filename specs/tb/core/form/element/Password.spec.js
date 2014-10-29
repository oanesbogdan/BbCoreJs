define(['form.element.view.password', 'form.element.Password', 'text!src/tb/core/form/element/templates/password.twig'], function (view, TextConstructor, template) {
    'use strict';

    describe('Testing ElementPassword', function () {

        var config = {
                type: 'password',
                label: 'My password',
                value: '123456789',
                disabled: true
            },
            formTag = 'hZ1e',
            element = new TextConstructor('my_email', config, formTag, view, template);

        it('Testing initialize', function () {

            expect(element.template.length).toBeGreaterThan(0);
            expect(element.getValue()).toEqual(config.value);
        });

        it('Testing render', function () {

            expect(element.render().length).toBeGreaterThan(0);
        });
    });
});
