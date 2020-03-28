import React from 'react'
import test from 'ava'
import { ActListPage } from '../../pages/act/actlistpage'
import { shallowWithIntl } from '../../lib/react-intl-test-helper'
import acts from '../../server/api/activity/__tests__/activity.fixture'
import objectid from 'objectid'
import withMockRoute from '../../server/util/mockRouter'
import sinon from 'sinon'

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

test('render ActListPage', async t => {
  // const props = await ActListPage.getInitialProps({ store: t.context.store })
  const RoutedActListPage = withMockRoute(ActListPage)

  const outer = shallowWithIntl(<RoutedActListPage />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  t.is(wrapper.find('h1 FormattedMessage').first().props().id, 'ActListPage.Title')
  t.true(wrapper.exists('ActListSection'))
})
