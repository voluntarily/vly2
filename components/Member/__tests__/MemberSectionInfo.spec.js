/*
  Additional tests for MemberSection that validate the page for different types of member
*/
import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import MemberSection from '../MemberSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../../lib/callApi'
import fixture from './member.fixture.js'
import { MemberStatus } from '../../../server/api/member/member.constants'
import objectid from 'objectid'
import fetchMock from 'fetch-mock'

test.before('Setup fixtures', t => {
  fixture(t)
  const initStore = {
    members: {
      loading: false,
      data: []
    },
    session: {
      me: t.context.people[1]
    }
  }
  t.context.store = makeStore(initStore)
  t.context.fetchMock = fetchMock.sandbox()
  t.context.fetchMock.config.overwriteRoutes = false
  reduxApi.use('fetch', adapterFetch(t.context.fetchMock))

  t.context.orgMembers = (status, who) => [
    {
      _id: objectid().toString(),
      person: t.context.people[who],
      organisation: t.context.orgs[0],
      status
    }
  ]
})

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test.serial('What instructions non members see', async t => {
  const org = t.context.orgs[0]
  const orgid = org._id
  // this org has no members
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${orgid}`, [])

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  const membersSection = wrapper.find('section').first()
  t.regex(membersSection.find('h2').first().text(), /About Joining/)
  t.is(membersSection.find('span').first().text(), org.info.outsiders)
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})

test.serial('What instructions followers see', async t => {
  const org = t.context.orgs[0]
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${org._id}`, t.context.orgMembers(MemberStatus.FOLLOWER, 1))

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  const membersSection = wrapper.find('section').first()
  t.regex(membersSection.find('h2').first().text(), /Information for followers/)
  t.is(membersSection.find('span').first().text(), org.info.followers)
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})

test.serial('What instructions joiners see', async t => {
  const org = t.context.orgs[0]
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${org._id}`, t.context.orgMembers(MemberStatus.JOINER, 1))

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  const membersSection = wrapper.find('section').first()
  t.regex(membersSection.find('h2').first().text(), /Information for new members/)
  t.is(membersSection.find('span').first().text(), org.info.joiners)
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})

test.serial('What instructions validators see', async t => {
  const org = t.context.orgs[0]
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${org._id}`, t.context.orgMembers(MemberStatus.VALIDATOR, 1))

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  const membersSection = wrapper.find('section').first()
  t.regex(membersSection.find('h2').first().text(), /Information for new members/)
  t.is(membersSection.find('span').first().text(), org.info.joiners)
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})

test.serial('What instructions members see', async t => {
  const org = t.context.orgs[0]
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${org._id}`, t.context.orgMembers(MemberStatus.MEMBER, 1))

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  const membersSection = wrapper.find('section').first()
  t.regex(membersSection.find('h2').first().text(), /Information for members/)
  t.is(membersSection.find('span').first().text(), org.info.members)
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})

test.serial('What instructions non members see when no info', async t => {
  const org = t.context.orgs[0]
  const orgid = org._id
  delete (org.info)

  // this org has no members
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${orgid}`, [])

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  const membersSection = wrapper.find('section').first()
  t.regex(membersSection.find('h2').first().text(), /About Joining/)
  t.is(membersSection.find('span').first().text(), '')
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})
const testNoInfo = async (t, status) => {
  const org = t.context.orgs[0]
  delete (org.info)
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${org._id}`, t.context.orgMembers(status, 1))

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
  return wrapper
}

test.serial('When info is not set Follower', async t => {
  const wrapper = await testNoInfo(t, MemberStatus.FOLLOWER)
  t.is(wrapper.find('section').first().find('span').first().text(), '')
})
test.serial('When info is not set Joiner', async t => {
  const wrapper = await testNoInfo(t, MemberStatus.JOINER)
  t.is(wrapper.find('section').first().find('span').first().text(), '')
})
test.serial('When info is not set Member', async t => {
  const wrapper = await testNoInfo(t, MemberStatus.MEMBER)
  t.is(wrapper.find('section').first().find('span').first().text(), '')
})
test.serial('When info is not set Outsider', async t => {
  const wrapper = await testNoInfo(t, MemberStatus.MEMBER)
  t.is(wrapper.find('section').first().find('span').first().text(), '')
})
