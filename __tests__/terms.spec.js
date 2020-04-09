import React from 'react'
import test from 'ava'
import { TermsTest } from '../pages/terms/terms'
import { shallowWithIntl } from '../lib/react-intl-test-helper'

test('render english', t => {
  const wrapper = shallowWithIntl(<TermsTest />)
  t.is(wrapper.find('title').first().text(), 'Terms of Use - Voluntarily')
})
