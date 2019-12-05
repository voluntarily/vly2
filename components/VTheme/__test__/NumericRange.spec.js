import test from 'ava'
import NumericRange from '../NumericRange'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

test('NumericRange values are used from props', t => {
  const wrapper = mountWithIntl(
    <NumericRange value={{ from: 3, to: 5 }} />
  )

  t.is(wrapper.find('input').length, 2)
  t.is(wrapper.find('input').at(0).props().value, '3')
  t.is(wrapper.find('input').at(1).props().value, '5')
})

test('NumericRange handles from and to being missing', t => {
  const wrapper = mountWithIntl(
    <NumericRange value={{ }} />
  )

  t.is(wrapper.find('input').length, 2)
  t.is(wrapper.find('input').at(0).props().value, '')
  t.is(wrapper.find('input').at(1).props().value, '')
})

test('NumericRange handles no value from props', t => {
  const wrapper = mountWithIntl(
    <NumericRange />
  )

  t.is(wrapper.find('input').length, 2)
  t.is(wrapper.find('input').at(0).props().value, '')
  t.is(wrapper.find('input').at(1).props().value, '')
})

test('NumericRange onChange called when input value changes due to user event', t => {
  // Hold the onChange triggered new value object
  let value = { from: 1, to: 2 }
  const valuesChangedCallback = (changeValue) => {
    value = changeValue
  }

  const wrapper = mountWithIntl(
    <NumericRange value={value} onChange={valuesChangedCallback} />
  )

  // Assert the input values are our initial from and to values
  t.is(wrapper.find('input').length, 2)
  t.is(wrapper.find('input').at(0).props().value, '1')
  t.is(wrapper.find('input').at(1).props().value, '2')

  // Simulate a input change. This will call our valuesChangedCallback
  const from = wrapper.find('input').at(0)
  from.simulate('change', { target: { value: '99' } })
  // Apply the updated props and re-render the component
  wrapper.setProps({ value })

  // Simulate a input change. This will call our valuesChangedCallback
  const to = wrapper.find('input').at(1)
  to.simulate('change', { target: { value: '100' } })
  // Apply the updated props and re-render the component
  wrapper.setProps({ value })

  // Assert both our updated values have been sent to our callback
  t.is(value.from, 99)
  t.is(value.to, 100)
})
