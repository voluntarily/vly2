import React from 'react'
import test from 'ava'
import ActAdd from '../ActAdd'
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

test('render the opadd as null if not activity-provider role', t => {
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <ActAdd store={mockStore} />
    </Provider>
  )

  t.falsy(wrapper.find('button').exists())
})

test('render the opadd correctly if  activityProvider role', t => {
  mockStore.getState().session.me.role = ['activityProvider']
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <ActAdd store={mockStore} />
    </Provider>
  )

  t.truthy(wrapper.find('button').exists())
})
