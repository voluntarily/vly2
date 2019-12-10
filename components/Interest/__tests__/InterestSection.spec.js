import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import InterestSection from '../InterestSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import people from '../../../server/api/person/__tests__/person.fixture'
import { API_URL } from '../../../lib/callApi'

const { fetchMock } = require('fetch-mock')

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
    status: 'interested'
  },
  {
    _id: '5cc903e5f94141437622cea9',
    person: people[1],
    opportunity: ops[0],
    comment: 'Hi dali',
    status: 'invited'
  }

]

const invitedAndrew = {
  _id: interestid,
  person: people[0],
  opportunity: ops[0],
  comment: "I'm Andrew",
  status: 'invited'
}
const declinedAndrew = {
  _id: interestid,
  person: people[0],
  opportunity: ops[0],
  comment: "I'm Andrew",
  status: 'declined'
}

const initStore = {
  interests: {
    loading: false,
    data: []
  }
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test('mount the InterestSection with two interests', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock.getOnce(`${API_URL}/interests/?op=${opid}`, interests)
  myMock.putOnce(`${API_URL}/interests/${interestid}`, invitedAndrew)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <InterestSection opid={opid} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('tbody tr').length, 2)
  t.regex(wrapper.find('tbody tr td').at(1).text(), /avowkind/)
  t.regex(wrapper.find('tbody tr').at(1).find('td').at(1).text(), /Dali/)

  // test invite button
  const invitebutton = wrapper.find('tbody tr').first().find('button').first()
  invitebutton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // test withdraw invite button
  const withdrawbutton = wrapper.find('tbody tr').first().find('button').first()
  t.is(withdrawbutton.text(), 'Withdraw Invite')
  myMock.restore()
  myMock.putOnce(`${API_URL}/interests/${interestid}`, interests[0])
  withdrawbutton.simulate('click')

  // test decline button
  myMock.restore()
  myMock.putOnce(`${API_URL}/interests/${interestid}`, declinedAndrew)

  const declinebutton = wrapper.find('tbody tr').first().find('button').at(1)
  t.is(declinebutton.text(), 'Decline')
  declinebutton.simulate('click')

  // // TODO: fix throw of rejected promise at this point
  // popconfirm.props().onConfirm(interests[0])
  // await sleep(1) // allow asynch fetch to complete
  // wrapper.update()
  // const status = wrapper.find('tbody tr').first().find('td').at(2).text()
  // t.truthy(myMock.done())
  myMock.restore()
})
