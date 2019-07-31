import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import RegisterMemberSection from '../RegisterMemberSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'

import { API_URL } from '../../../lib/apiCaller'
import people from '../../../server/api/person/__tests__/person.fixture'

const { fetchMock } = require('fetch-mock')

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Initial oppotunity to be added into the test db
people[0]._id = '5cc903e5f94141437622cea0' // volunteer
people[1]._id = '5cc903e5f94141437622cea1' // requestor
const meid = people[0]._id
const opid = '5cc903e5f94141437622cea7'
const ops = [
  {
    _id: opid,
    title: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    requestor: people[1],
    tags: [],
    status: 'active'
  }
]

const initStore = {
  opportunities: {
    loading: false,
    data: ops
  },
  members: {
    loading: false,
    data: []
  }
}

const members = [
  {
    _id: '5cc903e5f94141437622ceaa',
    person: people[0],
    organisation: ops[0],
    validation: "I'm Membered",
    status: 'membered'
  }
]

test.serial('mount RegisterMemberSection with with no existing member', async t => {
  //   console.log(people[0])
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const getmymembers = `${API_URL}/members/?op=${opid}&me=${meid}`
  myMock.getOnce(getmymembers, [])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <RegisterMemberSection
        op={opid}
        meID={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  t.is(wrapper.find('.loader').first().text(), 'Loading...')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // we should see "i'm membered"
  t.is(wrapper.find('button').first().text(), "I'm Membered")
  wrapper.find('button').first().simulate('click')
  t.is(wrapper.find('h1').first().text(), 'How do you want to get involved?')

  const postnewmember = `${API_URL}/members/`
  myMock.postOnce(postnewmember, members[0])

  // fill in validation on input field
  const validation = wrapper.find('#register_member_form_validation').first()
  validation.simulate('change', { target: { value: 'Test mount RegisterMemberSection with with no existing member' } })
  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('h1').first().text(), 'Thank you for expressing your member!')

  // press Get Involved! button
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('mount RegisterMemberSection with op and me', async t => {
  //   console.log(people[0])
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const getmymembers = `${API_URL}/members/?op=${opid}&me=${meid}`
  myMock.getOnce(getmymembers, members[0])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <RegisterMemberSection
        op={opid}
        meID={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  t.is(wrapper.find('.loader').first().text(), 'Loading...')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // once loading completed should the thank you note
  t.is(wrapper.find('h1').first().text(), 'Thank you for expressing your member!')
  t.truthy(myMock.done())
  myMock.restore()
})

// showing status
