define(
    [
        'tb.component/formbuilder/form/element/views/form.element.view.checkbox',
        'tb.component/formbuilder/form/ElementBuilder!Checkbox',
        'text!tb.component/formbuilder/form/element/templates/checkbox.twig'
    ],
    function (view, TextConstructor, template) {

        'use strict';

        describe('Testing ElementCheckbox', function () {

            var config = {
                    type: 'checkbox',
                    placeholder: 'Foo',
                    options: {foo: 'FOO', bar: 'BAR', foobar: 'FOOBAR'},
                    checked: ['foo', 'bar'],
                    inline: true,
                    label: 'My select'
                },
                formTag = 'hZ1e',
                elementText = new TextConstructor('list', config, formTag, view, template);

            it('Testing initialize', function () {

                expect(elementText.getOptions()).toEqual(config.options);
                expect(elementText.getValue()).toEqual(config.checked);
                expect(elementText.isInline()).toEqual(config.inline);
                expect(elementText.template.length).toBeGreaterThan(0);
            });

            it('Testing render', function () {

                expect(elementText.render().length).toBeGreaterThan(0);
            });
        });
    }
);
