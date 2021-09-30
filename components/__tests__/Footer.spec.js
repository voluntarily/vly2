import React from 'react'
import test from 'ava'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

import Footer from '../Footer/Footer'
import { mountWithIntl } from '../../test-utils/react-intl-test-helper.js'
import withMockRoute from '../../test-utils/mockRouter.js'
// mock function to test the render of Women's Refuge button
// global.ds07o6pcmkorn = function (e) {
//   this.init = () => { }
// }
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
  t.is(wrapper.find('a').length, 14)

  t.snapshot()
})
