import React from 'react'
import test from 'ava'
import Footer from '../Footer/Footer'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import withMockRoute from '../../server/util/mockRouter'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

const mockStore = configureStore()(
  {
    session: {
      isAuthenticated: false,
      me: { role: ['admin', 'volunteer'] }
    }
  }
)

test('renders the footer properly', t => {
  const RoutedFooter = withMockRoute(Footer, '/about')

  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <RoutedFooter isAuthenticated={false} />
    </Provider>
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('div').length, 12)

  t.snapshot()
})
