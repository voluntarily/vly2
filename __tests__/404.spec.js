import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../lib/react-intl-test-helper'
import ErrorPageTest from '../pages/_error'

const router = { asPath: 'bogus' }
const E404 = 404
const E500 = 500
const E200 = 200

test('render 404', t => {
  const wrapper = mountWithIntl(<ErrorPageTest router={router} url='/404' errorCode={E404} />)
  t.is(wrapper.find('h1').first().text(), 'Oh no! Page not found')
})

test('render 200', t => {
  const wrapper = mountWithIntl(<ErrorPageTest router={router} url='/_error' errorCode={E200} />)
  t.is(wrapper.find('h1').first().text(), 'Oh no! Page not found')
})

test('render 500', t => {
  const wrapper = mountWithIntl(<ErrorPageTest router={router} url='/404' errorCode={E500} />)
  t.regex(wrapper.find('h1').first().text(), /Sorry, there was a problem/)
})
