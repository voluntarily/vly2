import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import RegisterMemberSection from '../RegisterMemberSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../../lib/apiCaller'
import fixture from './member.fixture.js'
import { MemberStatus } from '../../../server/api/member/member.constants'
import objectid from 'objectid'

const { fetchMock } = require('fetch-mock')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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
  t.context.realStore = makeStore(initStore(t))
  t.context.fetchMock = fetchMock.sandbox()
  t.context.fetchMock.config.overwriteRoutes = false
  reduxApi.use('fetch', adapterFetch(t.context.fetchMock))
})

test.serial('RegisterMemberSection follow and unfollow', async t => {
  const orgid = t.context.orgs[1]._id
  const meid = t.context.me._id
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${orgid}&meid=${meid}`, [])

  const wrapper = await mountWithIntl(
    <Provider store={t.context.realStore}>
      <RegisterMemberSection
        orgid={orgid}
        meid={meid}
      />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // we should see "Follow" button
  t.is(wrapper.find('button').first().text(), 'Follow')
  // console.log(t.context.realStore.getState().members.data)

  // setup response to click on follow
  const newMember = {
    _id: objectid().toString(),
    person: t.context.me,
    organisation: orgid,
    status: MemberStatus.FOLLOWER
  }
  t.context.fetchMock.postOnce(`${API_URL}/members/`, [newMember])
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  const newMemberResult = t.context.realStore.getState().members.data[0]
  t.deepEqual(newMember, newMemberResult)
  // console.log(t.context.realStore.getState().members.data)

  // Status is now follower, button should be unfollow.
  t.is(wrapper.find('button').first().text(), 'Unfollow')

  // setup response to click on unfollow
  newMember.status = MemberStatus.NONE
  t.context.fetchMock.putOnce(`${API_URL}/members/${newMember._id}`, newMember)
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // Status is now NONE, button should be follow.
  t.deepEqual(newMember, t.context.realStore.getState().members.data[0])
  t.is(wrapper.find('button').first().text(), 'Follow')
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})

test.serial('RegisterMemberSection join and validate', async t => {
  const members = t.context.members
  const orgid = t.context.orgs[1]._id
  const meid = t.context.me._id
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${orgid}&meid=${meid}`, [])

  const wrapper = await mountWithIntl(
    <Provider store={t.context.realStore}>
      <RegisterMemberSection
        orgid={orgid}
        meid={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // we should see "Join" button
  t.is(wrapper.find('button').last().text(), 'Join')

  // setup response to click on follow
  const response = members[0]
  response.status = MemberStatus.JOINER
  t.context.fetchMock.postOnce(`${API_URL}/members/`, response)
  wrapper.find('button').last().simulate('click')
  await sleep(1) // allow asynch fetch to complete
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
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // Status is now validator, button should be Cancel Join
  t.is(wrapper.find('button').last().text(), 'Cancel Join')

  // Cancel Join - returns to follower
  response.status = MemberStatus.FOLLOWER
  //  t.context.fetchMock.restore()
  t.context.fetchMock.putOnce(`${API_URL}/members/${response._id}`, response)
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // Status is now validator, button should be Join
  t.is(wrapper.find('button').last().text(), 'Join')
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})

test.serial('RegisterMemberSection as a Member', async t => {
  const members = t.context.members
  const orgid = t.context.orgs[1]._id
  const meid = t.context.me._id
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${orgid}&meid=${meid}`, [])

  const wrapper = await mountWithIntl(
    <Provider store={t.context.realStore}>
      <RegisterMemberSection
        orgid={orgid}
        meid={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // we should see "Follow" button
  t.is(wrapper.find('button').last().text(), 'Join')

  // setup response to click on follow
  const response = members[0]
  response.status = MemberStatus.MEMBER
  t.context.fetchMock.postOnce(`${API_URL}/members/`, response)
  wrapper.find('button').last().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // Status is now Member, button should be leave.
  t.is(wrapper.find('button').first().text(), 'Leave Organisation')
  // setup response to click leave
  response.status = MemberStatus.NONE
  t.context.fetchMock.putOnce(`${API_URL}/members/${response._id}`, response)
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('button').first().text(), 'Follow')

  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})
