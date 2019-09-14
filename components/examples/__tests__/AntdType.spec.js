import test from 'ava'
import { mount, shallow } from 'enzyme'
import AntdType from '../AntdType'

test('renders shallow', t => {
  const wrapper = shallow(
    <AntdType />
  )
  t.is(wrapper.find('Title').first().prop('children'), 'h1. Ant Design')
  // test the action font size.
})

test('renders deep', t => {
  const wrapper = mount(
    <AntdType />
  )
  t.is(wrapper.find('Title').first().prop('children'), 'h1. Ant Design')
  t.is(wrapper.find('Paragraph').first().prop('children'), 'This is an editable text.')
  t.is(wrapper.find('p').first().prop('children'), 'This is an editable text.')
  // const input = wrapper.find('Paragraph').first()

  // this doesn't work as we have to click the text field icon to convert it to an input first.

  // input.simulate('change', input);
  // input.simulate('change', { target: { value: 'Hello' } });
  // t.is(wrapper.find('p').first().prop('children'), 'Hello.');
})
