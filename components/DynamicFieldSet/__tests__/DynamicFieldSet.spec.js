import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { DynamicFieldSet } from '../DynamicFieldSet';

const mockForm = (items) => {
    let _state = {
        ['test']: items
    };

    return {
        getFieldValue: () => _state['test'],
        setFieldsValue: (state) => _state = state,
        getFieldDecorator: () => {}
    };
};

test('No items', t => {
    const form = mockForm([]);

    const wrapper = shallowWithIntl(
        <DynamicFieldSet form={form} field="test" />
    );

    t.is(wrapper.find('Form.Item').length, 0)
})

test('One item', t => {
    const form = mockForm(['BBQ']);

    const wrapper = shallowWithIntl(
        <DynamicFieldSet form={form} field="test" />
    );

    t.is(wrapper.find('Input[value="BBQ"]').length, 1)
})

test('Can add item', t => {
    const form = mockForm([]);

    const wrapper = shallowWithIntl(
        <DynamicFieldSet form={form} field="test" />
    );

    t.is(wrapper.find('Input').length, 0)
    
    wrapper.find('Button').first().simulate('click');
    wrapper.setProps({}); // Trigger render (note: .update() does not work)

    t.is(wrapper.find('Input').length, 1)
    t.is(wrapper.find('Input').props().value, '');
})

test('Can remove item', t => {
    const form = mockForm([]);

    const wrapper = shallowWithIntl(
        <DynamicFieldSet form={form} field="test" />
    );

    t.is(wrapper.find('Input').length, 0)
    
    // Add two items
    wrapper.find('Button').first().simulate('click',);
    wrapper.find('Button').first().simulate('click');
    wrapper.setProps({}); // Trigger render (note: .update() does not work)

    // Ensure there are two delete buttons
    t.is(wrapper.find('.dynamic-delete-button').length, 2);

    // Delete the first item
    wrapper.find('.dynamic-delete-button').first().simulate('click');
    wrapper.setProps({}); // Trigger render (note: .update() does not work)

    // Ensure there is only 1 input textbox remaining
    t.is(wrapper.find('Input').length, 1);
})

test('Values are persisted back to the form', t => {
    const form = mockForm(['']);

    const wrapper = shallowWithIntl(
        <DynamicFieldSet form={form} field="test" />
    );

    const firstInput = wrapper.find('Input');
    firstInput.instance.value = 'BBQ';
    firstInput.simulate('change', { target: firstInput.instance });

    t.is(form.getFieldValue().length, 1);
    t.is(form.getFieldValue()[0], 'BBQ');
})
