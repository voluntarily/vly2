import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import OpListSection from '../OpListSection'
import { Provider } from 'react-redux'
import reduxApi, { makeStore } from '../../../lib/redux/reduxApi'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import DatePickerType from '../DatePickerType.constant'
import { API_URL } from '../../../lib/apiCaller'
import ops from './Op.fixture'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { InterestStatus } from '../../../server/api/interest/interest.constants'

const { fetchMock } = require('fetch-mock')

const opsWithOpenEndDate = [
  ...ops,
  {
    ...ops[0],
    date: [
      {
        '$date': '2019-05-23T12:26:18.000Z'
      },
      null
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
  date: ['2019-03-20T12:26:18.000Z', null] // Tue, 16 Jul 2019 01:04:02
}

const dateRangeFilterValue = {
  date: [
    '2019-03-02T00:00:00+00:00', // Sat, 02 Mar 2019 00:00:00
    '2019-03-02T00:00:00+00:00' // Sat, 02 Mar 2019 00:00:00
  ]
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
  t.is(wrapper.find('OpCard').length, 5) // there are five cards on the screen
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
  t.is(wrapper.find('OpCard').length, 5) // there are two cards on the screen
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
  myMock.get(api, ops)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' location='' handleShowOp={() => {}} handleDeleteOp={() => {}} filter={filterDateState} dateFilterType={DatePickerType.IndividualDate} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
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
  t.is(wrapper.find('OpCard').length, 1)
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('Test filter by date range. No opportunities shown', async t => {
  const realStore = makeStore(initStore)

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
  t.is(wrapper.find('OpCard').length, 1)
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('Test filter by date range. Filter result include open ended opportunity', async t => {
  const realStore = makeStore(initStore)

  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=Growing`
  myMock.getOnce(api, opsWithOpenEndDate)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' location='' handleShowOp={() => {}} handleDeleteOp={() => {}} filter={dateRangeFilterValue} dateFilterType={DatePickerType.DateRange} />
    </Provider>
  )

  await sleep(1)
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 3)
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('Test filter by week allow to add open end opportunity', async t => {
  const realStore = makeStore(initStore)

  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=Growing`
  myMock.getOnce(api, opsWithOpenEndDate)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' location='' handleShowOp={() => {}} handleDeleteOp={() => {}} filter={dateRangeFilterValue} dateFilterType={DatePickerType.WeekRange} />
    </Provider>
  )
  await sleep(1)
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 3) // The week value not match the available date range in the ops array. Only the open end will match
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('OpListSection should pass list of users interests to the opList', async t => {
  initStore.opportunities.data = opsWithOpenEndDate
  initStore.interests = { data: [{
    opportunity: opsWithOpenEndDate[0],
    status: InterestStatus.INTERESTED
  }] }

  const mockStore = configureStore([thunk])(initStore)

  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/`
  myMock.getOnce(api, initStore.opportunities.data)

  const wrapper = await mountWithIntl(
    <Provider store={mockStore}>
      <OpListSection store={mockStore} handleShowOp={() => {}} handleDeleteOp={() => {}} filter={emptyFilterDateState} dateFilterType={DatePickerType.WeekRange} />
    </Provider>
  )
  t.is(wrapper.find('OpList').first().props().interests, initStore.interests.data)
  myMock.restore()
})

test.serial('OpListSection should call interests api', async t => {
  initStore.opportunities.data = opsWithOpenEndDate
  const me = { _id: '123456' }
  const mockStore = configureStore([thunk])(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/`
  myMock.getOnce(api, initStore.opportunities.data)
  myMock.getOnce(`${API_URL}/interests?me=${me}`, {})

  await mountWithIntl(
    <Provider store={mockStore}>
      <OpListSection me={me} handleShowOp={() => {}} handleDeleteOp={() => {}} filter={emptyFilterDateState} dateFilterType={DatePickerType.WeekRange} />
    </Provider>
  )

  t.is(mockStore.getActions().filter((x) => x.type === '@@redux-api@interests').length, 1)
  myMock.restore()
})
