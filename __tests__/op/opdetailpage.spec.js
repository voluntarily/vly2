import React from 'react'
import test from 'ava'
import { OpDetailPageWithOps, OpDetailPage } from '../../pages/op/opdetailpage'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import objectid from 'objectid'
import ops from '../../server/api/opportunity/__tests__/opportunity.fixture'
import orgs from '../../server/api/organisation/__tests__/organisation.fixture'
import people from '../../server/api/person/__tests__/person.fixture'
import acts from '../../server/api/activity/__tests__/activity.fixture'
import tags from '../../server/api/tag/__tests__/tag.fixture.js'
import thunk from 'redux-thunk'
import reduxApi from '../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../lib/callApi'
import sinon from 'sinon'
import * as nextRouter from 'next/router'
import { MockWindowScrollTo } from '../../server/util/mock-dom-helpers'
import fetchMock from 'fetch-mock'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'

const locations = ['Auckland, Wellington, Christchurch']
MockWindowScrollTo.replaceForTest(test, global)

const orginalWarn = console.warn
const originalError = console.error
test.before('before test silence async-validator', () => {
  console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].startsWith('async-validator:')) return
    orginalWarn(...args)
  }
  console.error = () => {}
})
test.after.always(() => {
  console.warn = orginalWarn
  console.error = originalError
})

