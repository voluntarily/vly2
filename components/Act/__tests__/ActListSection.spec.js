import React from 'react'
import test from 'ava'
import { ActListSection } from '../ActListSection'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import acts from '../../../server/api/activity/__tests__/activity.fixture'
import objectid from 'objectid'
// import withMockRoute from '../../../server/util/mockRouter'
import sinon from 'sinon'
import * as nextRouter from 'next/router'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import useMockRouter from '../../../server/util/useMockRouter'

test.before('Setup fixtures', (t) => {
  // not using mongo or server here so faking ids
  acts.map(p => { p._id = objectid().toString() })
  t.context.props = {
    activities: {
      sync: true,
      syncing: false,
      loading: false,
      data: acts,
      request: null
    }
  }
  const me = {
    nickname: 'Testy',
    tags: ['one', 'two', 'three'],
    topicGroups: ['business']
  }
  t.context.defaultstore = {
    session: {
      isAuthenticated: true,
      user: { nickname: me.nickname },
      me
    },
    activities: {
      sync: true,
      syncing: false,
      loading: false,
      data: acts,
      request: null
    }
  }
  t.context.mockStore = configureStore([thunk])(t.context.defaultstore)
})

test.before('Setup Route', useMockRouter('/acts', { search: 'sun' }))

test.serial('render ActListSection', async t => {
  const router = nextRouter.useRouter()
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <ActListSection />
    </Provider>
  )
  t.is(wrapper.find('ActCard').length, 5)

  // handle search
  const search = wrapper.find('Search').first()
  search.props().onSearch('moon')
  t.deepEqual(router.replace.args[0][1], { query: { search: 'moon' } })
})

test.serial('render ActListSection with selected Org', async t => {
  t.context.mockStore.clearActions()
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <ActListSection />
    </Provider>
  )

  t.is(t.context.mockStore.getActions().length, 1)
  // handle selected Org
  const menu = wrapper.find('ActMenu').first()
  await menu.invoke('onClick')({ key: 'orgOmgTech' })
  t.is(t.context.mockStore.getActions().length, 2)
})
