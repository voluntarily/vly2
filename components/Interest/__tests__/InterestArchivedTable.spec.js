import InterestArchivedTable from '../InterestArchivedTable'
import test from 'ava'
import { mountWithIntl, shallowWithIntl } from '../../../lib/react-intl-test-helper'
import sinon from 'sinon'
import withMockRoute from '../../../server/util/mockRouter'

test.serial('InterestTable renders properly', t => {
  const wrapper = mountWithIntl(<InterestArchivedTable
    onPresent={() => {}}
    onAbsent={() => {}}
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
  t.is(wrapper.find('th').at(0).text(), 'Name')
  t.is(wrapper.find('th').at(1).text(), 'Comment')
  t.is(wrapper.find('th').at(2).text(), 'Status')

  // Confirm table data
  t.regex(wrapper.find('td').at(0).text(), /Test Name/)
  t.is(wrapper.find('td').at(1).text(), 'Test Comment')
  t.is(wrapper.find('td').at(2).text(), 'Test Status')
  t.is(wrapper.find('button').first().text(), 'Attended')
  t.is(wrapper.find('button').last().text(), 'Not Attended')
})

test.serial('row click handler pushes to profile page', t => {
  const RoutedTable = withMockRoute(InterestArchivedTable, '/about')
  const wrapper = mountWithIntl(<RoutedTable
    onPresent={() => {}}
    onAbsent={() => {}}
    interests={[{
      person: { nickname: 'Test Name' },
      opportunity: 'Test Opportunity',
      comment: 'Test Comment',
      status: 'Test Status',
      _id: '11223344'
    }]}
  />, '/test')

  wrapper.find('td').at(0).simulate('click')
  t.regex(wrapper.find('td').at(0).text(), /Test Name/)
})

test.serial('Attended button click handler calls correct callback', t => {
  const onPresentCallback = sinon.spy()
  const onAbsentCallback = sinon.spy()

  const wrapper = shallowWithIntl(<InterestArchivedTable
    onPresent={onPresentCallback}
    onAbsent={onAbsentCallback}
  />)

  // test default status
  wrapper.instance().handlePresentButtonClicked({})
  t.truthy(onPresentCallback.calledOnce)
  t.truthy(onAbsentCallback.notCalled)
})

test.serial('Not Attended button click handler calls correct callback', t => {
  const onPresentCallback = sinon.spy()
  const onAbsentCallback = sinon.spy()

  const wrapper = shallowWithIntl(<InterestArchivedTable
    onPresent={onPresentCallback}
    onAbsent={onAbsentCallback}
  />)

  // test default status
  wrapper.instance().handleAbsentButtonClicked({})
  t.truthy(onPresentCallback.notCalled)
  t.truthy(onAbsentCallback.calledOnce)
})