test.before('Setup fixtures', (t) => {
  // This gives all the people fake ids to better represent a fake mongo db
  people.map(p => { p._id = objectid().toString() })
  orgs.map(org => { org._id = objectid().toString() })
  acts.map(act => { act._id = objectid().toString() })

  const me = people[0]
  const offerOrg = orgs[0]
  // Set myself as the requestor for all of the opportunities, and fake ids
  ops.map((op, index) => {
    op._id = objectid().toString()
    op.requestor = me
    op.offerOrg = offerOrg
    op.tags = [tags[index], tags[index + 1]]
  })

  const orgMembership = [
    {
      _id: objectid().toString(),
      status: 'orgadmin',
      person: people[0]._id,
      organisation: orgs[0]
    },
    {
      _id: objectid().toString(),
      status: 'member',
      person: me._id,
      organisation: orgs[1]
    }
  ]
  t.context = {
    me,
    people,
    ops,
    op: ops[1],
    tags,
    acts,
    orgs,
    orgMembership,
    locations
  }
  t.context.defaultstore = {
    session: {
      isAuthenticated: true,
      user: { nickname: me.nickname },
      me
    },
    interests: {
      sync: true,
      syncing: false,
      loading: false,
      data: [],
      request: null
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
    },
    members: {
      sync: true,
      syncing: false,
      loading: false,
      data: orgMembership,
      request: null
    },
    activities: {
      sync: true,
      syncing: false,
      loading: false,
      data: [acts[0]],
      request: null
    }
  }
  t.context.mockStore = configureStore([thunk])(t.context.defaultstore)
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

function makeFetchMock (opportunityId) {
  const myMock = fetchMock.sandbox()
  myMock.get(API_URL + '/interests/?op=' + opportunityId, { body: { status: 200 } })
  return myMock
}

test.serial('OpDetailPage GetInitialProps non member', async t => {
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
    .get(`path:/api/opportunities/${t.context.op._id}`, { body: { status: 200 } })
    .get('path:/api/locations', { body: t.context.locations })
    .get('path:/api/tags/', { body: t.context.tags })
    .get('path:/api/members/', { body: t.context.members })
  const props = await OpDetailPage.getInitialProps(ctx)
  t.falsy(props.isNew)
  t.true(props.opExists)
})

test.serial('OpDetailPage GetInitialProps new ask', async t => {
  // first test GetInitialProps
  const ctx = {
    store: t.context.mockStore,
    query: {
      new: 'ask'
    }
  }
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock
    .get(`path:/api/opportunities/${t.context.op._id}`, { body: { status: 200 } })
    .get('path:/api/locations', { body: t.context.locations })
    .get('path:/api/tags/', { body: t.context.tags })
    .get('path:/api/members/', { body: t.context.members })

  const props = await OpDetailPage.getInitialProps(ctx)
  t.true(props.isNew)
  t.is(props.opType, 'ask')
  t.falsy(props.opExists)
})

test.serial('OpDetailPage GetInitialProps new offer', async t => {
  // first test GetInitialProps
  const ctx = {
    store: t.context.mockStore,
    query: {
      new: 'offer'
    }
  }
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock
    .get(`path:/api/opportunities/${t.context.op._id}`, { body: { status: 200 } })
    .get('path:/api/locations', { body: t.context.locations })
    .get('path:/api/tags/', { body: t.context.tags })
    .get('path:/api/members/', { body: t.context.members })

  const props = await OpDetailPage.getInitialProps(ctx)
  t.true(props.isNew)
  t.is(props.opType, 'offer')
  t.falsy(props.opExists)
})

test('send "PUT" request to redux-api when opportunity is canceled and confirmed on OpDetailPage', t => {
  const opportunityToCancel = t.context.op
  const myMock = makeFetchMock(opportunityToCancel._id)
  myMock.put(API_URL + '/opportunities/' + opportunityToCancel._id, { body: { status: 200 } })
  reduxApi.use('fetch', adapterFetch(myMock))
  const props = {
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )
  // click on management tab
  wrapper.find('.ant-tabs-tab').at(2).simulate('click')
  t.context.mockStore.clearActions()
  wrapper.find('Popconfirm').filter('#cancelOpPopConfirm').props().onConfirm({})
  t.is(t.context.mockStore.getActions()[0].type, '@@redux-api@opportunities')
  t.is(t.context.mockStore.getActions()[0].request.params.method, 'PUT')
  t.is(t.context.mockStore.getActions()[0].request.pathvars.id, t.context.op._id)
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
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )
  // click on management tab
  wrapper.find('.ant-tabs-tab').at(2).simulate('click')
  t.context.mockStore.clearActions()
  wrapper.find('Popconfirm').filter('#completedOpPopConfirm').props().onConfirm({})
  t.is(t.context.mockStore.getActions()[0].type, '@@redux-api@opportunities')
  t.is(t.context.mockStore.getActions()[0].request.params.method, 'PUT')
  t.is(t.context.mockStore.getActions()[0].request.pathvars.id, t.context.op._id)
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
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )
  // click on edit tab
  wrapper.find('.ant-tabs-tab').at(3).simulate('click')

  // should switch into edit mode
  const cancelButton = wrapper.find('#backBtn').first()
  t.is(cancelButton.text(), 'Back')
  cancelButton.simulate('click')
  wrapper.find('.ant-tabs-tab').at(3).text('Edit')
  // click on edit tab
  wrapper.find('.ant-tabs-tab').at(3).simulate('click')

  const saveButton = wrapper.find('#doneBtn').first()
  t.is(saveButton.text(), 'Done')
  saveButton.simulate('click')
})

test('display unavailable activity message when opportunity id is invalid on OpDetailPage', t => {
  const props = {
    me: t.context.me
  }
  const mockStore = configureStore([thunk])(
    {
      session: {
        isAuthenticated: false
      },
      opportunities: {
        sync: true,
        loading: false,
        data: []
      },
      tags: { data: tags },
      locations: { data: locations },
      activities: {
        loading: false,
        data: []
      }
    }
  )

  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )
  t.is(wrapper.find('h2').first().text(), 'Sorry, this activity is not available')
})

test('display loading opportunity message when activity is loading', t => {
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
      locations: { data: [locations] }
    }
  )

  const wrapper = mountWithIntl(
    <Provider store={mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )
  t.is(wrapper.find('img').prop('src'), '/static/loading.svg')
})

