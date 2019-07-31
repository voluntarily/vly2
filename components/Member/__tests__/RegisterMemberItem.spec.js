import RegisterMemberItem from '../RegisterMemberItem'
import test from 'ava'
import sinon from 'sinon'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { members } from './member.fixture.js'
console.log(members)
// Initial opportunities added into test db
// const opid = '5cc903e5f94141437622cea7'
// const memberid = '5cc903e5f94141437622cea8'

test('initial state', t => {
  const changeStatus = sinon.fake()

  const wrapper = mountWithIntl(<RegisterMemberItem
    member={members[0]}
    onChangeStatus={changeStatus}
  />)
  t.is(wrapper.find('button').text(), 'Follow')

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
