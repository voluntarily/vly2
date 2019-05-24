import test from 'ava'
import Hello from '../Hello'
import { mount } from 'enzyme'

test('renders properly', t => {
  const wrapper = mount(<Hello />)
  t.truthy(wrapper.find('p').first().hasClass('greeting'))
  t.is(wrapper.find('p').first().text(), 'Hello, *Your name here*!')
})
