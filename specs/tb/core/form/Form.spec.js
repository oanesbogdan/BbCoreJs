define(['form.Form', 'text!src/tb/core/form/templates/form.twig', 'form.view', 'form.element.view.text', 'form.element.Text', 'text!src/tb/core/form/element/templates/text.twig'], function (Form) {
    'use strict';


    describe('Testing form', function () {

        var config = {
                template: 'text!src/tb/core/form/templates/form.twig',
                view: 'form.view',
                method: 'GET',
                action: 'foo.php',
                submit_label: 'Save'
            },
            form = new Form(config);

        it('Testing config of form', function () {

            expect(form.getMethod()).toEqual(config.method);
            expect(form.getAction()).toEqual(config.action);
            expect(form.getSubmitLabel()).toEqual(config.submit_label);
        }),

        it('Testing CRUD of element', function () {

            var element = {
                view: 'form.element.view.text',
                template: 'text!src/tb/core/form/element/templates/text.twig',
                class: 'form.element.Text',
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

        it('Testing render', function () {
            var element = {
                view: 'form.element.view.text',
                template: 'text!src/tb/core/form/element/templates/text.twig',
                class: 'form.element.Text',
                type: 'text',
                label: 'My name',
                value: ''
            };

            form.add('name', element);

            console.log(form.render());
        });
    });
});
