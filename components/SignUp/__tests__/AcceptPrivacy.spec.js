import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import AcceptPrivacy from '../AcceptPrivacy'

test('AcceptPrivacy renders properly', t => {
  const wrapper = shallowWithIntl(
    <AcceptPrivacy>
      <p>test child</p>
    </AcceptPrivacy>)
  t.is(wrapper.find('p').first().text(), 'test child')
})
