import React from 'react'
import test from 'ava'
import Footer from '../Footer/Footer'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import withMockRoute from '../../server/util/mockRouter'

test('renders the footer properly', t => {
  const RoutedFooter = withMockRoute(Footer, '/about')

  const wrapper = mountWithIntl(
    <RoutedFooter isAuthenticated={false} />
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('span').length, 9)
  t.is(wrapper.find('.footer span').first().text(), '© 2019 · Voluntari.ly')
  t.snapshot()
})
