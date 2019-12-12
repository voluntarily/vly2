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
  t.context.acts = acts.map(p => { p._id = objectid().toString() })
  t.context.store = {
    getState: () => {
      return ({
        session: {
          me: { _id: 'fakepersonid' }
        }
      })
    },
    dispatch: (ACTION) => {
      // console.log('dispatch', ACTION)
      return Promise.resolve([])
    }
  }
})

test('render ActListPage', async t => {
  const props = await ActListPage.getInitialProps({ store: t.context.store })
  const RoutedActListPage = withMockRoute(ActListPage)

  const outer = shallowWithIntl(<RoutedActListPage {...props} />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  t.is(wrapper.find('h1 FormattedMessage').first().props().id, 'ActListPage.Title')
  t.truthy(wrapper.find('Button'))
  t.truthy(wrapper.find('ActListPage'))

  // handle search
  const search = wrapper.find('Search').first()
  search.props().onSearch('moon')
  t.true(router.push.calledWith({ pathname: '/acts', query: { search: 'moon' } }))

  t.false(search.props().onSearch())
})

test('render ActListPage with no acts', async t => {
  // first test GetInitialPracts
  const props = await ActListPage.getInitialProps({ store: t.context.store })
  const RoutedActListPage = withMockRoute(ActListPage)

  const outer = shallowWithIntl(<RoutedActListPage {...props} />)
  const router = outer.props().router
  router.push = sinon.spy()
  const wrapper = outer.dive()
  t.is(wrapper.find('h1 FormattedMessage').first().props().id, 'ActListPage.Title')
  t.truthy(wrapper.find('Button'))
  t.truthy(wrapper.find('ActListPage'))

  // handle search
  const search = wrapper.find('Search').first()
  search.props().onSearch('moon')
  t.true(router.push.calledWith({ pathname: '/acts', query: { search: 'moon' } }))

  t.false(search.props().onSearch())
})

test('render ActListPage with dispatch error', async t => {
  t.plan(1)
  // first test GetInitialProps
  const store = {
    dispatch: (ACTION) => {
      throw Error('Catch This!')
    }
  }
  await t.throwsAsync(async () => {
    await ActListPage.getInitialProps({ store })
  }, { message: 'Catch This!' })
})