test('can create new Ask Op from blank', t => {
  // imitate new op state
  const newOpportunitiesData = {
    sync: false,
    syncing: false,
    loading: false,
    data: [],
    request: null
  }
  const originalOpportunitiesData = t.context.defaultstore.opportunities
  t.context.defaultstore.opportunities = newOpportunitiesData

  const opportunityToEdit = t.context.op
  const myMock = makeFetchMock(opportunityToEdit._id)
  myMock.post(API_URL + '/tags/', { body: { status: 200 } })
  myMock.put(API_URL + '/opportunities/' + opportunityToEdit._id, { body: { status: 200 } })
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    isNew: true,
    opType: OpportunityType.ASK,
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )

  const saveButton = wrapper.find('#doneBtn').first()

  t.context.defaultstore.opportunities = originalOpportunitiesData

  t.true(saveButton.exists(), 'Save button should be found on page')
  t.is(saveButton.text(), 'Done')
})

test('can create new Offer Op from blank', t => {
  // imitate new op state
  const newOpportunitiesData = {
    sync: false,
    syncing: false,
    loading: false,
    data: [],
    request: null
  }
  const originalOpportunitiesData = t.context.defaultstore.opportunities
  t.context.defaultstore.opportunities = newOpportunitiesData

  const opportunityToEdit = t.context.op
  const myMock = makeFetchMock(opportunityToEdit._id)
  myMock.post(API_URL + '/tags/', { body: { status: 200 } })
  myMock.put(API_URL + '/opportunities/' + opportunityToEdit._id, { body: { status: 200 } })
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    isNew: true,
    opType: OpportunityType.OFFER,
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )

  const saveButton = wrapper.find('#doneBtn').first()

  t.context.defaultstore.opportunities = originalOpportunitiesData

  t.true(saveButton.exists(), 'Save button should be found on page')
  t.is(saveButton.text(), 'Done')
})

test('can cancel new Op from blank', t => {
  const opportunityToEdit = t.context.op
  const myMock = makeFetchMock(opportunityToEdit._id)
  myMock.post(API_URL + '/tags/', { body: { status: 200 } })
  myMock.put(API_URL + '/opportunities/' + opportunityToEdit._id, { body: { status: 200 } })
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    isNew: true,
    opType: OpportunityType.ASK,
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch
  }
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )
  const saveButton = wrapper.find('#doneBtn').first()
  t.is(saveButton.text(), 'Done')
  const cancelButton = wrapper.find('#backBtn').first()
  t.is(cancelButton.text(), 'Back')
  cancelButton.simulate('click')
})

test.serial('can create new Op from Activity', t => {
  const opportunityToEdit = t.context.op
  const fromActivity = t.context.acts[0]
  const myMock = makeFetchMock(opportunityToEdit._id)
  myMock.post(API_URL + '/tags/', { body: ['one', 'two', 'three'] })
  myMock.put(API_URL + '/opportunities/' + opportunityToEdit._id, { body: { status: 200 } })
  reduxApi.use('fetch', adapterFetch(myMock))

  const props = {
    isNew: true,
    opType: OpportunityType.ASK,
    me: t.context.me,
    dispatch: t.context.mockStore.dispatch,
    actid: fromActivity._id
  }
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )
  // check fields are initialised
  // t.is(wrapper.find('#opportunity_detail_form_name').first().prop('value'), fromActivity.name)
  // t.is(wrapper.find('#opportunity_detail_form_subtitle').first().prop('value'), fromActivity.subtitle)
  // t.is(wrapper.find('#opportunity_detail_form_imgUrl').first().prop('value'), fromActivity.imgUrl)
  const saveButton = wrapper.find('#doneBtn').first()
  t.is(saveButton.text(), 'Done')
})

test('page loads when user is not signed in but does not show edit VP-499', t => {
  const props = {
    me: '',
    opType: OpportunityType.ASK,
    dispatch: t.context.mockStore.dispatch
  }
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <OpDetailPageWithOps {...props} />
    </Provider>
  )
  t.is(wrapper.find('.ant-tabs-tab').length, 2)
})
