import React from 'react'
import test from 'ava'
import { OpDetailPage } from '../pages/op/opdetailpage'
import { mountWithIntl } from '../lib/react-intl-test-helper'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import objectid from 'objectid'
import ops from '../server/api/opportunity/__tests__/opportunity.fixture'
import people from '../server/api/person/__tests__/person.fixture'
import withMockRoute from '../server/util/mockRouter'
import thunk from 'redux-thunk'
import reduxApi from '../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../lib/apiCaller'

const fetchMock = require('fetch-mock')

test.before('Setup fixtures', (t) => {
  // This gives all the people fake ids to better represent a fake mongo db
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]

  // Set myself as the requestor for all of the opportunities, and fake ids
  ops.map(op => {
    op._id = objectid().toString()
    op.requestor = me
  })

  t.context = {
    me,
    people,
    ops
  }

  t.context.mockStore = configureStore([thunk])(
    {
      session: {
        isAuthenticated: true,
        user: { nickname: me.nickname },
        me
      },
      opportunities: {
        sync: false,
        syncing: false,
        loading: false,
        data: ops,
        request: null
      }
    }
  )
})

function makeFetchMock (opportunityId) {
  const myMock = fetchMock.sandbox()
  myMock.get(API_URL + '/interests/?op=' + opportunityId, { body: { status: 200 } })
  myMock.delete(API_URL + '/opportunities/' + opportunityId, { body: { status: 200 } })
  return myMock
}

test('send "DELETE" request to redux-api when deletion is confirmed on OpDetailPage', t => {
  const opportunityToDelete = t.context.ops[0]
  const myMock = makeFetchMock(opportunityToDelete._id)
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    opportunities: {
      data: [ opportunityToDelete ]
    },
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const RoutedOpDetailPage = withMockRoute(OpDetailPage)
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )

  t.context.mockStore.clearActions()
  wrapper.find('Popconfirm').filter('#deleteOpPopConfirm').props().onConfirm({})
  t.is(t.context.mockStore.getActions()[0].type, '@@redux-api@opportunities')
  t.is(t.context.mockStore.getActions()[0].request.params.method, 'DELETE')
  t.is(t.context.mockStore.getActions()[0].request.pathvars.id, opportunityToDelete._id)
})

test('does not send "DELETE" request to redux-api when deletion is cancelled on OpDetailPage', t => {
  const opportunityToDelete = t.context.ops[0]
  const myMock = makeFetchMock(opportunityToDelete._id)
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    opportunities: {
      data: [ opportunityToDelete ]
    },
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const RoutedOpDetailPage = withMockRoute(OpDetailPage)
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )

  t.context.mockStore.clearActions()
  wrapper.find('Popconfirm').filter('#deleteOpPopConfirm').props().onCancel({})
  t.is(t.context.mockStore.getActions().length, 0)
})

test('display unavailable opportunity message when opportunity id is invalid on OpDetailPage', t => {
  const props = {
    me: t.context.me
  }
  const RoutedOpDetailPage = withMockRoute(OpDetailPage)
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )

  t.is(wrapper.find('h2').filter('#unavailableOpportunityHeader').first().text(), 'Sorry this opportunity is no longer available')
})
