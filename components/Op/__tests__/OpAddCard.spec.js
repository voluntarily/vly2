import test from 'ava'
import { mount } from 'enzyme'
import OpAddCard from '../OpAddCard'

test('OpAddCard renders properly', t => {
  const wrapper = mount(
    <OpAddCard />
  )

  t.is(wrapper.find('a').first().props().href, '/ops/new/ask')
  t.is(wrapper.find('h1').first().text(), 'Create Activity')
  t.is(wrapper.find('p').first().text(), 'This will create an opportunity that volunteers can sign up for 🥳')
})
