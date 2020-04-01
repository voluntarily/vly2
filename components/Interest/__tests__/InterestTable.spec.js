import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { act } from 'react-dom/test-utils'
import sinon from 'sinon'
import InterestTable from '../InterestTable'
import { makeInterests } from './makeInterests.fixture'

const interestCount = 10
test.before('Setup fixtures', t => { t.context.interests = makeInterests('InterestSection', interestCount) })

// BATCH Menu Enabled
// const Col = {
//   SELECT: 0,
//   EXPAND: 1,
//   NAME: 2,
//   MESSAGES: 3,
//   STATUS: 4,
//   ACTIONS: 5
// }

// BATCH Menu Disabled
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
test('InterestTable renders properly', async t => {
  const handleAction = sinon.fake()
  const wrapper = mountWithIntl(
    <InterestTable
      onAction={handleAction}
      interests={t.context.interests}
    />)

  // Confirm table headers
  t.is(wrapper.find('th').at(Col.NAME).text(), 'Name')
  t.is(wrapper.find('th').at(Col.MESSAGES).text(), 'Messages')
  t.is(wrapper.find('th').at(Col.STATUS).text(), 'Status')

  // Confirm table data
  t.is(wrapper.find('tbody tr').length, interestCount)

  const rowindex = 0
  let row = wrapper.find('tbody tr').at(rowindex)
  t.true(row.find('td').at(Col.NAME).exists('AvatarProfile'))
  t.regex(row.find('td').at(Col.MESSAGES).text(), /opportunityProvider_alice|volunteer_InterestSection/)
  t.is(row.find('td').at(Col.STATUS).text(), 'interested')

  // =====================
  // # Test invite button
  // =====================
  let actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  t.is(actionButtons.length, 3)
  const invitebutton = actionButtons.at(Btn.ACCEPT)
  t.is(invitebutton.text(), 'Accept')
  invitebutton.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'Invitation from us')

  t.truthy(handleAction.calledOnce)
  // =====================
  // # Test Decline button
  // =====================
  const declinebutton = actionButtons.at(1)
  t.is(declinebutton.text(), 'Decline')
  declinebutton.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'reject from us')
  t.truthy(handleAction.calledTwice)
  // =====================
  // # Test Message button
  // =====================
  const messagebutton = actionButtons.at(Btn.MESSAGE)
  t.is(messagebutton.text(), 'Message')
  messagebutton.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'message from us')
  t.is(handleAction.callCount, 3)
  // =====================
  // # Test withdraw invite button
  // =====================
  row = wrapper.find('tbody tr').at(6)
  t.is(row.find('td').at(Col.STATUS).text(), 'declined')
  actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  t.is(actionButtons.length, 2)
  const undeclinebutton = actionButtons.at(Btn.ACCEPT)
  t.is(undeclinebutton.text(), 'Accept')
  undeclinebutton.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'withdraw from us')
  t.is(handleAction.callCount, 4)
})

// DIFFICULT Seems to be really hard to click on the sort headers.
// test.only('InterestTable sorts ', async t => {
//   const handleAction = sinon.fake()
//   const wrapper = mountWithIntl(
//     <InterestTable
//       onAction={handleAction}
//       interests={t.context.interests}
//     />)

//   // Confirm table headers
//   t.is(wrapper.find('th').at(Col.NAME).text(), 'Name')
//   t.is(wrapper.find('th').at(Col.MESSAGES).text(), 'Messages')
//   t.is(wrapper.find('th').at(Col.STATUS).text(), 'Status')
//   t.not(wrapper.find('tbody tr').at(0).find('td').at(Col.STATUS).text(), wrapper.find('tbody tr').at(2).find('td').at(Col.STATUS).text())
//   const rowindex = 0
//   const sorters = wrapper.find('.ant-table-column-sorter-up')
//   console.log(sorters.debug())
//   sorters.at(Col.STATUS).simulate('click')
//   wrapper.update()
//   const row = wrapper.find('tbody tr').at(rowindex)
//   // console.log(row.debug())
//   t.is(row.find('td').at(Col.STATUS).text(), 'committed')
// })
