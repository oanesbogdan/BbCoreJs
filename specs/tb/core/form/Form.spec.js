define(['form.Form'], function (Form) {
    'use strict';

    var form = new Form();

    describe('Testing form', function () {
        it('Testing CRUD of element', function () {

            var element = {
                type: 'text',
                label: 'My name',
                value: ''
            };

            expect(form.getElements()).toEqual({});

            form.add('name', element);
            expect(form.get('name')).toEqual(element);
            expect(form.get('foo')).toBe(null);

            form.remove('name');
            expect(form.get('name')).toBe(null);
        });
    });
});
