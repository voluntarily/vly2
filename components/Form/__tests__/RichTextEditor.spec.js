import test from 'ava'
import { shallow, mount } from 'enzyme'
import RichTextEditor from '../Input/RichTextEditor'
import sinon from 'sinon'

// Demonstrate that the text editor loads without special needs
test('renders shallow', t => {
  const change = sinon.fake()
  const wrapper = shallow(
    <RichTextEditor onChange={change} />
  )
  t.truthy(wrapper.find('textarea').first())
})

test('renders deep', t => {
  const change = sinon.fake()
  const wrapper = mount(
    <RichTextEditor onChange={change} />
  )
  t.truthy(wrapper.find('textarea').first())
})
