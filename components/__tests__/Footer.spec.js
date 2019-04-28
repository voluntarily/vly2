import React from 'react'
import test from 'ava'
import Footer from '../Footer/Footer'
import { render } from 'enzyme'
import { mountWithIntl } from '../../lib/react-intl-test-helper'

test('renders the footer properly', t => {
  const wrapper = mountWithIntl(
    <Footer />
  )
  t.is(wrapper.find('span').length, 8)
  t.is(wrapper.find('.footer span').first().text(), '© 2019 · Voluntari.ly')
})

test('renders snapshot', t => {
  const wrapper = render(<Footer />)
  t.is(wrapper.find('span').length, 8)
  t.snapshot()
})
