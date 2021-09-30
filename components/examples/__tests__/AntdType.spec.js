import test from 'ava'
import { mount, shallow } from 'enzyme'
import AntdType from '../AntdType'

test('renders shallow', t => {
  const wrapper = shallow(
    <AntdType />
  )
  t.is(wrapper.find('Title').first().prop('children'), 'h1. Ant Design Typography example.')
  // test the action font size.
})

test('renders deep', t => {
  const wrapper = mount(
    <AntdType />
  )
  t.is(wrapper.find('Title').first().prop('children'), 'h1. Ant Design Typography example.')
  t.is(wrapper.find('Paragraph').first().prop('children'), 'This is an editable text.')

})
