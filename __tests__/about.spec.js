import React from 'react'
import test from 'ava'
import { AboutTest } from '../pages/about/about'
import { mountWithIntl } from '../lib/react-intl-test-helper'

test('render MI', t => {
  const wrapper = mountWithIntl(<AboutTest />)
  // console.log(wrapper.html())
  t.is(wrapper.find('h1').first().text(), 'Hello! You have stumbled upon an awesome open-source project.')
})
