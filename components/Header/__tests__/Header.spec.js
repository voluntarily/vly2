import React from 'react'
import test from 'ava'
import Header from '../Header'
import { mountWithIntl, mountWithMockIntl } from '../../../lib/react-intl-test-helper'
import mockRouter from '../../../server/util/mockRouter'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

test.before('Setup Route', mockRouter('/about'))

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

  t.is(wrapper.find('a').length, 4)
  t.is(wrapper.find('a').at(1).text(), 'About')

  t.snapshot()
})

test('renders the Header and Navigation for basic auth user', t => {
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
  t.is(wrapper.find('a').length, 5)
  t.is(wrapper.find('a').at(1).text(), 'Home')

  t.is(wrapper.find('a').last().text(), 'Sign out')
  t.snapshot()
})

test('renders the Header and Navigation for auth volunteer user', t => {
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
  t.is(wrapper.find('a').length, 6)
  t.is(wrapper.find('a').last().text(), 'Sign out')
  t.snapshot()
})

test('renders the Header and Navigation for auth admin/support user', t => {
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
  t.is(wrapper.find('a').length, 9)
  t.is(wrapper.find('a').last().text(), 'Sign out')
  t.snapshot()
})

test('notice shows if included in messages', t => {
  const mockStoreAuth = configureStore()(
    {
      session: {
        isAuthenticated: true,
        me: { name: 'Mr Volunteer', role: ['basic', 'volunteer', 'admin'], email: 'test123@abc.com', nickname: 'slat' }
      }
    }
  )
  const expectedNotice = 'This is a notice'

  const wrapper = mountWithMockIntl(
    <Provider store={mockStoreAuth}>
      <Header />
    </Provider>
    ,
    {
      notice: expectedNotice
    })
  t.is(wrapper.find('a').length, 9)
  t.is(wrapper.find('a').last().text(), 'Sign out')
  t.snapshot()
  t.true(wrapper.exists('Header__Notice'))
})

test('notice for support workers', t => {
  const mockStoreAuth = configureStore()(
    {
      session: {
        isAuthenticated: true,
        me: { name: 'Mr Volunteer', role: ['basic', 'volunteer', 'support'], email: 'test123@abc.com', nickname: 'slat' }
      }
    }
  )
  const expectedNotice = 'This is a notice'

  const wrapper = mountWithMockIntl(
    <Provider store={mockStoreAuth}>
      <Header />
    </Provider>
    ,
    {
      notice: expectedNotice
    })
  t.is(wrapper.find('a').length, 9)
  t.is(wrapper.find('a').last().text(), 'Sign out')
  t.snapshot()
})

test('no notice for anon', t => {
  const mockStoreAuth = configureStore()(
    {
      session: {
        isAuthenticated: false,
        me: { role: ['anonymous'] }
      }
    }
  )
  const expectedNotice = 'This is a notice'

  const wrapper = mountWithMockIntl(
    <Provider store={mockStoreAuth}>
      <Header />
    </Provider>
    ,
    {
      notice: expectedNotice
    })
  t.is(wrapper.find('a').length, 4)
  t.is(wrapper.find('a').last().text(), 'Sign in')
  t.snapshot()
})
