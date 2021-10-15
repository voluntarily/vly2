import MemberTable from '../MemberTable'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import sinon from 'sinon'
import mockRouter from '../../../server/util/mockRouter'
import fixture from './member.fixture.js'
import { MemberStatus } from '../../../server/api/member/member.constants'

test.before('Setup fixtures', fixture)
test.before('Setup Route', mockRouter('/org'), { id: 12345 })

const MTF = {
  ID: 0,
  NAME: 1,
  STATUS: 2,
  ACTION: 3
}

test('MemberTable renders followers properly', t => {
  const members = t.context.members.filter(m => m.status === MemberStatus.FOLLOWER)
  const handleMembershipChange = sinon.spy()
  const wrapper = mountWithIntl(
    <MemberTable
      members={members}
      onMembershipChange={handleMembershipChange}
    />)

  // Confirm table headers
  t.is(wrapper.find('th').at(1).text(), 'Name')
  t.is(wrapper.find('th').at(2).text(), 'Status')

  t.is(wrapper.find('tbody tr').length, members.length)
  // Confirm table data
  const row1 = wrapper.find('tbody tr').first()
  t.is(row1.find('td a span').at(MTF.NAME).text(), members[0].person.nickname)
  t.is(row1.find('td').at(MTF.STATUS).text(), MemberStatus.FOLLOWER)
  const inviteBtn = row1.find('button').at(1)

  t.is(inviteBtn.text(), 'Add')
  inviteBtn.simulate('click')
  t.truthy(handleMembershipChange.called)
  t.is(handleMembershipChange.getCall(0).args[0], members[0])
})

test('MemberTable renders members properly', t => {
  const members = t.context.members.filter(m => m.status === MemberStatus.MEMBER)
  const handleMembershipChange = sinon.spy()
  const wrapper = mountWithIntl(
    <MemberTable
      members={members}
      onMembershipChange={handleMembershipChange}
    />)

  t.is(wrapper.find('tbody tr').length, members.length)
  // Confirm table data
  const row1 = wrapper.find('tbody tr').first()
  t.is(row1.find('td a span').at(MTF.NAME).text(), members[0].person.nickname)
  t.is(row1.find('td').at(MTF.STATUS).text(), MemberStatus.MEMBER)

  const inviteBtn = row1.find('button').at(1)
  t.is(inviteBtn.text(), 'Remove')
  inviteBtn.simulate('click')
  t.truthy(handleMembershipChange.called)
  t.is(handleMembershipChange.getCall(0).args[0], members[0])
})

test('row click handler pushes to profile page', t => {
  const members = t.context.members

  const handleMembershipChange = sinon.spy()
  const wrapper = mountWithIntl(
    <MemberTable
      members={members}
      onMembershipChange={handleMembershipChange}
    />)
  const row1 = wrapper.find('tr').at(1)
  t.regex(row1.find('td').at(1).text(), /avowkind/)
  row1.find('a').first().simulate('click')
})

test('expanded row render', t => {
  const members = t.context.members.filter(m => m.status === MemberStatus.FOLLOWER)
  const handleMembershipChange = sinon.spy()
  const wrapper = mountWithIntl(
    <MemberTable
      members={members}
      onMembershipChange={handleMembershipChange}
    />)

  const expander = wrapper.find('.ant-table-row-expand-icon').first()
  expander.simulate('click')
  const exprow = wrapper.find('.ant-table-expanded-row').first()
  t.is(exprow.length, 1)
  t.regex(exprow.find('p').first().text(), /.*Salvador.*/)
})
