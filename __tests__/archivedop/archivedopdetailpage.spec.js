import test from 'ava'
import archivedOpportunities from '../../server/api/archivedOpportunity/__tests__/archivedOpportunity.fixture'
import people from '../../server/api/person/__tests__/person.fixture'
import tags from '../../server/api/tag/__tests__/tag.fixture.js'
import objectid from 'objectid'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ArchivedOpDetailPageWithArchivedOps, ArchivedOpDetailPage } from '../../pages/archivedop/archivedopdetailpage'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import { Provider } from 'react-redux'
import withMockRoute from '../../server/util/mockRouter'
import reduxApi from '../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../lib/callApi'
import fetchMock from 'fetch-mock'
import sinon from 'sinon'
import * as nextRouter from 'next/router'

test.before('Setup fixtures', (t) => {
  // This gives all the people fake ids to better represent a fake mongo db
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]

  // Set myself as the requestor for all of the opportunities, and fake ids
  archivedOpportunities.map((op, index) => {
    op._id = objectid().toString()
    op.requestor = me
    op.tags = [tags[index], tags[index + 1]]
  })

  t.context = {
    me,
    people,
    archivedOpportunities,
    op: archivedOpportunities[1],
    tags
  }

  t.context.mockStore = configureStore([thunk])(
    {
      session: {
        isAuthenticated: true,
        user: { nickname: me.nickname },
        me
      },
      archivedOpportunities: {
        sync: true,
        syncing: false,
        loading: false,
        data: [archivedOpportunities[1]],
        request: null
      },
      interestArchives: {
        sync: true,
        loading: false,
        data: []
      }
    }
  )
})

test.before('Setup Route', (t) => {
  const router = () => {
    return ({
      pathname: '/test',
      route: '/test',
      query: { id: 12345 },
      asPath: '/test/12345',
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
})

test.serial('archivedOpDetailPage should have banner and tabs panels', t => {
  const props = {
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }

  const RoutedArchivedOpDetailPage = withMockRoute(ArchivedOpDetailPageWithArchivedOps)
  const myMock = fetchMock.sandbox()
  myMock.get(API_URL + '/archivedOpportunities/' + archivedOpportunities[1]._id, { body: { status: 200 } })
  myMock.get(API_URL + '/interestArchives/?op=' + archivedOpportunities[1]._id, { body: { status: 200 } })

  reduxApi.use('fetch', adapterFetch(myMock))
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore} query={{ _id: archivedOpportunities[1]._id }}>
      <RoutedArchivedOpDetailPage {...props} />
    </Provider>
  )
  t.true(wrapper.exists('OpBanner'))
  t.true(wrapper.exists('OpTabs'))
  t.is(wrapper.find('TabPane').length, 3)
  t.true(wrapper.exists('OpAboutPanel'))

  wrapper.find('.ant-tabs-tab').at(2).simulate('click')
  wrapper.update()
  t.true(wrapper.exists('OpManagePanel'))
})

test.serial('ArchivedOpDetailPage GetInitialProps non member', async t => {
  // first test GetInitialProps
  const ctx = {
    store: t.context.mockStore,
    query: {
      id: t.context.op._id
    }
  }
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock
    .get(`path:/api/archivedOpportunities/${t.context.op._id}`, { body: { status: 200 } })
    .get('path:/api/members/', { body: t.context.members })
  const props = await ArchivedOpDetailPage.getInitialProps(ctx)
  t.is(props, undefined)
})

test('archivedOpDetailPage should display OpUnknown when no opportunity can be retrieved', t => {
  const myStore = { ...t.context.mockStore }
  myStore.getState().archivedOpportunities.data = []

  const props = {
    me: t.context.me,
    dispatch: myStore.dispatch
  }

  const RoutedArchivedOpDetailPage = withMockRoute(ArchivedOpDetailPageWithArchivedOps)
  const myMock = fetchMock.sandbox()
  myMock.get(API_URL + '/archivedOpportunities/' + archivedOpportunities[1]._id, { body: { status: 200 } })

  reduxApi.use('fetch', adapterFetch(myMock))
  const wrapper = mountWithIntl(
    <Provider store={myStore} query={{ _id: archivedOpportunities[1]._id }}>
      <RoutedArchivedOpDetailPage {...props} />
    </Provider>
  )
  t.is(wrapper.find('OpUnknown').length, 1)
})

test('archivedOpDetailPage should display Loading spinner when loading', t => {
  const myStore = { ...t.context.mockStore }
  myStore.getState().archivedOpportunities.loading = true
  myStore.getState().archivedOpportunities.sync = false

  const props = {
    me: t.context.me,
    dispatch: myStore.dispatch
  }

  const RoutedArchivedOpDetailPage = withMockRoute(ArchivedOpDetailPageWithArchivedOps)
  const myMock = fetchMock.sandbox()
  myMock.get(API_URL + '/archivedOpportunities/' + archivedOpportunities[1]._id, { body: { status: 200 } })

  reduxApi.use('fetch', adapterFetch(myMock))
  const wrapper = mountWithIntl(
    <Provider store={myStore} query={{ _id: archivedOpportunities[1]._id }}>
      <RoutedArchivedOpDetailPage {...props} />
    </Provider>
  )
  t.is(wrapper.find('img').prop('src'), '/static/loading.svg')
})
