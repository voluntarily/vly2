import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import ActListSection from '../ActListSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'

import { API_URL } from '../../../lib/callApi'
import fetchMock from 'fetch-mock'

// Initial activities added into test db
const acts = [
  {
    _id: '5cc903e5f94141437622cea7',
    name: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    status: 'draft'
  },
  {
    _id: '5cc903e5f94141437622ce87',
    name: 'The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    location: 'Albany, Auckland',
    status: 'draft'
  }
]

const initStore = {
  activities: {
    loading: false,
    data: []
  }
}

const realStore = makeStore(initStore)

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test('mount the list with acts', async t => {
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/activities/`
  myMock.getOnce(api, acts)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <ActListSection handleShowAct={() => {}} handleDeleteAct={() => {}} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('ActCard').length, 2) // there are two cards on the screen
  myMock.restore()
})
