define(['tb.core'], function (Core) {
    'use strict';


    describe('Testing FormBuilder', function () {

        var FormBuilder = Core.component('formbuilder');

        it('Testing load method', function () {

            var config = {
                    elements: {
                        name: {
                            type: 'text',
                            label: 'My name',
                            value: ''
                        },
                        lastname: {
                            type: 'text',
                            label: 'My last name',
                            value: ''
                        }
                    }
                };

            expect(typeof FormBuilder.form).toBe('undefined');

            try {
                FormBuilder.renderForm({});
                expect(false).toBe(true);
            } catch (e) {
                expect(e).toEqual('Error n°500 MissingPropertyException: Property "elements" not found');
            }

            FormBuilder.renderForm(config);
            expect(typeof FormBuilder.form).toBe('object');
        });
    });
});
