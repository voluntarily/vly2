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
  t.is(wrapper.find('div').length, 16)

  t.snapshot()
})
