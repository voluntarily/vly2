import React from 'react'
import test from 'ava'
import { ErrorPageTest } from '../pages/_error'
import { mountWithIntl } from '../lib/react-intl-test-helper'

test('render Error', t => {
  const wrapper = mountWithIntl(<ErrorPageTest />)
  // console.log(wrapper.html())
    t.is(wrapper.find('img').first().img(),'/static/img/bug.png')
    t.is(wrapper.find('h1').first().text(), 'Oh no! Page not found')
})
