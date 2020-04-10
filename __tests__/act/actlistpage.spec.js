import React from 'react'
import test from 'ava'
import { ActListPage } from '../../pages/act/actlistpage'
import { shallowWithIntl } from '../../lib/react-intl-test-helper'
import acts from '../../server/api/activity/__tests__/activity.fixture'
import objectid from 'objectid'
import withMockRoute from '../../server/util/mockRouter'
import * as nextRouter from 'next/router'
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

test.afterEach(() => {
  sinon.restore()
})

test.serial('render ActListPage for asks', async t => {
  mockUseRouter('ask')
  const RoutedActListPage = withMockRoute(ActListPage, 'a/ask', { type: 'ask' })

  const outer = shallowWithIntl(<RoutedActListPage />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  t.is(wrapper.find('h1 FormattedMessage').first().props().id, 'ActListPage.Ask.Title')
  t.true(wrapper.exists('ActListSection'))
})

test.serial('render ActListPage for offers', async t => {
  mockUseRouter('offer')
  const RoutedActListPage = withMockRoute(ActListPage, 'a/offer', { type: 'offer' })

  const outer = shallowWithIntl(<RoutedActListPage />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  t.is(wrapper.find('h1 FormattedMessage').first().props().id, 'ActListPage.Offer.Title')
  t.true(wrapper.exists('ActListSection'))
})

const mockUseRouter = (type) => {
  const router = () => {
    return ({
      pathname: `/a/${type}`,
      route: `/${type}`,
      query: { type },
      asPath: `/a/${type}`,
      initialProps: {},
      pageLoader: sinon.fake(),
      App: sinon.fake(),
      Component: sinon.fake(),
      replace: sinon.fake(),
      push: sinon.fake(),
      back: sinon.fake()
    })
  }
  sinon.replace(nextRouter, 'useRouter', router)
}
