import InterestTable from '../InterestTable'
import test from 'ava'
import { mount, shallow } from 'enzyme'
import sinon from 'sinon'

test('InterestTable renders properly', t => {
  const wrapper = mount(<InterestTable
    onInvite={() => {}}
    onWithdrawInvite={() => {}}
    onDecline={() => {}}
    interests={[{
      person: 'Test Name',
      opportunity: 'Test Opportunity',
      comment: 'Test Comment',
      status: 'Test Status',
      _id: '11223344'
    }]}
  />)

  // Confirm table headers
  t.is(wrapper.find('th').at(0).text(), 'person ID')
  t.is(wrapper.find('th').at(1).text(), 'Comment')
  t.is(wrapper.find('th').at(2).text(), 'Status')

  // Confirm table data
  t.is(wrapper.find('td').at(0).text(), 'Test Name')
  t.is(wrapper.find('td').at(1).text(), 'Test Comment')
  t.is(wrapper.find('td').at(2).text(), 'Test Status')
})

test('Invite button click handler calls correct callback', t => {
  const onInviteCallback = sinon.spy()
  const onWithdrawInviteCallback = sinon.spy()
  const onDeclineCallback = sinon.spy()

  const wrapper = shallow(<InterestTable
    onInvite={onInviteCallback}
    onWithdrawInvite={onWithdrawInviteCallback}
    onDecline={onDeclineCallback}
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

  const wrapper = shallow(<InterestTable
    onInvite={onInviteCallback}
    onWithdrawInvite={onWithdrawInviteCallback}
    onDecline={onDeclineCallback}
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

  const wrapper = shallow(<InterestTable
    onInvite={onInviteCallback}
    onWithdrawInvite={onWithdrawInviteCallback}
    onDecline={onDeclineCallback}
  />)

  // test default status
  wrapper.instance().handleDeclineButtonClicked({})

  t.truthy(onInviteCallback.notCalled)
  t.truthy(onWithdrawInviteCallback.notCalled)
  t.truthy(onDeclineCallback.calledOnce)
})
