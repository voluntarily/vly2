import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import OpListSection from '../OpListSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import DatePickerType from '../DatePickerType.constant'

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
    status: 'draft',
    date: [
      {
        '$date': '2019-05-23T12:26:18.000Z' // Fri, 24 May 2019 00:26:18 NZST
      },
      {
        '$date': '2019-06-12T04:55:10.014Z' // Wed, 12 Jun 2019 16:55:10 NZST
      }
    ]
  },
  {
    _id: '5cc903e5f94141437622ce87',
    title: 'The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    location: 'Albany, Auckland',
    status: 'done',
    date: [
      {
        '$date': '2019-05-23T12:26:18.000Z' // Fri, 24 May 2019 00:26:18 NZST
      },
      {
        '$date': '2019-06-12T04:55:10.014Z' // Wed, 12 Jun 2019 16:55:10 NZST
      }
    ]
  }
]

const initStore = {
  opportunities: {
    loading: false,
    data: [ ]
  }
}
const filterDateState = {
  date: ['2019-07-16T08:04:02.793Z'] // Tue, 16 Jul 2019 01:04:02
}

const emptyFilterDateState = {
  date: []
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

test.serial('mount the list with ops', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/`
  myMock.getOnce(api, ops)
  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection handleShowOp={() => {}} handleDeleteOp={() => {}} filter={emptyFilterDateState} dateFilterType={DatePickerType.IndividualDate} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 2) // there are two cards on the screen
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('mount the list with ops search with results', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=Growing`
  myMock.getOnce(api, ops)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' handleShowOp={() => {}} handleDeleteOp={() => {}} filter={emptyFilterDateState} dateFilterType={DatePickerType.IndividualDate} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 2) // there are two cards on the screen
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('mount the list with ops search with no results', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=NoSuchItem`
  myMock.getOnce(api, [])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='NoSuchItem' handleShowOp={() => {}} handleDeleteOp={() => {}} filter={filterDateState} dateFilterType={DatePickerType.IndividualDate} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 0) // there are two cards on the screen
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('mount the list with ops query and search', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=100&q=%7B'status'%3A'done'%7D`
  myMock.getOnce(api, [ops[1]])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='100' query={'{\'status\':\'done\'}'} handleShowOp={() => {}} handleDeleteOp={() => {}} filter={emptyFilterDateState} dateFilterType={DatePickerType.IndividualDate} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 1) // there are two cards on the screen
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('test filter by date is called, no op is shown', async t => {
  const realStore = makeStore(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=Growing`
  myMock.get(api, [ops[0]])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' location='' handleShowOp={() => {}} handleDeleteOp={() => {}} filter={filterDateState} dateFilterType={DatePickerType.IndividualDate} />
    </Provider>
  )
  await sleep(2) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 0) // there are no cards on the screen
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('test filter by month is called. There is 1 OP shown', async t => {
  const realStore = makeStore(initStore)
  const monthFilterValue = {
    date: [ ops[0].date[0] ] // Confusing but basically this will create an array of 1 element from the first element of the ops array
  }
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=Growing`
  myMock.getOnce(api, [ops[0]])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' location='' handleShowOp={() => {}} handleDeleteOp={() => {}} filter={monthFilterValue} dateFilterType={DatePickerType.MonthRange} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 1) // there should be one cards on the screen because it's the same month
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('test filter by week is called. No opportunities shown', async t => {
  const realStore = makeStore(initStore)
  const monthFilterValue = {
    date: [
      '2019-03-02T00:00:00+00:00', // Sat, 02 Mar 2019 00:00:00
      '2019-03-02T00:00:00+00:00' // Sat, 02 Mar 2019 00:00:00
    ]
  }
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=Growing`
  myMock.getOnce(api, [ops[0]])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' location='' handleShowOp={() => {}} handleDeleteOp={() => {}} filter={monthFilterValue} dateFilterType={DatePickerType.WeekRange} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 0)
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('Test filter by date range. No opportunities shown', async t => {
  const realStore = makeStore(initStore)
  const dateRangeFilterValue = {
    date: [
      '2019-03-02T00:00:00+00:00', // Sat, 02 Mar 2019 00:00:00
      '2019-03-02T00:00:00+00:00' // Sat, 02 Mar 2019 00:00:00
    ]
  }
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=Growing`
  myMock.getOnce(api, [ops[0]])

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' location='' handleShowOp={() => {}} handleDeleteOp={() => {}} filter={dateRangeFilterValue} dateFilterType={DatePickerType.DateRange} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 0)
  t.truthy(myMock.done())
  myMock.restore()
})
