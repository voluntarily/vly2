import React from 'react'
import { act } from 'react-dom/test-utils'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import InterestSection from '../InterestSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../../lib/callApi'
import fetchMock from 'fetch-mock'
import { makeInterests, opportunity, requestor } from './makeInterests.fixture'
import { InterestStatus } from '../../../server/api/interest/interest.constants'
const { INVITED, DECLINED } = InterestStatus

const interestCount = 5
test.before('Setup fixtures', t => { t.context.interests = makeInterests('InterestSection', interestCount) })

// BATCH Enabled
// const Col = {
//   SELECT: 0,
//   EXPAND: 1,
//   NAME: 2,
//   MESSAGES: 3,
//   STATUS: 4,
//   ACTIONS: 5
// }

const Col = {
  EXPAND: 0,
  NAME: 1,
  MESSAGES: 2,
  STATUS: 3,
  ACTIONS: 4
}

const Btn = {
  ACCEPT: 0,
  REJECT: 1
}
const opid = opportunity._id
const initStore = {
}

const okMessagePopup = async (t, wrapper, rowindex, message) => {
// find the popup.
  const comment = wrapper.find('textarea').at(rowindex)
  comment.simulate('change', { target: { value: message } })
  wrapper.update()

  // form is visible
  t.true(wrapper.find('RegisterInterestMessageForm').at(rowindex).props().visible)
  // click Send to accept the form
  t.true(wrapper.exists('Button#sendBtn'))
  wrapper.find('Button#sendBtn').first().simulate('click')
  await act(async () => { }) // let the hooks complete
  wrapper.update()

  // check popup has gone
  t.false(wrapper.find('RegisterInterestMessageForm').at(rowindex).props().visible)
}

test.serial('mount the InterestSection with a list of interests', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock.getOnce(`${API_URL}/interests/?op=${opid}`, t.context.interests)

  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <InterestSection opid={opid} />
    </Provider>
  )
  await act(async () => { }) // let the hooks complete
  wrapper.update()

  t.true(realStore.getState().interests.sync)
  t.is(realStore.getState().interests.data.length, interestCount)
  t.is(wrapper.find('tbody tr').length, interestCount)

  const rowindex = 0
  let row = wrapper.find('tbody tr').at(rowindex)
  t.true(row.find('td').at(Col.NAME).exists('AvatarProfile'))
  t.regex(row.find('td').at(Col.NAME).text(), /volunteer_InterestSection/)
  t.is(row.find('td').at(Col.STATUS).text(), 'interested')

  // check buttons
  let actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  t.is(actionButtons.length, 3)

  // =====================
  // # Test invite button
  // =====================
  let storedInterest = realStore.getState().interests.data[0]
  const invitedvp = { ...storedInterest, status: INVITED }
  myMock.putOnce(`${API_URL}/interests/${storedInterest._id}`, invitedvp)

  const invitebutton = actionButtons.at(Btn.ACCEPT)
  t.is(invitebutton.text(), 'Accept')
  invitebutton.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'Invitation from us')

  storedInterest = realStore.getState().interests.data[0]
  t.is(storedInterest.status, INVITED)
  // effect should be to update row with invited person
  row = wrapper.find('tbody tr').at(rowindex)

  t.regex(row.find('td').at(Col.NAME).text(), /volunteer_InterestSection/)
  t.is(row.find('td').at(Col.STATUS).text(), 'invited')
  // =====================
  // # Test withdraw invite button
  // =====================
  // storedInterest = realStore.getState().interests.data[0]
  // const withdrawnvp = { ...storedInterest, status: INTERESTED }
  // myMock.restore()
  // myMock.putOnce(`${API_URL}/interests/${storedInterest._id}`, withdrawnvp)
  // row = wrapper.find('tbody tr').at(rowindex)
  // actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  // t.is(actionButtons.length, 3)
  // const withdrawbutton = actionButtons.at(Btn.ACCEPT)
  // t.is(withdrawbutton.text(), 'Withdraw Invite')
  // withdrawbutton.simulate('click')
  // await okMessagePopup(t, wrapper, rowindex, 'Withdrawn from us')

  // // effect should be to update row back to interested person
  // row = wrapper.find('tbody tr').at(rowindex)

  // t.regex(row.find('td').at(Col.NAME).text(), /volunteer_InterestSection/)
  // t.is(row.find('td').at(Col.STATUS).text(), 'interested')
  // storedInterest = realStore.getState().interests.data[0]
  // t.is(storedInterest.status, INTERESTED)

  // =====================
  // # Test Message button
  // =====================
  storedInterest = realStore.getState().interests.data[0]
  const messagevp = { ...storedInterest, messages: [{ body: 'new message', author: requestor }] }
  myMock.restore()
  myMock.putOnce(`${API_URL}/interests/${storedInterest._id}`, messagevp)
  row = wrapper.find('tbody tr').at(rowindex)
  actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  t.is(actionButtons.length, 2)
  const messagebutton = actionButtons.last()
  t.is(messagebutton.text(), 'Message')
  messagebutton.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'Messaged from us')

  // effect should be to update the message field and leave status stable
  row = wrapper.find('tbody tr').at(rowindex)

  storedInterest = realStore.getState().interests.data[0]
  t.is(row.find('td').at(Col.STATUS).text(), 'invited')
  t.is(storedInterest.status, INVITED)
  t.is(storedInterest.messages.length, 1)

  // =====================
  // # Test Decline button
  // =====================
  storedInterest = realStore.getState().interests.data[0]
  const declinevp = { ...storedInterest, status: DECLINED }
  myMock.restore()
  myMock.putOnce(`${API_URL}/interests/${storedInterest._id}`, declinevp)
  row = wrapper.find('tbody tr').at(rowindex)
  actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  t.is(actionButtons.length, 2)
  const declinebutton = actionButtons.first()
  t.is(declinebutton.text(), 'Decline')
  declinebutton.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'Declined from us')

  // effect should be to update the decline field and leave status stable
  row = wrapper.find('tbody tr').at(rowindex)

  storedInterest = realStore.getState().interests.data[0]
  t.is(row.find('td').at(Col.STATUS).text(), 'declined')
  t.is(storedInterest.status, DECLINED)
})
