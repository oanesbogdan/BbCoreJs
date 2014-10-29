define(['form.Form', 'text!src/tb/core/form/templates/form.twig', 'form.view', 'form.element.view.text', 'form.element.Text', 'text!src/tb/core/form/element/templates/text.twig'], function (Form) {
    'use strict';

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP = function () {
                    },
                    fBound = function () {
                        return fToBind.apply(this instanceof fNOP && oThis
                                ? this
                                : oThis,
                                aArgs.concat(Array.prototype.slice.call(arguments)));
                    };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

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
        });

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
            var text = {
                view: 'form.element.view.text',
                template: 'text!src/tb/core/form/element/templates/text.twig',
                class: 'form.element.Text',
                type: 'text',
                label: 'My name',
                value: ''
            }, select = {
                view: 'form.element.view.select',
                template: 'text!src/tb/core/form/element/templates/select.twig',
                class: 'form.element.Select',
                type: 'select',
                label: 'My select',
                options: {foo: 'bar', bar: 'bar'},
                selected: ['foo']
            }, checkbox = {
                view: 'form.element.view.checkbox',
                template: 'text!src/tb/core/form/element/templates/checkbox.twig',
                class: 'form.element.Checkbox',
                type: 'checkbox',
                label: 'My Checkbox',
                options: {foo: 'bar', bar: 'bar'},
                checked: ['foo']
            };

            form.add('name', text);
            form.add('list', select);
            form.add('check', checkbox);
            
            expect(form.render().length).toBeGreaterThan(0);
        });
    });
});
