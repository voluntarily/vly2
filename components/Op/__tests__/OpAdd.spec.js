import React from 'react'
import test from 'ava'
import OpAdd from '../OpAdd'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'

const mockStore = configureStore()(
  {
    session: {
      me: {
        role: ['basic']
      }
    }
  }
)

test('do not render the opadd if not signed in ', t => {
  const mockStoreAnon = configureStore()(
    {
      session: {
        isAuthenticated: false,
        user: {},
        me: {}
      }
    }
  )
  const wrapper = mountWithIntl(
    <Provider store={mockStoreAnon}>
      <OpAdd />
    </Provider>
  )

  t.falsy(wrapper.find('button').exists())
})

test('Basic people dont see the offer button', t => {
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <OpAdd />
    </Provider>
  )
  t.false(wrapper.find('OpAddOfferBtn').exists())
})

test('volunteers see the offer button', t => {
  mockStore.getState().session.me.role = ['volunteer']
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <OpAdd />
    </Provider>
  )

  t.truthy(wrapper.find('OpAddOfferBtn').exists())
})
test('askers see the ask button', t => {
  mockStore.getState().session.me.role = ['opportunityProvider']
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <OpAdd />
    </Provider>
  )

  t.truthy(wrapper.find('OpAddAskBtn').exists())
})

test('some see both buttons ask button', t => {
  mockStore.getState().session.me.role = ['volunteer', 'opportunityProvider']
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <OpAdd />
    </Provider>
  )

  t.truthy(wrapper.find('OpAddAskBtn').exists())
  t.true(wrapper.find('OpAddOfferBtn').exists())
})
