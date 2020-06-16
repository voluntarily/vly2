import RegisterInterestItem from '../RegisterInterestItem'
import test from 'ava'
import people from '../../../server/api/person/__tests__/person.fixture'
import sinon from 'sinon'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { InterestStatus } from '../../../server/api/interest/interest.constants'
import mongoose from 'mongoose'
import { Provider } from 'react-redux'
import { makeStore } from '../../../lib/redux/reduxApi'
const ObjectId = mongoose.Types.ObjectId

const person = {
  nickname: 'Testy'
}
// Initial opportunities added into test db
const opid = '5cc903e5f94141437622cea7'
const ops = [
  {
    _id: opid,
    type: 'ask',
    name: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    tags: [],
    status: 'active',
    requestor: person
  }
]

const interests = [
  {
    _id: ObjectId(),
    person: people[0],
    opportunity: ops[0],
    termsAccepted: false,
    messages: [],
    status: null
  },
  {
    _id: ObjectId(),
    person: people[0],
    opportunity: ops[0],
    messages: [{
      body: 'Message 1',
      author: ObjectId()
    }],
    termsAccepted: true,
    status: InterestStatus.INTERESTED
  },
  {
    _id: ObjectId(),
    person: people[0],
    opportunity: ops[0],
    messages: [{
      body: 'Message 2',
      author: ObjectId()
    }],
    termsAccepted: true,
    status: InterestStatus.INVITED
  },
  {
    _id: ObjectId(),
    person: people[0],
    opportunity: ops[0],
    messages: [{
      body: 'Message 3',
      author: ObjectId()
    }],
    termsAccepted: true,
    status: InterestStatus.COMMITTED
  },
  {
    _id: ObjectId(),
    person: people[0],
    opportunity: ops[0],
    messages: [{
      body: 'Message 4',
      author: ObjectId()
    }],
    termsAccepted: true,
    status: InterestStatus.DECLINED
  }

]

const initStore = {
  opportunities: {
    loading: false,
    data: ops
  },
  interests: {
    loading: false,
    data: []
  }
}

test('initial state', t => {
  const handleAccept = sinon.fake()
  const handleReject = sinon.fake()
  const handleMessage = sinon.fake()
  const realStore = makeStore(initStore)
  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <RegisterInterestItem
        interest={interests[0]}
        onAccept={handleAccept}
        onReject={handleReject}
        onMessage={handleMessage}
      />
    </Provider>
  )
  t.true(wrapper.exists('#acceptBtn'))
  t.false(wrapper.exists('#rejectBtn'))
  t.false(wrapper.exists('#messageBtn'))
  t.is(wrapper.find('#acceptBtn').first().text(), 'Offer to help')
  t.is(wrapper.find('RegisterInterestMessageForm').length, 0)
  // t.false(wrapper.find('RegisterInterestMessageForm#acceptRegisterInterestForm').first().props().visible)

  // // click button and get popup form
  // wrapper.find('#acceptBtn').first().simulate('click')
  // let acceptForm = wrapper.find('#acceptRegisterInterestForm').first()
  // t.true(acceptForm.props().visible)

  // // click cancel to hide the form
  // t.true(wrapper.exists('#cancelBtn'))
  // wrapper.find('#cancelBtn').first().simulate('click')
  // acceptForm = wrapper.find('#acceptRegisterInterestForm').first()
  // t.false(acceptForm.props().visible)

  // // click button and get popup form again
  // wrapper.find('#acceptBtn').first().simulate('click')
  // acceptForm = wrapper.find('#acceptRegisterInterestForm').first()
  // t.true(acceptForm.props().visible)

  // // add message
  // const comment = acceptForm.find('textarea').first()
  // comment.simulate('change', { target: { value: 'My Comment' } })
  // wrapper.update()

  // // commit the form
  // wrapper.find('#sendBtn').first().simulate('click')

  // // status change callback is called.
  // t.true(handleAccept.calledOnce)
  // t.true(handleAccept.calledWith('My Comment'))
})

