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

const { fetchMock } = require('fetch-mock')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const initStore = t => {
  return ({
    organisations: {
      loading: false,
      data: t.context.orgs
    },
    members: {
      loading: false,
      data: []
    }
  })
}

test.before('Setup fixtures', t => {
  fixture(t)
  t.context.realStore = makeStore(initStore(t))
  t.context.myMock = fetchMock.sandbox()
  t.context.myMock.config.overwriteRoutes = false
  reduxApi.use('fetch', adapterFetch(t.context.myMock))
})

test.serial('RegisterMemberSection follow and unfollow', async t => {
  const members = t.context.members
  const orgid = t.context.orgs[1]._id
  const meid = t.context.me._id
  t.context.myMock.getOnce(`${API_URL}/members/?orgid=${orgid}&meid=${meid}`, [])

  const wrapper = await mountWithIntl(
    <Provider store={t.context.realStore}>
      <RegisterMemberSection
        orgid={orgid}
        meid={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  t.is(wrapper.find('.loader').first().text(), 'Loading...')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // we should see "Follow" button
  t.is(wrapper.find('button').first().text(), 'Follow')

  // setup response to click on follow
  t.context.myMock.postOnce(`${API_URL}/members/`, members[0])
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // Status is now follower, button should be unfollow.
  t.is(wrapper.find('button').first().text(), 'Unfollow')

  // setup response to click on unfollow
  const response = members[0]
  response.status = MemberStatus.NONE
  t.context.myMock.putOnce(`${API_URL}/members/${response._id}`, members[0])
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // Status is now NONE, button should be follow.
  t.is(wrapper.find('button').first().text(), 'Follow')
  t.truthy(t.context.myMock.done())
  t.context.myMock.restore()
})

test.serial('RegisterMemberSection join and validate', async t => {
  const members = t.context.members
  const orgid = t.context.orgs[1]._id
  const meid = t.context.me._id
  t.context.myMock.getOnce(`${API_URL}/members/?orgid=${orgid}&meid=${meid}`, [])

  const wrapper = await mountWithIntl(
    <Provider store={t.context.realStore}>
      <RegisterMemberSection
        orgid={orgid}
        meid={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  t.is(wrapper.find('.loader').first().text(), 'Loading...')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // we should see "Follow" button
  t.is(wrapper.find('button').last().text(), 'Join')

  // setup response to click on follow
  const response = members[0]
  response.status = MemberStatus.JOINER
  t.context.myMock.postOnce(`${API_URL}/members/`, response)
  wrapper.find('button').last().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // Status is now joiner, button should be Validate.
  t.is(wrapper.find('button').first().text(), 'Validate')
  t.is(wrapper.find('button').last().text(), 'Cancel')

  // Fill in validation code
  response.status = MemberStatus.VALIDATOR
  // myMock.restore()
  t.context.myMock.putOnce(`${API_URL}/members/${response._id}`, response)
  wrapper.find('input').first().simulate('change', { target: { value: 'My Validation' } })
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // Status is now validator, button should be Cancel Join
  t.is(wrapper.find('button').last().text(), 'Cancel Join')

  // Cancel Join - returns to follower
  response.status = MemberStatus.FOLLOWER
  //  t.context.myMock.restore()
  t.context.myMock.putOnce(`${API_URL}/members/${response._id}`, response)
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // Status is now validator, button should be Join
  t.is(wrapper.find('button').last().text(), 'Join')
  t.truthy(t.context.myMock.done())
  t.context.myMock.restore()
})

test.serial('RegisterMemberSection as a Member', async t => {
  const members = t.context.members
  const orgid = t.context.orgs[1]._id
  const meid = t.context.me._id
  t.context.myMock.getOnce(`${API_URL}/members/?orgid=${orgid}&meid=${meid}`, [])

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
  t.context.myMock.postOnce(`${API_URL}/members/`, response)
  wrapper.find('button').last().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // Status is now Member, button should be leave.
  t.is(wrapper.find('button').first().text(), 'Leave Organisation')
  // setup response to click leave
  response.status = MemberStatus.NONE
  t.context.myMock.putOnce(`${API_URL}/members/${response._id}`, response)
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('button').first().text(), 'Follow')

  t.truthy(t.context.myMock.done())
  t.context.myMock.restore()
})
