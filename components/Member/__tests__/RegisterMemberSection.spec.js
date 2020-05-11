import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import RegisterMemberSection from '../RegisterMemberSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../../lib/callApi'
import fixture from './member.fixture.js'
import { MemberStatus } from '../../../server/api/member/member.constants'
import objectid from 'objectid'
import fetchMock from 'fetch-mock'
import { act } from 'react-dom/test-utils'

const initStore = t => {
  return ({
    organisations: {
      sync: false,
      loading: false,
      data: t.context.orgs
    },
    members: {
      sync: false,
      loading: false,
      data: []
    }
  })
}

test.before('Setup fixtures', t => {
  fixture(t)
  t.context.fetchMock = fetchMock.sandbox()
  t.context.fetchMock.config.overwriteRoutes = false
  reduxApi.use('fetch', adapterFetch(t.context.fetchMock))
})
// test.beforeEach(t => t.context.fetchMock.reset())

test.serial('RegisterMemberSection follow and unfollow', async t => {
  const orgid = t.context.orgs[1]._id
  const meid = t.context.me._id
  const realStore = makeStore(initStore(t))
  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <RegisterMemberSection
        orgid={orgid}
        meid={meid}
      />
    </Provider>
  )
  // we should see "Follow" button
  t.is(wrapper.find('button').first().text(), 'Follow')

  // setup response to click on follow
  const newMember = {
    _id: objectid().toString(),
    person: t.context.me,
    organisation: orgid,
    status: MemberStatus.FOLLOWER
  }
  t.context.fetchMock.postOnce(`${API_URL}/members/`, [newMember])
  wrapper.find('button').first().simulate('click')
  await act(async () => { }) // let the hooks complete
  const newMemberResult = realStore.getState().members.data[0]
  t.deepEqual(newMember, newMemberResult)

  // Status is now follower, button should be unfollow.
  t.is(wrapper.find('button').first().text(), 'Unfollow')

  // setup response to click on unfollow
  newMember.status = MemberStatus.NONE
  t.context.fetchMock.putOnce(`${API_URL}/members/${newMember._id}`, newMember)
  wrapper.find('button').first().simulate('click')
  await act(async () => { }) // let the hooks complete

  // Status is now NONE, button should be follow.
  t.deepEqual(newMember, realStore.getState().members.data[0])
  t.is(wrapper.find('button').first().text(), 'Follow')
  t.truthy(t.context.fetchMock.done())
})

test.serial('RegisterMemberSection join and validate', async t => {
  const members = t.context.members
  const orgid = t.context.orgs[1]._id
  const meid = t.context.me._id
  const realStore = makeStore(initStore(t))

  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <RegisterMemberSection
        orgid={orgid}
        meid={meid}
      />
    </Provider>
  )
  // we should see "Join" button
  t.is(wrapper.find('button').last().text(), 'Staff Signup')

  // setup response to click on follow
  const response = members[0]
  response.status = MemberStatus.JOINER
  t.context.fetchMock.postOnce(`${API_URL}/members/`, response)
  wrapper.find('button').last().simulate('click')
  await act(async () => { }) // let the hooks complete
  wrapper.update()

  // Status is now joiner, button should be Validate.
  t.is(wrapper.find('button').first().text(), 'Validate')
  t.is(wrapper.find('button').last().text(), 'Cancel')
  // Fill in validation code
  response.status = MemberStatus.VALIDATOR
  // myMock.restore()
  t.context.fetchMock.putOnce(`${API_URL}/members/${response._id}`, response)
  wrapper.find('input').first().simulate('change', { target: { value: 'My Validation' } })
  wrapper.find('button').first().simulate('click')
  await act(async () => { }) // let the hooks complete
  // Status is now validator, button should be Cancel Join
  t.is(wrapper.find('button').last().text(), 'Cancel Join')

  // Cancel Join - returns to follower
  response.status = MemberStatus.FOLLOWER
  t.context.fetchMock.putOnce(`${API_URL}/members/${response._id}`, response)
  wrapper.find('button').first().simulate('click')
  await act(async () => { }) // let the hooks complete
  // Status is now validator, button should be Join
  t.is(wrapper.find('button').last().text(), 'Staff Signup')
  t.truthy(t.context.fetchMock.done())
})

test.serial('RegisterMemberSection as a Member', async t => {
  const members = t.context.members
  const orgid = t.context.orgs[1]._id
  const meid = t.context.me._id
  const realStore = makeStore(initStore(t))

  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <RegisterMemberSection
        orgid={orgid}
        meid={meid}
      />
    </Provider>
  )
  // we should see "Follow" button
  t.is(wrapper.find('button').last().text(), 'Staff Signup')

  // setup response to click on follow
  const response = members[0]
  response.status = MemberStatus.MEMBER
  t.context.fetchMock.postOnce(`${API_URL}/members/`, response)
  wrapper.find('button').last().simulate('click')
  await act(async () => { }) // let the hooks complete

  // Status is now Member, button should be leave.
  t.is(wrapper.find('button').first().text(), 'Leave Organisation')
  // setup response to click leave
  response.status = MemberStatus.NONE
  t.context.fetchMock.putOnce(`${API_URL}/members/${response._id}`, response)
  wrapper.find('button').first().simulate('click')
  await act(async () => { }) // let the hooks complete
  t.is(wrapper.find('button').first().text(), 'Follow')

  t.truthy(t.context.fetchMock.done())
})
