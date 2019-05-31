import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../lib/react-intl-test-helper'
import ErrorPageTest from '../pages/_error'

const router = { asPath: 'bogus' }
const errorCode = 404

test('render EN', t => {
  const wrapper = mountWithIntl(<ErrorPageTest router={router} errorCode={errorCode} />)
  t.is(wrapper.find('h1').first().text(), 'Oh no! Page not found')
})
