define(['form.element.Text'], function (TextConstructor) {
    'use strict';

    describe('Testing ElementText', function () {

        it('Testing', function () {
            var config = {
                    type: 'text',
                    placeholder: 'Foo',
                    value: 'Bar',
                    label: 'Jean pierre',
                    disabled: true
                },
                elementText = new TextConstructor('name', config);
        });
    });
});
