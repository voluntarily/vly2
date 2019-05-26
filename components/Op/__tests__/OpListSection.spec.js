import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import OpListSection from '../OpListSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'

import { API_URL } from '../../../lib/apiCaller'

const { fetchMock } = require('fetch-mock')

// Initial opportunities added into test db
const ops = [
  {
    _id: '5cc903e5f94141437622cea7',
    title: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    status: 'draft'
  },
  {
    _id: '5cc903e5f94141437622ce87',
    title: 'The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    location: 'Albany, Auckland',
    status: 'draft'
  }
]

const initStore = {
  opportunities: {
    loading: false,
    data: [ ]
  }
}

const realStore = makeStore(initStore)

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test.only('mount the list with ops', async t => {
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/`
  myMock.getOnce(api, ops)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection handleShowOp={() => {}} handleDeleteOp={() => {}} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 2) // there are two cards on the screen
  myMock.restore()
})
