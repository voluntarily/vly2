import React from 'react'
import { act } from 'react-dom/test-utils'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import InterestArchivedSection from '../InterestArchivedSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStoreTest } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import { API_URL } from '../../../lib/callApi'
import fetchMock from 'fetch-mock'
import { makeInterests, opportunity, requestor } from './makeInterests.fixture'
import { InterestStatus } from '../../../server/api/interest/interest.constants'
const { INTERESTED, COMMITTED, NOTATTENDED, ATTENDED } = InterestStatus

const interestCount = 4
const states = [INTERESTED, COMMITTED, ATTENDED, NOTATTENDED]

test.before('Setup fixtures', t => { t.context.interests = makeInterests('InterestArchivedSection', interestCount, states) })

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
  REJECT: 1,
  MESSAGE: 2
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

test('mount the InterestArchivedSection with a list of interests', async t => {
  const realStore = makeStoreTest(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock.getOnce(`${API_URL}/interestArchives/?op=${opid}`, t.context.interests)

  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <InterestArchivedSection opid={opid} />
    </Provider>
  )
  await act(async () => { }) // let the hooks complete
  wrapper.update()

  t.true(realStore.getState().interestArchives.sync)
  t.is(realStore.getState().interestArchives.data.length, interestCount)
  t.is(wrapper.find('tbody tr').length, interestCount)

  const rowindex = 0
  let row = wrapper.find('tbody tr').at(rowindex)
  t.true(row.find('td').at(Col.NAME).exists('AvatarProfile'))
  t.regex(row.find('td').at(Col.NAME).text(), /volunteer_InterestArchivedSection/)
  t.is(row.find('td').at(Col.STATUS).text(), 'interested')

  // check buttons
  let actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  t.is(actionButtons.length, 3)
  // =====================
  // # Test Message button
  // =====================
  let storedInterest = realStore.getState().interestArchives.data[0]
  const messagevp = { ...storedInterest, messages: [{ body: 'new message', author: requestor }] }
  myMock.restore()
  myMock.putOnce(`${API_URL}/interestArchives/${storedInterest._id}`, messagevp)
  row = wrapper.find('tbody tr').at(rowindex)
  actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  t.is(actionButtons.length, 3)
  const messagebutton = actionButtons.at(Btn.MESSAGE)
  t.is(messagebutton.text(), 'Message')
  messagebutton.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'Messaged from us')

  // effect should be to update the message field and leave status stable
  row = wrapper.find('tbody tr').at(rowindex)

  storedInterest = realStore.getState().interestArchives.data[0]
  t.is(row.find('td').at(Col.STATUS).text(), 'interested')
  t.is(storedInterest.status, INTERESTED)
  t.is(storedInterest.messages.length, 1)

  // =====================
  // # Test ATTENDED button
  // =====================
  storedInterest = realStore.getState().interestArchives.data[0]
  let vp = { ...storedInterest, status: ATTENDED }
  myMock.restore()
  myMock.putOnce(`${API_URL}/interestArchives/${storedInterest._id}`, vp)

  let btn = actionButtons.at(Btn.ACCEPT)
  t.is(btn.text(), 'Attended')
  btn.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'Thanks for attending')

  storedInterest = realStore.getState().interestArchives.data[0]
  t.is(storedInterest.status, ATTENDED)
  // effect should be to update row with invited person
  row = wrapper.find('tbody tr').at(rowindex)

  t.regex(row.find('td').at(Col.NAME).text(), /volunteer_InterestArchivedSection/)
  t.is(row.find('td').at(Col.STATUS).text(), 'attended')

  // button changes to just shown Not Attended
  row = wrapper.find('tbody tr').at(rowindex)
  actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  t.is(actionButtons.length, 2)
  btn = actionButtons.at(Btn.ACCEPT)
  t.is(btn.text(), 'Not Attended')

  // ==========================
  // # Test NOT ATTENDED button
  // ==========================
  storedInterest = realStore.getState().interestArchives.data[0]
  vp = { ...storedInterest, status: NOTATTENDED }
  myMock.restore()
  myMock.putOnce(`${API_URL}/interestArchives/${storedInterest._id}`, vp)

  btn.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'Not Attended from us')

  // effect should be to update row back to interested person
  row = wrapper.find('tbody tr').at(rowindex)

  t.regex(row.find('td').at(Col.NAME).text(), /volunteer_InterestArchivedSection/)
  t.is(row.find('td').at(Col.STATUS).text(), 'not_attended')
  storedInterest = realStore.getState().interestArchives.data[0]
  t.is(storedInterest.status, NOTATTENDED)
})
