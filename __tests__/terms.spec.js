import React from 'react'
import test from 'ava'
import { TermsTest } from '../pages/terms/terms'
import { mountWithIntl } from '../lib/react-intl-test-helper'

test('render english', t => {
  const wrapper = mountWithIntl(<TermsTest />)
  t.is(wrapper.find('h1').first().text(), 'Voluntarily Terms of Use')
})
