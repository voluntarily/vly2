import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import AcceptPrivacy from '../AcceptPrivacy'

test('AcceptPrivacy renders properly', t => {
  const wrapper = shallowWithIntl(
    <AcceptPrivacy>
      <p>test child</p>
    </AcceptPrivacy>)
  t.is(wrapper.find('img').first().props().src, '/static/img/sign-up/privacy.svg')
  t.is(wrapper.find('p').first().text(), 'test child')
})
