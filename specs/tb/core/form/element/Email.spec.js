define(['form.element.view.email', 'form.element.Email', 'text!src/tb/core/form/element/templates/email.twig'], function (view, TextConstructor, template) {
    'use strict';

    describe('Testing ElementEmail', function () {

        var config = {
                type: 'email',
                placeholder: 'Foo',
                label: 'My email',
                value: 'foo@bar.com',
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
