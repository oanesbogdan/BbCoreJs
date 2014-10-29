define(['form.element.view.select', 'form.element.Select', 'text!src/tb/core/form/element/templates/select.twig'], function (view, TextConstructor, template) {
    'use strict';

    describe('Testing ElementSelect', function () {

        var config = {
                type: 'select',
                placeholder: 'Foo',
                options: {foo: 'FOO', bar: 'BAR', foobar: 'FOOBAR'},
                selected: ['foo', 'bar'],
                multiple: true,
                label: 'My select'
            },
            formTag = 'hZ1e',
            elementText = new TextConstructor('list', config, formTag, view, template);

        it('Testing initialize', function () {

            expect(elementText.getOptions()).toEqual(config.options);
            expect(elementText.getValue()).toEqual(config.selected);
            expect(elementText.isMultiple()).toEqual(config.multiple);
            expect(elementText.template.length).toBeGreaterThan(0);
        });

        it('Testing render', function () {

            expect(elementText.render().length).toBeGreaterThan(0);
        });
    });
});
