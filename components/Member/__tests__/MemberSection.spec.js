import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import MemberSection from '../MemberSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../../lib/apiCaller'
import { members } from './member.fixture.js'
const { fetchMock } = require('fetch-mock')

const initStore = {
  members: {
    loading: false,
    data: [ ]
  }
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const orgid = 'abcdef123456'
test('mount the MemberSection with four members', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock.getOnce(`${API_URL}/members/?org=${orgid}`, members)
  myMock.putOnce(`${API_URL}/members/1`, members[2])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <MemberSection orgid={orgid} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // console.log(wrapper.html())
  t.is(wrapper.find('h2').text(), 'Membered Volunteers') // there are two cards on the screen
  t.is(wrapper.find('tbody tr').length, 2)
  t.regex(wrapper.find('tbody tr td').at(1).text(), /avowkind/)
  t.regex(wrapper.find('tbody tr').at(1).find('td').at(1).text(), /Dali/)

  // test invite button
  const invitebutton = wrapper.find('tbody tr').first().find('button').first()
  invitebutton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // test withdraw invite button
  const withdrawbutton = wrapper.find('tbody tr').first().find('button').first()
  t.is(withdrawbutton.text(), 'Withdraw Invite')
  myMock.restore()
  myMock.putOnce(`${API_URL}/members/${memberid}`, members[0])
  withdrawbutton.simulate('click')

  // test decline button
  myMock.restore()
  myMock.putOnce(`${API_URL}/members/${memberid}`, declinedAndrew)

  const declinebutton = wrapper.find('tbody tr').first().find('button').at(1)
  t.is(declinebutton.text(), 'Decline')
  //  console.log(declinebutton.html())
  declinebutton.simulate('click')

  // // TODO: fix throw of rejected promise at this point
  // popconfirm.props().onConfirm(members[0])
  // await sleep(1) // allow asynch fetch to complete
  // wrapper.update()
  // const status = wrapper.find('tbody tr').first().find('td').at(2).text()
  // console.log(status)
  // t.truthy(myMock.done())
  myMock.restore()
})
