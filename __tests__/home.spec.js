import React from 'react'
import test from 'ava'
import { PersonHomePageTest } from '../pages/home/home'
import { mountWithIntl } from '../lib/react-intl-test-helper'
import configureStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import objectid from 'objectid'
import ops from '../server/api/opportunity/__tests__/opportunity.fixture'
import people from '../server/api/person/__tests__/person.fixture'

test.before('Setup fixtures', (t) => {
  // not using mongo or server here so faking ids
  people.map(p => { p._id = objectid().toString() })
  const me = people[0]
  // setup list of opportunities, I am owner for the first one
  ops.map((op, index) => {
    op._id = objectid().toString()
    op.requestor = people[index]._id
  })

  // setup list of interests, i'm interested in first 5 ops
  const interestStates = [ 'interested', 'invited', 'committed', 'declined', 'completed', 'cancelled' ]
  const interests = ops.filter(op => op.requestor !== me._id).map((op, index) => {
    return ({
      _id: objectid().toString(),
      person: me._id,
      opportunity: op,
      comment: `${index}: ${me.nickname} is interested in ${op.title}`,
      status: index < interestStates.length ? interestStates[index] : 'interested'
    })
  })

  t.context = {
    me,
    people,
    ops,
    interests
  }

  t.context.mockStore = configureStore()(
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
      },
      interests: {
        sync: false,
        syncing: false,
        loading: false,
        data: interests,
        request: null
      }
    }
  )
})

test.after.always(() => {

})

test('render volunteer home page - Active tab', t => {
  const props = {
    me: t.context.me
  }

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonHomePageTest {...props} />
    </Provider>)
  t.is(wrapper.find('h1').first().text(), t.context.me.nickname)
  t.is(wrapper.find('.ant-tabs-tab-active').first().text(), 'Active')
  t.is(wrapper.find('.ant-tabs-tabpane-active h1').first().text(), 'Active Requests')
  t.is(wrapper.find('.ant-tabs-tabpane-active img').length, 9)
})

test('render volunteer home page - History tab', t => {
  const props = {
    me: t.context.me
  }
  // take ownership of 2nd event and set to done
  t.context.ops[1].requestor = t.context.me._id
  t.context.ops[1].status = 'done'

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonHomePageTest {...props} />
    </Provider>)
  wrapper.find('.ant-tabs-tab').at(1).simulate('click')
  t.is(wrapper.find('.ant-tabs-tab-active').first().text(), 'History')
  t.is(wrapper.find('.ant-tabs-tabpane-active h2').first().text(), 'Completed Requests')
  t.is(wrapper.find('.ant-tabs-tabpane-active img').length, 2)
})

test('render volunteer home page - Profile tab', t => {
  const props = {
    me: t.context.me
  }

  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonHomePageTest {...props} />
    </Provider>)
  wrapper.find('.ant-tabs-tab').at(2).simulate('click')
  t.is(wrapper.find('.ant-tabs-tab-active').first().text(), 'Profile')
  t.is(wrapper.find('.ant-tabs-tabpane-active h1').first().text(), t.context.me.nickname)
})

test('render Edit Profile ', t => {
  const props = { me: t.context.me }
  const wrapper = mountWithIntl(
    <Provider store={t.context.mockStore}>
      <PersonHomePageTest {...props} />
    </Provider>)
  wrapper.find('.ant-tabs-tab').at(2).simulate('click')
  t.is(wrapper.find('.ant-tabs-tab-active').first().text(), 'Profile')
  t.is(wrapper.find('Button').first().text(), 'Edit')
})
