import React from 'react'
import test from 'ava'
import { termsTest } from '../pages/terms'
import { mountWithIntl } from '../lib/react-intl-test-helper'

test('render english', t => {
  const wrapper = mountWithIntl(<termsTest />)
  t.is(wrapper.find('h1').first().text(), 'Welcome to Voluntarily.')
})
 