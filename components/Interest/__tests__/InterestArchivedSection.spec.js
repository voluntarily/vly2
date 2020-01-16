import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import InterestArchivedSection from '../InterestArchivedSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import people from '../../../server/api/person/__tests__/person.fixture'
import { API_URL } from '../../../lib/callApi'
import mongoose from 'mongoose'
import fetchMock from 'fetch-mock'

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

const interests = [
  {
    _id: '5cc903e5f94141437622cea8',
    person: people[0],
    opportunity: ops[0],
    comment: "I'm Andrew",
    status: 'committed'
  },
  {
    _id: '5cc903e5f94141437622cea9',
    person: people[1],
    opportunity: ops[0],
    comment: 'Hi dali',
    status: 'committed'
  }

]

const markAndrewAsPresent = {
  _id: '5cc903e5f94141437622cea8',
  person: people[0],
  opportunity: ops[0],
  comment: "I'm Andrew",
  status: 'attended'
}
const markAndrewAsAbsent = {
  _id: '5cc903e5f94141437622cea8',
  person: people[0],
  opportunity: ops[0],
  comment: "I'm Andrew",
  status: 'not attended'
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

test.serial('mount the InterestSection with two interests', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock.getOnce(`${API_URL}/interestsArchived/?op=${opid}`, interests)
  myMock.putOnce(`${API_URL}/interestsArchived/${interests[0]._id}`, markAndrewAsPresent)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <InterestArchivedSection opid={opid} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('h2').text(), 'Volunteers') // there are two cards on the screen
  t.is(wrapper.find('tbody tr').length, 2)
  t.is(wrapper.find('tbody tr td').at(0).text().trim(), people[0].nickname)
  t.is(wrapper.find('tbody tr td').at(1).text().trim(), interests[0].comment)
  t.is(wrapper.find('tbody tr td').at(2).text().trim(), interests[0].status)
  t.is(wrapper.find('tbody tr').at(1).find('td').at(0).text().trim(), people[1].nickname)
  t.is(wrapper.find('tbody tr').at(1).find('td').at(1).text().trim(), interests[1].comment)
  t.is(wrapper.find('tbody tr').at(1).find('td').at(2).text().trim(), interests[1].status)

  // test Attended button
  const attendbutton = wrapper.find('tbody tr').first().find('button').first()
  t.is(attendbutton.text(), 'Attended')
  attendbutton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('tbody tr td').at(2).text().trim(), 'attended')

  // test Not Attended invite button
  const notattendbutton = wrapper.find('tbody tr').first().find('button').first()
  t.is(notattendbutton.text(), 'Not Attended')
  myMock.restore()
  myMock.putOnce(`${API_URL}/interestsArchived/${interests[0]._id}`, markAndrewAsAbsent)
  notattendbutton.simulate('click')
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('tbody tr td').at(2).text().trim(), 'not attended')
})

test.serial('mount the InterestSection with no interests', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  const fakeObjectId = mongoose.Types.ObjectId().toString()
  reduxApi.use('fetch', adapterFetch(myMock))
  myMock.getOnce(`${API_URL}/interestsArchived/?op=${fakeObjectId}`, [])
  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <InterestArchivedSection opid={fakeObjectId} />
    </Provider>
  )
  t.is(wrapper.find('p').text(), 'No Data')
})
