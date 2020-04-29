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
import fetchMock from 'fetch-mock'

const MTF = {
  ID: 0,
  NAME: 1,
  STATUS: 2,
  ACTION: 3
}

test.before('Setup fixtures', t => {
  fixture(t)

  const initStore = {
    members: {
      loading: false,
      data: []
    },
    session: {
      me: t.context.people[0]
    }
  }
  t.context.store = makeStore(initStore)
  t.context.fetchMock = fetchMock.sandbox()
  t.context.fetchMock.config.overwriteRoutes = false
  reduxApi.use('fetch', adapterFetch(t.context.fetchMock))
})

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test.serial('followers can become members and then be removed', async t => {
  const members = t.context.members
  const org = t.context.orgs[4]
  const orgid = org._id
  const orgMembers = members.filter(member => member.organisation._id === orgid)

  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${orgid}`, orgMembers)

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} isAdmin />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  let membersSection = wrapper.find('section').at(2)
  t.regex(membersSection.find('h2').first().text(), /Members/)
  // there should be one member initally
  t.is(membersSection.find('tbody tr').length, 1)

  let followersSection = wrapper.find('section').at(3)
  t.regex(followersSection.find('h2').first().text(), /Followers/)
  // there should be one row for each person in the fixture except for the admin
  t.is(followersSection.find('tbody tr').length, t.context.people.length - 1)

  let firstFollowerRow = followersSection.find('tbody tr').first()

  const orgFollowers = orgMembers.filter(member => member.status === MemberStatus.FOLLOWER)
  const firstFollower = orgFollowers[0]

  t.is(firstFollowerRow.find('td a span').at(MTF.NAME).text(), firstFollower.person.nickname)
  t.is(firstFollowerRow.find('td').at(MTF.STATUS).text(), MemberStatus.FOLLOWER)

  // test Add button
  const newfirstFollower = Object.assign({}, firstFollower)
  newfirstFollower.status = MemberStatus.MEMBER
  t.context.fetchMock.putOnce(`${API_URL}/members/${firstFollower._id}`, newfirstFollower)

  const addButton = firstFollowerRow.find('button').first()
  t.is(addButton.text(), 'Add')
  addButton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // first follower should no longer be in the table, moved to the Members table
  followersSection = wrapper.find('section').at(3)
  firstFollowerRow = followersSection.find('tbody tr').first()

  t.is(firstFollowerRow.find('td').at(MTF.STATUS).text(), MemberStatus.FOLLOWER)
  t.is(firstFollowerRow.find('td a span').at(MTF.NAME).text(), orgFollowers[1].person.nickname)

  // there should now be 2 members and Dali should be the second one
  membersSection = wrapper.find('section').at(2)
  t.is(membersSection.find('tbody tr').length, 2)
  const member2 = membersSection.find('tbody tr').at(1)
  t.regex(member2.find('td').at(MTF.NAME).text().trim(), new RegExp(firstFollower.person.nickname))

  // test Remove button
  const removeButton = member2.find('button').first()
  t.is(removeButton.text(), 'Remove')
  const newMember2 = Object.assign({}, firstFollower)
  newMember2.status = MemberStatus.EXMEMBER
  t.context.fetchMock.putOnce(`${API_URL}/members/${firstFollower._id}`, newMember2)
  removeButton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // person has gone from both members and followers section.
  // As an EXMEMBER is not a FOLLOWER by default
  membersSection = wrapper.find('section').at(2)
  t.is(membersSection.find('tbody tr').length, 1)

  followersSection = wrapper.find('section').at(3)
  t.is(followersSection.find('tbody tr').length, t.context.people.length - 2)

  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})

test.serial('joiners can become members ', async t => {
  const members = t.context.members
  const org = t.context.orgs[5]
  const orgid = org._id
  const orgMembers = members.filter(member => member.organisation._id === orgid)

  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${orgid}`, orgMembers)

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} isAdmin />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // there should be 2 member initally
  let membersSection = wrapper.find('section').at(2)
  t.regex(membersSection.find('h2').first().text(), /Members/)
  const memberCount = membersSection.find('tbody tr').length
  t.is(memberCount, 2)

  // there should be one joiner and one validator
  let joinersSection = wrapper.find('section').at(1)
  t.regex(joinersSection.find('h2').first().text(), /Joiners/)
  t.is(joinersSection.find('tbody tr').length, 2)
  let firstJoinerRow = joinersSection.find('tbody tr').first()
  const orgjoiners = orgMembers.filter(member => member.status === MemberStatus.JOINER)
  const firstJoiner = orgjoiners[0]

  t.is(firstJoinerRow.find('td a span').at(MTF.NAME).text(), firstJoiner.person.nickname)
  t.is(firstJoinerRow.find('td').at(MTF.STATUS).text(), MemberStatus.JOINER)

  // test Add button
  const newfirstJoiner = Object.assign({}, firstJoiner)
  newfirstJoiner.status = MemberStatus.MEMBER
  t.context.fetchMock.putOnce(`${API_URL}/members/${firstJoiner._id}`, newfirstJoiner)

  const addButton = firstJoinerRow.find('button').first()
  t.is(addButton.text(), 'Add')
  addButton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // there should now be 3 members
  membersSection = wrapper.find('section').at(2)
  t.is(membersSection.find('tbody tr').length, memberCount + 1)
  const member2 = membersSection.find('tbody tr').at(1)
  t.regex(member2.find('td a span').at(MTF.NAME).text(), new RegExp(firstJoiner.person.nickname))

  // one joiner left
  joinersSection = wrapper.find('section').at(1)
  t.is(joinersSection.find('tbody tr').length, 1)// check the remaining joiner
  firstJoinerRow = joinersSection.find('tbody tr').first()
  const orgValidators = orgMembers.filter(member => member.status === MemberStatus.VALIDATOR)
  const firstValidator = orgValidators[0]

  t.regex(firstJoinerRow.find('td').at(MTF.NAME).text().trim(), new RegExp(firstValidator.person.nickname))
  t.is(firstJoinerRow.find('td').at(MTF.STATUS).text(), MemberStatus.VALIDATOR)

  // test Reject button
  const newfirstValidator = Object.assign({}, firstValidator)
  newfirstValidator.status = MemberStatus.NONE
  t.context.fetchMock.putOnce(`${API_URL}/members/${firstValidator._id}`, newfirstValidator)

  const rejectButton = firstJoinerRow.find('button').last()
  t.is(rejectButton.text(), 'Reject')
  rejectButton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // check length of joiners table now
  joinersSection = wrapper.find('section').at(1)
  t.is(joinersSection.find('tbody tr').length, 0)
  // check members table unchanged
  membersSection = wrapper.find('section').at(2)
  t.is(membersSection.find('tbody tr').length, memberCount + 1)
  t.truthy(t.context.fetchMock.done())
  t.context.fetchMock.restore()
})

