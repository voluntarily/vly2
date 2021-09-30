import React from 'react'
import test from 'ava'
import Header from '../Header'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import mockUseRouter from '../../../server/util/mockUseRouter'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

test.before('Setup Route', mockUseRouter('/about'))

// TODO: as navigation is dynamically loaded need to work out how to test the different menus
test('renders the Header and Navigation for anon user', t => {
  const mockStore = configureStore()(
    {
      session: {
        isAuthenticated: false,
        me: { role: ['anonymous'] }
      }
    }
  )

  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <Header isAuthenticated={false} />
    </Provider>
  )

  t.truthy(wrapper.find('Link').first().containsMatchingElement(<img />))
  t.is(wrapper.find('a').length, 1)
  t.snapshot()

  // const search = wrapper.find('input').first()
  // search.simulate('change', { target: { value: 'auckland' } })
  // search.simulate('keyDown', { keyCode: 13 })
  // t.truthy(onpush.calledOnce)
})

test.skip('renders the Header and Navigation for basic auth user', t => {
  const mockStoreAuth = configureStore()(
    {
      session: {
        isAuthenticated: true,
        me: { name: 'Mr Volunteer', role: ['basic'], email: 'test123@abc.com', nickname: 'slat' }
      }
    }
  )

  const wrapper = mountWithIntl(
    <Provider store={mockStoreAuth}>
      <Header />
    </Provider>
  )
  t.truthy(wrapper.find('Link').first().containsMatchingElement(<img />))
  t.is(wrapper.find('a').length, 5)
  t.is(wrapper.find('a').last().text(), 'Sign out')
  t.snapshot()
})

test.skip('renders the Header and Navigation for auth volunteer user', t => {
  const mockStoreAuth = configureStore()(
    {
      session: {
        isAuthenticated: true,
        me: { name: 'Mr Volunteer', role: ['basic', 'volunteer'], email: 'test123@abc.com', nickname: 'slat' }
      }
    }
  )

  const wrapper = mountWithIntl(
    <Provider store={mockStoreAuth}>
      <Header />
    </Provider>
  )
  t.truthy(wrapper.find('Link').first().containsMatchingElement(<img />))
  t.is(wrapper.find('a').length, 6)
  t.is(wrapper.find('a').last().text(), 'Sign out')
  t.snapshot()
})

test.skip('renders the Header and Navigation for auth admin/support user', t => {
  const mockStoreAuth = configureStore()(
    {
      session: {
        isAuthenticated: true,
        me: { name: 'Mr Volunteer', role: ['basic', 'volunteer', 'admin'], email: 'test123@abc.com', nickname: 'slat' }
      }
    }
  )

  const wrapper = mountWithIntl(
    <Provider store={mockStoreAuth}>
      <Header />
    </Provider>
  )
  t.truthy(wrapper.find('Link').first().containsMatchingElement(<img />))
  t.is(wrapper.find('a').length, 9)
  t.is(wrapper.find('a').last().text(), 'Sign out')
  t.snapshot()
})
