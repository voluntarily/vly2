import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { Unverified } from '../Unverified'

test('render unverified component', t => {
  const user = {
    email: 'person@example.com'
  }
  const wrapper = shallowWithIntl(
    <Unverified user={user} />
  )
  t.true(wrapper.exists('Button'))
})