test.serial('members can become admins ', async t => {
  const members = t.context.members
  const org = t.context.orgs[5]
  const orgid = org._id
  const orgMembers = members.filter(member => member.organisation._id === orgid)
  const trueMembers = orgMembers.filter(member => [MemberStatus.MEMBER].includes(member.status))
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${orgid}`, orgMembers)

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} isAdmin />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // there should be 2 members initally
  let membersSection = wrapper.find('section').at(2)
  t.regex(membersSection.find('h2').first().text(), /Members/)
  t.is(membersSection.find('tbody tr').length, 2)

  // check orgAdmin can't change own state
  const memberRow1 = membersSection.find('tbody tr').at(0)
  t.is(memberRow1.find('td').at(MTF.STATUS).text(), MemberStatus.ORGADMIN)
  t.is(memberRow1.find('button').length, 0)

  let memberRow2 = membersSection.find('tbody tr').at(1)
  t.is(memberRow2.find('td').at(MTF.STATUS).text(), MemberStatus.MEMBER)

  const firstMember = trueMembers[0]
  t.is(memberRow2.find('td a span').at(MTF.NAME).text(), firstMember.person.nickname)

  // test Make Admin button
  const adminButton = memberRow2.find('button').last()
  t.is(adminButton.text(), 'Make Admin')
  const newOrgAdmin = Object.assign({}, firstMember)
  newOrgAdmin.status = MemberStatus.ORGADMIN
  t.context.fetchMock.putOnce(`${API_URL}/members/${firstMember._id}`, newOrgAdmin)
  adminButton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // check status change
  membersSection = wrapper.find('section').at(2)
  memberRow2 = membersSection.find('tbody tr').at(1)
  t.is(memberRow2.find('td').at(MTF.STATUS).text(), MemberStatus.ORGADMIN)
})

test.serial('admins can see exportMembers button', async t => {
  const members = t.context.members
  const org = t.context.orgs[5]
  const orgid = org._id
  const orgMembers = members.filter(member => member.organisation._id === orgid)
  t.context.fetchMock.getOnce(`${API_URL}/members/?orgid=${orgid}`, orgMembers)

  const wrapper = await mountWithIntl(
    <Provider store={t.context.store}>
      <MemberSection org={org} isAdmin />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // export members button should be visible
  const exportMemberSection = wrapper.find('section').at(4)
  t.true(exportMemberSection.find('Button').exists())
  const exportMembersButton = exportMemberSection.find('Button').at(0)

  t.is(exportMembersButton.text(), 'Export Members')
})
