import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import MemberSection from '../MemberSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../../lib/apiCaller'
import fixture from './member.fixture.js'
import { MemberStatus } from '../../../server/api/member/member.constants'

const { fetchMock } = require('fetch-mock')

test.before('Setup fixtures', fixture)

const initStore = {
  members: {
    loading: false,
    data: [ ]
  }
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test.serial('followers can become members ', async t => {
  const members = t.context.members
  const orgid = t.context.members[0].organisation._id
  const orgMembers = members.filter(member => member.organisation._id === orgid)
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))

  myMock.getOnce(`${API_URL}/members/?orgid=${orgid}`, orgMembers)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <MemberSection orgid={orgid} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('h2').text(), 'Organisation Members and Followers') // there are two cards on the screen
  t.is(wrapper.find('tbody tr').length, 3)
  t.regex(wrapper.find('tbody tr td').at(1).text(), /avowkind/)

  // test Add button
  t.is(wrapper.find('tbody tr td').at(3).text(), MemberStatus.FOLLOWER)
  myMock.restore()
  const member = orgMembers[0]
  member.status = MemberStatus.MEMBER
  myMock.putOnce(`${API_URL}/members/${orgMembers[0]._id}`, members)

  const addButton = wrapper.find('tbody tr').first().find('button').first()
  t.is(addButton.text(), 'Add')
  addButton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('tbody tr td').at(3).text(), MemberStatus.MEMBER)

  // test Remove button
  const removeButton = wrapper.find('tbody tr').first().find('button').first()
  t.is(removeButton.text(), 'Remove')
  member.status = MemberStatus.EXMEMBER
  myMock.restore()
  myMock.putOnce(`${API_URL}/members/${members[0]._id}`, member)
  removeButton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('tbody tr td').at(3).text(), MemberStatus.EXMEMBER)

  myMock.restore()
})

test.serial('joiners can become members ', async t => {
  const members = t.context.members
  const orgid = t.context.members[0].organisation._id
  const orgMembers = members.filter(member => member.organisation._id === orgid)
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  orgMembers[1].status = MemberStatus.JOINER
  myMock.getOnce(`${API_URL}/members/?orgid=${orgid}`, orgMembers)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <MemberSection orgid={orgid} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // test Reject button
  const joiner = wrapper.find('tbody tr').at(1)

  t.regex(joiner.find('td').at(1).text(), /Dali/)
  t.is(joiner.find('td').at(3).text(), MemberStatus.JOINER)

  const rejectButton = wrapper.find('tbody tr').at(1).find('button').last()
  t.is(rejectButton.text(), 'Reject')

  const dali = orgMembers[1]
  dali.status = MemberStatus.FOLLOWER
  myMock.restore()
  myMock.putOnce(`${API_URL}/members/${dali._id}`, dali)
  rejectButton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('tbody tr').at(1).find('td').at(3).text(), MemberStatus.FOLLOWER)
  myMock.restore()
})
