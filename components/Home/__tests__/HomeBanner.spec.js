import test from 'ava'
import HomeBanner from '../HomeBanner'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'

const person = {
  name: 'Testy McTestface'
}

test('HomeBanner has title and subtitle', t => {
  const children = <p>Test</p>
  const wrapper = shallowWithIntl(<HomeBanner person={person} children={children} />)
  t.is(wrapper.find('FormattedMessage').first().props().defaultMessage, 'Home')
  t.is(wrapper.find('p').first().text(), 'Test')
})
