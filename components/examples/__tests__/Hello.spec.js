import test from 'ava'
import { Greet, Hello } from '../Hello'
import { mount } from 'enzyme'

test('Hello renders properly', t => {
  const wrapper = mount(<Hello />)
  t.truthy(wrapper.find('p').first().hasClass('greeting'))
  t.is(wrapper.find('p').first().text(), 'Hello, ')
})

test('Hello Andrew renders properly', t => {
  const wrapper = mount(<Hello name='Andrew' />)
  t.is(wrapper.find('p').first().text(), 'Hello, Andrew')
})

test('Greet renders properly', t => {
  const wrapper = mount(<Greet />)
  t.truthy(wrapper.find('p').first().hasClass('greeting'))
  t.is(wrapper.find('p').first().text(), 'Hello, *Your name here*!')
})