test('interested state', t => {
  const handleAccept = sinon.fake()
  const handleReject = sinon.fake()
  const handleMessage = sinon.fake()
  const realStore = makeStore(initStore)
  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <RegisterInterestItem
        interest={interests[1]}
        onAccept={handleAccept}
        onReject={handleReject}
        onMessage={handleMessage}
      />
    </Provider>
  )
  t.false(wrapper.exists('#acceptBtn'))
  t.true(wrapper.exists('#rejectBtn'))
  t.true(wrapper.exists('#messageBtn'))

  // // click reject button and get popup form
  // wrapper.find('#rejectBtn').first().simulate('click')
  // const rejectForm = wrapper.find('#rejectRegisterInterestForm').first()
  // t.true(rejectForm.props().visible)

  // // add message
  // const comment = rejectForm.find('textarea').first()
  // comment.simulate('change', { target: { value: 'Withdraw message' } })
  // wrapper.update()

  // // commit the form
  // wrapper.find('#sendBtn').first().simulate('click')

  // status change callback is called.
//   t.true(handleReject.calledOnce)
//   t.true(handleReject.calledWith('Withdraw message'))
})

test(InterestStatus.INVITED, t => {
  const handleAccept = sinon.fake()
  const handleReject = sinon.fake()
  const handleMessage = sinon.fake()
  const realStore = makeStore(initStore)

  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <RegisterInterestItem
        interest={interests[2]}
        onAccept={handleAccept}
        onReject={handleReject}
        onMessage={handleMessage}
      />
    </Provider>
  )
  t.true(wrapper.exists('#acceptBtn'))
  t.true(wrapper.exists('#rejectBtn'))
  t.false(wrapper.exists('#messageBtn'))

  //   // click reject button and get popup form
  //   wrapper.find('#rejectBtn').first().simulate('click')
  //   const rejectForm = wrapper.find('#rejectRegisterInterestForm').first()
  //   t.true(rejectForm.props().visible)

  //   // add message
  //   const comment = rejectForm.find('textarea').first()
  //   comment.simulate('change', { target: { value: 'Withdraw message' } })
  //   wrapper.update()

  //   // commit the form
  //   wrapper.find('#sendBtn').first().simulate('click')

//   // status change callback is called.
//   t.true(handleReject.calledOnce)
//   t.true(handleReject.calledWith('Withdraw message'))
})

test(InterestStatus.COMMITTED, t => {
  const handleAccept = sinon.fake()
  const handleReject = sinon.fake()
  const handleMessage = sinon.fake()
  const realStore = makeStore(initStore)

  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <RegisterInterestItem
        interest={interests[3]}
        onAccept={handleAccept}
        onReject={handleReject}
        onMessage={handleMessage}
      />
    </Provider>
  )
  t.false(wrapper.exists('#acceptBtn'))
  t.true(wrapper.exists('#rejectBtn'))
  t.true(wrapper.exists('#messageBtn'))

  // // click message button and get popup form
  // wrapper.find('#messageBtn').first().simulate('click')
  // const messageForm = wrapper.find('#messageRegisterInterestForm').first()
  // t.true(messageForm.props().visible)

  // // add message
  // const comment = messageForm.find('textarea').first()
  // comment.simulate('change', { target: { value: 'Hello message' } })
  // wrapper.update()

  // // commit the form
  // wrapper.find('#sendBtn').first().simulate('click')

  // // status change callback is called.
  // t.true(handleMessage.calledOnce)
  // t.true(handleMessage.calledWith('Hello message'))
})

test(InterestStatus.DECLINED, t => {
  const handleAccept = sinon.fake()
  const handleReject = sinon.fake()
  const handleMessage = sinon.fake()
  const realStore = makeStore(initStore)

  const wrapper = mountWithIntl(
    <Provider store={realStore}>
      <RegisterInterestItem
        interest={interests[4]}
        onAccept={handleAccept}
        onReject={handleReject}
        onMessage={handleMessage}
      />
    </Provider>
  )
  t.false(wrapper.exists('#acceptBtn'))
  t.false(wrapper.exists('#rejectBtn'))
  t.false(wrapper.exists('#messageBtn'))
})

// TODO: popconfirm requires a valid event.
// popconfirm.props().onConfirm()
// Can't get here until we
