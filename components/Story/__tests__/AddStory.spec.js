import React from 'react'
import test from 'ava'
import AddStory from '../AddStory'
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

test('render the button as null if not orgadmin/ admin role', t => {
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <AddStory store={mockStore} />
    </Provider>
  )

  t.falsy(wrapper.find('button').exists())
})

test('render the button correctly if admin role', t => {
  mockStore.getState().session.me.role = [Role.ADMIN]
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <AddStory store={mockStore} />
    </Provider>
  )

  t.truthy(wrapper.find('button').exists())
})

test('render the button correctly if orgadmin role', t => {
  mockStore.getState().session.me.role = [Role.ORG_ADMIN]
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <AddStory store={mockStore} />
    </Provider>
  )

  t.truthy(wrapper.find('button').exists())
})
