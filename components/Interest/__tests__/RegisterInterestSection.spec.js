import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import RegisterInterestSection from '../RegisterInterestSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStoreTest } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'

import { API_URL } from '../../../lib/callApi'
import people from '../../../server/api/person/__tests__/person.fixture'
import fetchMock from 'fetch-mock'
import { InterestStatus } from '../../../server/api/interest/interest.constants'

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
    type: 'ask',
    name: 'Growing in the garden',
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
  interests: {
    loading: false,
    data: []
  }
}

const interests = [
  {
    _id: '5cc903e5f94141437622ceaa',
    person: people[0],
    opportunity: ops[0],
    messages: [],
    status: 'interested',
    termsAccepted: true
  }
]

test.serial('mount Ask RegisterInterestSection with with no existing interest', async t => {
  const realStore = makeStoreTest(initStore)

  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const getmyinterests = 'path:/api/interests/'
  myMock.getOnce(getmyinterests, [])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <RegisterInterestSection
        opid={opid}
        meid={meid}
      />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // we should see "i'm interested"
  t.is(wrapper.find('button').first().text(), 'Offer to help')
  wrapper.find('button').first().simulate('click')

  const postnewinterest = `${API_URL}/interests/`
  myMock.postOnce(postnewinterest, interests[0])

  // fill in comment on input field
  // add message
  const comment = wrapper.find('textarea').first()
  comment.simulate('change', { target: { value: 'Test mount RegisterInterestSection with with no existing interest' } })
  wrapper.update()

  wrapper.find('#sendBtn').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()

  // press Get Involved! button
  t.truthy(myMock.done())

  // what got Posted.
  const posted = JSON.parse(myMock.lastCall()[1].body)
  t.is(posted.person, meid)
  t.is(posted.opportunity, opid)
  t.is(posted.status, InterestStatus.INTERESTED)
  t.true(posted.termsAccepted)
  myMock.restore()
})

test.serial('mount RegisterInterestSection with op and me', async t => {
  const realStore = makeStoreTest(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const getmyinterests = 'path:/api/interests/'
  myMock.getOnce(getmyinterests, interests[0])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <RegisterInterestSection
        opid={opid}
        meid={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  t.is(wrapper.find('img').prop('src'), '/static/loading.svg')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // once loading completed should the thank you note
  t.is(wrapper.find('h4').first().text(), "You've offered to help, Dali will get back to you soon!")
  t.truthy(myMock.done())
  myMock.restore()
})
