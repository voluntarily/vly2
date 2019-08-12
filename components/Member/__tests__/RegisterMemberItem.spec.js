import RegisterMemberItem from '../RegisterMemberItem'
import test from 'ava'
import sinon from 'sinon'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import fixture from './member.fixture.js'
import { MemberStatus } from '../../../server/api/member/member.constants'

test.before('Setup fixtures', fixture)

test('initial state', t => {
  const changeStatus = sinon.fake()
  const member = {
    _id: '1',
    person: t.context.me,
    organisation: t.context.orgs[1],
    validation: '',
    status: MemberStatus.NONE
  }
  const wrapper = mountWithIntl(<RegisterMemberItem
    member={member}
    onChangeStatus={changeStatus}
  />)
  t.is(wrapper.find('button').first().text(), 'Follow')
  t.is(wrapper.find('button').at(1).text(), 'Join')

  // // click button and get form
  // wrapper.find('button').simulate('click')
  // t.is(wrapper.find('button').first().text(), 'Get Involved!')
  // t.is(wrapper.find('button').at(1).text(), 'Cancel')

  // // click cancel and return to the original button
  // wrapper.find('button').at(1).simulate('click')
  // t.is(wrapper.find('button').text(), "I'm Membered")

  // // click button and get form again, click action
  // wrapper.find('button').simulate('click')
  // t.is(wrapper.find('button').first().text(), 'Get Involved!')
  // wrapper.find('button').first().simulate('click')

  // t.is(wrapper.find('.ant-form-explain').text(), 'Validation is required')

  // // fill in validation and click again
  // const validation = wrapper.find('textarea')
  // validation.simulate('change', { target: { value: 'My Validation' } })
  // wrapper.find('button').first().simulate('click')

  // // status change callback is called.
  // t.truthy(changeStatus.calledOnce)
})

// test('membered state', t => {
//   const changeStatus = sinon.fake()
//   const withdraw = sinon.fake()

//   const wrapper = mountWithIntl(<RegisterMemberItem
//     member={members[1]}
//     onChangeStatus={changeStatus}
//     onWithdraw={withdraw}
//   />)
//   t.is(wrapper.find('button').first().text(), 'Withdraw Member')
//   wrapper.find('button').first().simulate('click')
// })

// test('completed state', t => {
//   const changeStatus = sinon.fake()
//   const withdraw = sinon.fake()

//   const wrapper = mountWithIntl(<RegisterMemberItem
//     member={members[1]}
//     onChangeStatus={changeStatus}
//     onWithdraw={withdraw}
//   />)
//   t.is(wrapper.find('h1').first().text(), 'Thank you for expressing your member!')
// })

// test('cancelled state', t => {
//   const changeStatus = sinon.fake()
//   const withdraw = sinon.fake()

//   const wrapper = mountWithIntl(<RegisterMemberItem
//     member={members[4]}
//     onChangeStatus={changeStatus}
//     onWithdraw={withdraw}
//   />)
//   // testing the words that come out
//   t.is(wrapper.find('h1').first().text(), 'Thank you so much!')
// })

// test('invited', t => {
//   const changeStatus = sinon.fake()
//   const withdraw = sinon.fake()

//   const wrapper = mountWithIntl(<RegisterMemberItem
//     member={members[4]}
//     onChangeStatus={changeStatus}
//     onWithdraw={withdraw}
//   />)
//   // console.log(wrapper.html())
//   t.is(wrapper.find('h1').first().text(), 'Thank you so much!')
// })

// test('committed', t => {
//   const changeStatus = sinon.fake()
//   const withdraw = sinon.fake()

//   const wrapper = mountWithIntl(<RegisterMemberItem
//     member={members[2]}
//     onChangeStatus={changeStatus}
//     onWithdraw={withdraw}
//   />)
//   // console.log(wrapper.html())
//   t.is(wrapper.find('h1').first().text(), 'You\'ve been invited to participate!')
// })

// test('declined', t => {
//   const changeStatus = sinon.fake()
//   const withdraw = sinon.fake()

//   const wrapper = mountWithIntl(<RegisterMemberItem
//     member={members[5]}
//     onChangeStatus={changeStatus}
//     onWithdraw={withdraw}
//   />)
//   t.is(wrapper.find('h1').first().text(), 'Our apologies')
// })
// TODO: popconfirm requires a valid event.
// popconfirm.props().onConfirm()
// Can't get here until we
