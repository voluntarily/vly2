import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import RegisterInterestSection from '../RegisterInterestSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'

import { API_URL } from '../../../lib/callApi'
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
    comment: "I'm Interested",
    status: 'interested'
  }
]

test.serial('mount RegisterInterestSection with with no existing interest', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const getmyinterests = `${API_URL}/interests/?op=${opid}&me=${meid}`
  myMock.getOnce(getmyinterests, [])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <RegisterInterestSection
        op={opid}
        meID={meid}
      />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // we should see "i'm interested"
  t.is(wrapper.find('button').first().text(), "I'm Interested")
  wrapper.find('button').first().simulate('click')
  t.is(wrapper.find('h1').first().text(), 'How do you want to get involved?')

  const postnewinterest = `${API_URL}/interests/`
  myMock.postOnce(postnewinterest, interests[0])

  // fill in comment on input field
  const comment = wrapper.find('#register_interest_form_comment').first()
  comment.simulate('change', { target: { value: 'Test mount RegisterInterestSection with with no existing interest' } })
  const checkbox = wrapper.find({ type: 'checkbox' }).last()
  checkbox.simulate('change', { target: { checked: 'true' } })

  wrapper.find('button').first().simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('h1').first().text(), 'Thank you for expressing your interest!')

  // press Get Involved! button
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('mount RegisterInterestSection with op and me', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const getmyinterests = `${API_URL}/interests/?op=${opid}&me=${meid}`
  myMock.getOnce(getmyinterests, interests[0])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <RegisterInterestSection
        op={opid}
        meID={meid}
      />
    </Provider>
  )
  // before api completes the loading spinner should show.
  t.is(wrapper.find('img').prop('src'), '/static/loading.svg')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  // once loading completed should the thank you note
  t.is(wrapper.find('h1').first().text(), 'Thank you for expressing your interest!')
  t.truthy(myMock.done())
  myMock.restore()
})

// showing status
