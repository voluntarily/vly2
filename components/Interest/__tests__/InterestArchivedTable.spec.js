import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { act } from 'react-dom/test-utils'
import sinon from 'sinon'
import InterestArchivedTable from '../InterestArchivedTable'
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
test('InterestArchivedTable renders properly', async t => {
  const handleAction = sinon.fake()
  const wrapper = mountWithIntl(
    <InterestArchivedTable
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
  // # Test Message button
  // =====================
  let btn
  row = wrapper.find('tbody tr').at(rowindex)
  let actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  t.is(actionButtons.length, 3)

  btn = actionButtons.at(Btn.MESSAGE)
  t.is(btn.text(), 'Message')
  btn.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'message from us')
  t.is(handleAction.callCount, 1)

  // =====================
  // # Test Attended button
  // =====================
  row = wrapper.find('tbody tr').at(rowindex)

  actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  btn = actionButtons.at(Btn.ACCEPT)
  t.is(btn.text(), 'Attended')
  btn.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'attended from us')
  t.is(handleAction.callCount, 2)

  // =====================
  // # Test Not attended button
  // =====================
  row = wrapper.find('tbody tr').at(rowindex)
  actionButtons = row.find('td').at(Col.ACTIONS).find('Button')
  btn = actionButtons.at(Btn.REJECT)
  t.is(btn.text(), 'Not Attended')
  btn.simulate('click')
  await okMessagePopup(t, wrapper, rowindex, 'not attended from us')

  t.is(handleAction.callCount, 3)
})
