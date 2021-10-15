import React from 'react'
import test from 'ava'
import ActAdd from '../ActAdd'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Role } from '../../../server/services/authorize/role.js'

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
  mockStore.getState().session.me.role = [Role.ACTIVITY_PROVIDER]
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <ActAdd store={mockStore} />
    </Provider>
  )

  t.truthy(wrapper.find('Button').exists())
})
