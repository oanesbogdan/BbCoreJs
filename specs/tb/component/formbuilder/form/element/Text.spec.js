define(
    [
        'tb.component/formbuilder/form/element/views/form.element.view.text',
        'tb.component/formbuilder/form/element/Text',
        'text!tb.component/formbuilder/form/element/templates/text.twig'
    ],
    function (view, TextConstructor, template) {

        'use strict';

        describe('Testing ElementText', function () {

            var config = {
                    type: 'text',
                    placeholder: 'Foo',
                    value: 'Bar',
                    label: 'Jean pierre',
                    disabled: true
                },
                formTag = 'hZ1e',
                elementText = new TextConstructor('name', config, formTag, view, template);

            it('Testing initialize', function () {

                expect(elementText.template.length).toBeGreaterThan(0);
                expect(elementText.getValue()).toEqual(config.value);
            });

            it('Testing render', function () {

                expect(elementText.render().length).toBeGreaterThan(0);
            });
        });
    }
);
