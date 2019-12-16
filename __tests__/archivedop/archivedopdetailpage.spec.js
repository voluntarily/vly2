import test from 'ava'
import archivedOpportunities from '../../server/api/archivedOpportunity/__tests__/archivedOpportunity.fixture'
import people from '../../server/api/person/__tests__/person.fixture'
import tags from '../../server/api/tag/__tests__/tag.fixture.js'
import objectid from 'objectid'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { ArchivedOpDetailPageWithArchivedOps } from '../../pages/archivedop/archivedopdetailpage'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import { Provider } from 'react-redux'
import withMockRoute from '../../server/util/mockRouter'
import reduxApi from '../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../lib/callApi'

const fetchMock = require('fetch-mock')

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
      }
    }
  )
})

test('archivedOpDetailPage should have an OpDetail component', t => {
  const props = {
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }

  const RoutedArchivedOpDetailPage = withMockRoute(ArchivedOpDetailPageWithArchivedOps)
  const myMock = fetchMock.sandbox()
  myMock.get(API_URL + '/archivedOpportunities/' + archivedOpportunities[1]._id, { body: { status: 200 } })
  myMock.get(API_URL + '/interestsArchived/?op=' + archivedOpportunities[1]._id, { body: { status: 200 } })

  reduxApi.use('fetch', adapterFetch(myMock))
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore} query={{ _id: archivedOpportunities[1]._id }}>
      <RoutedArchivedOpDetailPage {...props} />
    </Provider>
  )

  t.is(wrapper.find('OpDetailArchived').length, 1)
})

test('archivedOpDetailPage should have an InterestSection component', t => {
  const props = {
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }

  const RoutedArchivedOpDetailPage = withMockRoute(ArchivedOpDetailPageWithArchivedOps)
  const myMock = fetchMock.sandbox()
  myMock.get(API_URL + '/archivedOpportunities/' + archivedOpportunities[1]._id, { body: { status: 200 } })
  myMock.get(API_URL + '/interestsArchived/?op=' + archivedOpportunities[1]._id, { body: { status: 200 } })

  reduxApi.use('fetch', adapterFetch(myMock))
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore} query={{ _id: archivedOpportunities[1]._id }}>
      <RoutedArchivedOpDetailPage {...props} />
    </Provider>
  )

  t.is(wrapper.find('InterestArchivedSection').length, 1)
})

test('archivedOpDetailPage should display OpUnavalablePage when no opportunity can be retrieved', t => {
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
  t.is(wrapper.find('OpUnavailablePage').length, 1)
})

test('archivedOpDetailPage should display Loading spinner when loading', t => {
  const myStore = { ...t.context.mockStore }
  myStore.getState().archivedOpportunities.loading = true

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
