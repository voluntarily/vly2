import React from 'react'
import test from 'ava'
import Header from '../../components/Header/Header'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import withMockRoute from '../../server/util/mockRouter'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

test('renders the Header and Navigation for anon user', t => {
  const RoutedHeader = withMockRoute(Header, '/about')
  const mockStore = configureStore()(
    {
      session: {
        isAuthenticated: false
      }
    }
  )

  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <RoutedHeader isAuthenticated={false} />
    </Provider>
  )

  t.truthy(wrapper.find('Link').first().containsMatchingElement(<img />))
  t.is(wrapper.find('a').length, 4)
  t.is(wrapper.find('a').last().text(), 'Sign in')
  t.snapshot()

  // const search = wrapper.find('input').first()
  // search.simulate('change', { target: { value: 'auckland' } })
  // search.simulate('keyDown', { keyCode: 13 })
  // t.truthy(onpush.calledOnce)
})

test('renders the Header and Navigation for authenticated user', t => {
  const RoutedHeader = withMockRoute(Header, '/about')

  const mockStoreAuth = configureStore()(
    {
      session: {
        isAuthenticated: true,
        me: { name: 'Mr Admin', role: ['Admin'], email: 'test123@abc.com', nickname: 'slat' }
      }
    }
  )

  const wrapper = mountWithIntl(
    <Provider store={mockStoreAuth}>
      <RoutedHeader />
    </Provider>
  )

  t.truthy(wrapper.find('Link').first().containsMatchingElement(<img />))
  t.is(wrapper.find('a').length, 5)
  t.is(wrapper.find('a').last().text(), 'Sign out')
  t.snapshot()
})
