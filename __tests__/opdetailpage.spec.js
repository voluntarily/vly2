import React from 'react'
import test from 'ava'
import { OpDetailPageWithOps } from '../pages/op/opdetailpage'
import { mountWithIntl } from '../lib/react-intl-test-helper'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import objectid from 'objectid'
import ops from '../server/api/opportunity/__tests__/opportunity.fixture'
import people from '../server/api/person/__tests__/person.fixture'
import tags from '../server/api/tag/__tests__/tag.fixture.js'
import withMockRoute from '../server/util/mockRouter'
import thunk from 'redux-thunk'
import reduxApi from '../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../lib/apiCaller'

const locations = ['Auckland, Wellington, Christchurch']

const fetchMock = require('fetch-mock')

test.before('Setup fixtures', (t) => {
  // This gives all the people fake ids to better represent a fake mongo db
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]

  // Set myself as the requestor for all of the opportunities, and fake ids
  ops.map((op, index) => {
    op._id = objectid().toString()
    op.requestor = me
    op.tags = [ tags[index], tags[index + 1] ]
  })

  t.context = {
    me,
    people,
    ops,
    op: ops[1],
    tags
  }

  t.context.mockStore = configureStore([thunk])(
    {
      session: {
        isAuthenticated: true,
        user: { nickname: me.nickname },
        me
      },
      opportunities: {
        sync: true,
        syncing: false,
        loading: false,
        data: [ops[1]],
        request: null
      },
      tags: {
        sync: true,
        syncing: false,
        loading: false,
        data: tags,
        request: null
      },
      locations: {
        sync: true,
        syncing: false,
        loading: false,
        data: locations,
        request: null
      }

    }
  )
})

function makeFetchMock (opportunityId) {
  const myMock = fetchMock.sandbox()
  myMock.get(API_URL + '/interests/?op=' + opportunityId, { body: { status: 200 } })
  return myMock
}

test('send "PUT" request to redux-api when opportunity is cancelled on OpDetailPage', t => {
  const opportunityToCancel = t.context.op
  const myMock = makeFetchMock(opportunityToCancel._id)
  myMock.put(API_URL + '/opportunities/' + opportunityToCancel._id, { body: { status: 200 } })
  reduxApi.use('fetch', adapterFetch(myMock))
  const props = {
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const RoutedOpDetailPage = withMockRoute(OpDetailPageWithOps)
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )
  t.context.mockStore.clearActions()
  wrapper.find('Popconfirm').filter('#cancelOpPopConfirm').props().onConfirm({})
  t.is(t.context.mockStore.getActions()[0].type, '@@redux-api@opportunities')
  t.is(t.context.mockStore.getActions()[0].request.params.method, 'PUT')
  t.is(t.context.mockStore.getActions()[0].request.pathvars.id, t.context.op._id)
})

test('does not send "PUT" request to redux-api when cancel opportunity button is cancelled on OpDetailPage', t => {
  // const opportunityToCancel = t.context.ops
  // const myMock = makeFetchMock(opportunityToCancel._id)
  // reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const RoutedOpDetailPage = withMockRoute(OpDetailPageWithOps)
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )

  t.context.mockStore.clearActions()
  wrapper.find('Popconfirm').filter('#cancelOpPopConfirm').props().onCancel({})
  t.is(t.context.mockStore.getActions().length, 0)
})

test('send "PUT" request to redux-api when opportunity is completed on OpDetailPage', t => {
  const opportunityToComplete = t.context.op
  const myMock = makeFetchMock(opportunityToComplete._id)
  myMock.put(API_URL + '/opportunities/' + opportunityToComplete._id, { body: { status: 200 } })
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const RoutedOpDetailPage = withMockRoute(OpDetailPageWithOps)
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )

  t.context.mockStore.clearActions()
  wrapper.find('Popconfirm').filter('#completedOpPopConfirm').props().onConfirm({})
  t.is(t.context.mockStore.getActions()[0].type, '@@redux-api@opportunities')
  t.is(t.context.mockStore.getActions()[0].request.params.method, 'PUT')
  t.is(t.context.mockStore.getActions()[0].request.pathvars.id, t.context.op._id)
})

