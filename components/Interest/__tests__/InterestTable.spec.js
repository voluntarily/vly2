import InterestTable from '../InterestTable'
import test from 'ava'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import sinon from 'sinon'
import withMockRoute from '../../../server/util/mockRouter'

test('InterestTable renders properly', t => {
  const wrapper = mountWithIntl(
    <InterestTable
      onInvite={() => {}}
      onWithdrawInvite={() => {}}
      onDecline={() => {}}
      interests={[{
        person: { nickname: 'Test Name' },
        opportunity: 'Test Opportunity',
        comment: 'Test Comment',
        status: 'Test Status',
        _id: '11223344'
      }
      ]}
    />)

  // Confirm table headers
  // t.is(wrapper.find('th').at(0).text(), 'Selected')
  t.is(wrapper.find('th').at(1).text(), 'Name')
  t.is(wrapper.find('th').at(2).text(), 'Comment')
  t.is(wrapper.find('th').at(3).text(), 'Status')

  // Confirm table data
  t.regex(wrapper.find('td').at(1).text(), /Test Name/)
  t.is(wrapper.find('td').at(2).text(), 'Test Comment')
  t.is(wrapper.find('td').at(3).text(), 'Test Status')
})

test('row click handler pushes to profile page', t => {
  const RoutedTable = withMockRoute(InterestTable, '/about')
  const wrapper = mountWithIntl(
    <RoutedTable
      onInvite={() => {}}
      onWithdrawInvite={() => {}}
      onDecline={() => {}}
      interests={[{
        person: { nickname: 'Test Name' },
        opportunity: 'Test Opportunity',
        comment: 'Test Comment',
        status: 'Test Status',
        _id: '11223344'
      }]}
    />, '/test')

  wrapper.find('td').at(0).simulate('click')
  t.regex(wrapper.find('td').at(1).text(), /Test Name/)
})

test('Invite button click handler calls correct callback', t => {
  const onInviteCallback = sinon.spy()
  const onWithdrawInviteCallback = sinon.spy()
  const onDeclineCallback = sinon.spy()

  const wrapper = shallowWithIntl(
    <InterestTable
      onInvite={onInviteCallback}
      onWithdrawInvite={onWithdrawInviteCallback}
      onDecline={onDeclineCallback}
      interests={[]}
    />)

  // test default status
  wrapper.instance().handleInviteButtonClicked({})

  t.truthy(onInviteCallback.calledOnce)
  t.truthy(onWithdrawInviteCallback.notCalled)
  t.truthy(onDeclineCallback.notCalled)
})

test('Withdraw invite button click handler calls correct callback', t => {
  const onInviteCallback = sinon.spy()
  const onWithdrawInviteCallback = sinon.spy()
  const onDeclineCallback = sinon.spy()

  const wrapper = shallowWithIntl(
    <InterestTable
      onInvite={onInviteCallback}
      onWithdrawInvite={onWithdrawInviteCallback}
      onDecline={onDeclineCallback}
      interests={[]}
    />)

  // test default status
  wrapper.instance().handleWithdrawInviteButtonClicked({})

  t.truthy(onInviteCallback.notCalled)
  t.truthy(onWithdrawInviteCallback.calledOnce)
  t.truthy(onDeclineCallback.notCalled)
})

test('Decline invite button click handler calls correct callback', t => {
  const onInviteCallback = sinon.spy()
  const onWithdrawInviteCallback = sinon.spy()
  const onDeclineCallback = sinon.spy()

  const wrapper = mountWithIntl(
    <InterestTable
      onInvite={onInviteCallback}
      onWithdrawInvite={onWithdrawInviteCallback}
      onDecline={onDeclineCallback}
      interests={[]}
    />)

  // test default status
  wrapper.instance().handleDeclineButtonClicked({})

  t.truthy(onInviteCallback.notCalled)
  t.truthy(onWithdrawInviteCallback.notCalled)
  t.truthy(onDeclineCallback.calledOnce)
})

test('InterestTable renders undeclined button ', t => {
  const wrapper = mountWithIntl(
    <InterestTable
      onInvite={() => {}}
      onWithdrawInvite={() => {}}
      onDecline={() => {}}
      interests={[{
        person: { nickname: 'Test Name' },
        opportunity: 'Test Opportunity',
        comment: 'Test Comment',
        status: 'declined',
        _id: '11223344'
      }]}
    />)

  // Confirm table data
  t.is(wrapper.find('button').last().text(), 'Undecline Invite')
})

test('InterestTable renders completed label ', t => {
  const wrapper = mountWithIntl(
    <InterestTable
      onInvite={() => {}}
      onWithdrawInvite={() => {}}
      onDecline={() => {}}
      interests={[{
        person: { nickname: 'Test Name' },
        opportunity: 'Test Opportunity',
        comment: 'Test Comment',
        status: 'completed',
        _id: '11223344'
      }]}
    />)
  // Confirm table data
  t.is(wrapper.find('td').at(3).text(), 'completed')
})

test('InterestTable renders invite button ', t => {
  const wrapper = mountWithIntl(
    <InterestTable
      onInvite={() => {}}
      onWithdrawInvite={() => {}}
      onDecline={() => {}}
      interests={[{
        person: { nickname: 'Test Name' },
        opportunity: 'Test Opportunity',
        comment: 'Test Comment',
        status: 'interested',
        _id: '11223344'
      }]}
    />)

  // Confirm table data
  t.is(wrapper.find('button').first().text(), 'Invite')
  t.is(wrapper.find('button').last().text(), 'Decline')
})

test('InterestTable filters out interest records with no person', t => {
  const wrapper = mountWithIntl(
    <InterestTable
      onInvite={() => {}}
      onWithdrawInvite={() => {}}
      onDecline={() => {}}
      interests={[{
        person: null,
        opportunity: 'Test Opportunity 1',
        comment: 'Test Comment 1',
        status: 'interested',
        _id: '11223343'
      }, {
        person: { nickname: 'Test Name' },
        opportunity: 'Test Opportunity 1',
        comment: 'Test Comment 2',
        status: 'interested',
        _id: '11223344'
      }]}
    />
  )

  t.is(wrapper.find('tbody tr').length, 1)
  t.is(wrapper.find('tbody tr td').at(1).text().trim(), 'Test Name')
  t.is(wrapper.find('tbody tr td').at(2).text().trim(), 'Test Comment 2')
})
