import React from 'react'
import test from 'ava'
import Footer from '../Footer/Footer'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import mockRouter from '../../server/util/mockRouter'

import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
// mock function to test the render of Women's Refuge button
global.ds07o6pcmkorn = function (e) {
  this.init = () => { }
}
test.before('Setup Route', mockRouter('/about'))

const mockStore = configureStore()(
  {
    session: {
      isAuthenticated: false,
      me: { role: ['admin', 'volunteer'] }
    }
  }
)

test('renders the footer properly', t => {
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <Footer isAuthenticated={false} />
    </Provider>
  )
  t.is(wrapper.find('a').length, 14)

  t.snapshot()
})
