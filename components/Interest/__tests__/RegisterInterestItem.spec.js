import RegisterInterestItem from '../RegisterInterestItem'
import test from 'ava'
import people from '../../../server/api/person/__tests__/person.fixture'
import sinon from 'sinon'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

// Initial opportunities added into test db
const opid = '5cc903e5f94141437622cea7'
const ops = [
  {
    _id: opid,
    name: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    tags: [],
    status: 'active'
  }
]

const interestid = '5cc903e5f94141437622cea8'
const interests = [
  {
    _id: interestid,
    person: people[0],
    opportunity: ops[0],
    comment: "I'm Andrew",
    status: null
  },
  {
    _id: interestid,
    person: people[0],
    opportunity: ops[0],
    comment: "I'm Andrew",
    status: 'interested'
  },
  {
    _id: interestid,
    person: people[0],
    opportunity: ops[0],
    comment: "I'm Andrew",
    status: 'invited'
  },
  {
    _id: interestid,
    person: people[0],
    opportunity: ops[0],
    comment: "I'm Andrew",
    status: 'committed'
  },
  {
    _id: interestid,
    person: people[0],
    opportunity: ops[0],
    comment: "I'm Andrew",
    status: 'completed'
  },
  {
    _id: interestid,
    person: people[0],
    opportunity: ops[0],
    comment: "I'm Andrew",
    status: 'cancelled'
  },
  {
    _id: interestid,
    person: people[0],
    opportunity: ops[0],
    comment: "I'm Andrew",
    status: 'declined'
  }

]

test('initial state', t => {
  const changeStatus = sinon.fake()
  const withdraw = sinon.fake()

  const wrapper = mountWithIntl(<RegisterInterestItem
    interest={interests[0]}
    onChangeStatus={changeStatus}
    onWithdraw={withdraw}
  />)
  t.is(wrapper.find('button').text(), "I'm Interested")

  // click button and get form
  wrapper.find('button').simulate('click')
  t.is(wrapper.find('button').first().text(), 'Get Involved!')
  t.is(wrapper.find('button').at(1).text(), 'Cancel')

  // click cancel and return to the original button
  wrapper.find('button').at(1).simulate('click')
  t.is(wrapper.find('button').text(), "I'm Interested")

  // click button and get form again, click action
  wrapper.find('button').simulate('click')
  t.is(wrapper.find('button').first().text(), 'Get Involved!')
  wrapper.find('button').first().simulate('click')

  t.is(wrapper.find('.ant-form-explain').text(), 'Comment is required')

  // fill in comment and click again
  const comment = wrapper.find('textarea')
  comment.simulate('change', { target: { value: 'My Comment' } })
  wrapper.find('button').first().simulate('click')

  // status change callback is called.
  t.truthy(changeStatus.calledOnce)
})

test('interested state', t => {
  const changeStatus = sinon.fake()
  const withdraw = sinon.fake()

  const wrapper = mountWithIntl(<RegisterInterestItem
    interest={interests[1]}
    onChangeStatus={changeStatus}
    onWithdraw={withdraw}
  />)
  t.is(wrapper.find('button').first().text(), 'Withdraw Interest')
  wrapper.find('button').first().simulate('click')
})

test('completed state', t => {
  const changeStatus = sinon.fake()
  const withdraw = sinon.fake()

  const wrapper = mountWithIntl(<RegisterInterestItem
    interest={interests[1]}
    onChangeStatus={changeStatus}
    onWithdraw={withdraw}
  />)
  t.is(wrapper.find('h1').first().text(), 'Thank you for expressing your interest!')
})

test('cancelled state', t => {
  const changeStatus = sinon.fake()
  const withdraw = sinon.fake()

  const wrapper = mountWithIntl(<RegisterInterestItem
    interest={interests[4]}
    onChangeStatus={changeStatus}
    onWithdraw={withdraw}
  />)
  // testing the words that come out
  t.is(wrapper.find('h1').first().text(), 'Thank you so much!')
})

test('invited', t => {
  const changeStatus = sinon.fake()
  const withdraw = sinon.fake()

  const wrapper = mountWithIntl(<RegisterInterestItem
    interest={interests[4]}
    onChangeStatus={changeStatus}
    onWithdraw={withdraw}
  />)
  // console.log(wrapper.html())
  t.is(wrapper.find('h1').first().text(), 'Thank you so much!')
})

test('committed', t => {
  const changeStatus = sinon.fake()
  const withdraw = sinon.fake()

  const wrapper = mountWithIntl(<RegisterInterestItem
    interest={interests[2]}
    onChangeStatus={changeStatus}
    onWithdraw={withdraw}
  />)
  // console.log(wrapper.html())
  t.is(wrapper.find('h1').first().text(), 'You\'ve been invited to participate!')
})

test('declined', t => {
  const changeStatus = sinon.fake()
  const withdraw = sinon.fake()

  const wrapper = mountWithIntl(<RegisterInterestItem
    interest={interests[5]}
    onChangeStatus={changeStatus}
    onWithdraw={withdraw}
  />)
  t.is(wrapper.find('h1').first().text(), 'Our apologies')
})
// TODO: popconfirm requires a valid event.
// popconfirm.props().onConfirm()
// Can't get here until we
