import test from 'ava'
import HomeBanner from '../HomeBanner'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'

const person = {
  name: 'Testy McTestface'
}

test('HomeBanner has title and subtitle', t => {
  const children = <p>Test</p>
  const wrapper = shallowWithIntl(<HomeBanner person={person} children={children} />)
  t.regex(wrapper.find('h1').first().text(), new RegExp(person.name))
  t.is(wrapper.find('p').last().text(), 'Test')
})
