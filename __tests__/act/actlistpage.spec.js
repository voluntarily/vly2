import React from 'react'
import test from 'ava'
import { ActListPage } from '../../pages/acts/type/[actType]'
import { shallowWithIntl } from '../../lib/react-intl-test-helper'
import acts from '../../server/api/activity/__tests__/activity.fixture'
import objectid from 'objectid'
import sinon from 'sinon'
import mockRouter from '../../server/util/mockRouter'

test.before('Setup fixtures', (t) => {
  // not using mongo or server here so faking ids
  acts.forEach(p => { p._id = objectid().toString() })
  t.context.props = {
    activities: {
      sync: true,
      syncing: false,
      loading: false,
      data: acts,
      request: null
    }
  }
  t.context.store = {
    getState: () => {
      return ({
        session: {
          me: { _id: 'fakepersonid' }
        }
      })
    },
    dispatch: (ACTION) => {
      return Promise.resolve(t.context.props)
    }
  }
})

test.afterEach(() => {
  sinon.restore()
})

test.serial('render ActListPage for asks', async t => {
  mockRouter('/acts/type', { actType: 'ask' })(t)

  const wrapper = shallowWithIntl(<ActListPage actType='ask' />)
  t.is(wrapper.find('h1 MemoizedFormattedMessage').first().props().id, 'ActListPage.Ask.Title')
  t.true(wrapper.exists('ActListSection'))
})

test.serial('render ActListPage for offers', async t => {
  mockRouter('/acts/new', { actType: 'offer' })(t)

  const wrapper = shallowWithIntl(<ActListPage actType='offer' />)
  t.is(wrapper.find('h1 MemoizedFormattedMessage').first().props().id, 'ActListPage.Offer.Title')
  t.true(wrapper.exists('ActListSection'))
})