test('does not send "PUT" request to redux-api when complete opportunity is cancelled on OpDetailPage', t => {
  const opportunityToComplete = t.context.op
  const myMock = makeFetchMock(opportunityToComplete._id)
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const RoutedOpDetailPage = withMockRoute(OpDetailPageWithOps)
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )

  t.context.mockStore.clearActions()
  wrapper.find('Popconfirm').filter('#completedOpPopConfirm').props().onCancel({})
  t.is(t.context.mockStore.getActions().length, 0)
})

test('can Edit the Op', t => {
  const opportunityToEdit = t.context.op
  const myMock = makeFetchMock(opportunityToEdit._id)
  myMock.post(API_URL + '/tags/', { body: { status: 200 } })
  myMock.put(API_URL + '/opportunities/' + opportunityToEdit._id, { body: { status: 200 } })
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const RoutedOpDetailPage = withMockRoute(OpDetailPageWithOps)
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )
  let editButton = wrapper.find('#editOpBtn').first()
  t.is(editButton.text(), 'Edit')
  editButton.simulate('click')

  // should switch into edit mode 
  const cancelButton = wrapper.find('#cancelOpBtn').first()
  t.is(cancelButton.text(), 'Cancel')
  cancelButton.simulate('click')
  editButton = wrapper.find('#editOpBtn').first()
  t.is(editButton.text(), 'Edit')
  t.is(wrapper.find('h1').first().text(), '2 Self driving model cars')
  editButton.simulate('click')
  const saveButton = wrapper.find('#saveOpBtn').first()
  t.is(saveButton.text(), 'Save as draft')
  saveButton.simulate('click')

  // console.log(t.context.mockStore.getActions()[0])
  // should switch back to display mode
  // console.log(wrapper.html())
})

test('display unavailable opportunity message when opportunity id is invalid on OpDetailPage', t => {
  const props = {
    me: t.context.me
  }
  const mockStore = configureStore([thunk])(
    {
      session: {
        isAuthenticated: false
      },
      opportunities: {
        loading: false,
        data: []
      },
      tags: { data: tags },
      locations: { data: locations }
    }
  )

  const RoutedOpDetailPage = withMockRoute(OpDetailPageWithOps)
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )
  t.is(wrapper.find('h2').first().text(), 'Sorry, this opportunity is not available')
})

test('display loading opportunity message when opportunity is loading', t => {
  const props = {
    me: t.context.me
  }
  const mockStore = configureStore([thunk])(
    {
      session: {
        isAuthenticated: false
      },
      opportunities: {
        loading: true,
        data: []
      },
      tags: { data: tags },
      locations: { data: [ locations ] }
    }
  )

  const RoutedOpDetailPage = withMockRoute(OpDetailPageWithOps)
  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )
  t.is(wrapper.find('.loader').first().text(), 'Loading...')
})

test('can create new Op', t => {
  const opportunityToEdit = t.context.op
  const myMock = makeFetchMock(opportunityToEdit._id)
  myMock.post(API_URL + '/tags/', { body: { status: 200 } })
  myMock.put(API_URL + '/opportunities/' + opportunityToEdit._id, { body: { status: 200 } })
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    isNew: true,
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const RoutedOpDetailPage = withMockRoute(OpDetailPageWithOps)
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <RoutedOpDetailPage {...props} />
    </Provider>
  )
  // console.log(wrapper.html())
  const saveButton = wrapper.find('#saveOpBtn').first()
  t.is(saveButton.text(), 'Save as draft')
  // saveButton.simulate('click')

  // console.log(t.context.mockStore.getActions()[0])
  // should switch back to display mode
  // console.log(wrapper.html())
})
