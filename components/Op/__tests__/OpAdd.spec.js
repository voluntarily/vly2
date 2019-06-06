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
        role: ['volunteer']
      }
    }
  }
)

test('render the opadd as null if not opportunityProvider role', t => {
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <OpAdd store={mockStore} />
    </Provider>
  )

  t.falsy(wrapper.find('button').exists())
})

test('render the opadd correctly if opportunityProvider role', t => {
  mockStore.getState().session.me.role = ['opportunityProvider']
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <OpAdd store={mockStore} />
    </Provider>
  )

  t.truthy(wrapper.find('button').exists())
})
