import test from 'ava'
import { Provider } from 'react-redux'
import fetchMock from 'fetch-mock'

import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import OpListSection from '../OpListSection'
import reduxApi from '../../../lib/redux/reduxApi'
import { makeStoreTest } from '../../../lib/redux/store'
import adapterFetch from 'redux-api/lib/adapters/fetch'
import DatePickerType from '../DatePickerType.constant'
import { API_URL } from '../../../lib/callApi'
import ops, { orgActionWhizzyFelt, orgOmgTech } from './Op.fixture'

const opsWithOpenEndDate = [
  ...ops,
  {
    ...ops[0],
    date: [
      {
        $date: '2019-05-23T12:26:18.000Z'
      },
      null
    ]
  }
]

const initStore = {
  opportunities: {
    loading: false,
    data: []
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
  const realStore = makeStoreTest(initStore)
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

test.serial('mount the list for Action Whizzy Felt should filtered three ops offered by that organization', async t => {
  t.plan(2)
  const org = orgActionWhizzyFelt._id
  const realStore = makeStoreTest(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/`
  myMock.getOnce(api, ops)
  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection org={org} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 3) // there are only four  cards for org
  t.truthy(myMock.done())
  myMock.restore()
})

test.serial('mount the list for OMGTech should filtered one ops offered by that organization', async t => {
  t.plan(2)
  const org = orgOmgTech._id
  const realStore = makeStoreTest(initStore)
  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/`
  myMock.getOnce(api, ops)
  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection org={org} />
    </Provider>
  )
  await sleep(1) // allow asynch fetch to complete
  wrapper.update()
  t.is(wrapper.find('OpCard').length, 1) // there are only four  cards for org
  t.truthy(myMock.done())
  myMock.restore()
})
test.serial('mount the list with ops search with results', async t => {
  const realStore = makeStoreTest(initStore)
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
  const realStore = makeStoreTest(initStore)
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
  const realStore = makeStoreTest(initStore)
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
  const realStore = makeStoreTest(initStore)
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
  const realStore = makeStoreTest(initStore)
  const monthFilterValue = {
    date: [ops[0].date[0]] // Confusing but basically this will create an array of 1 element from the first element of the ops array
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
  const realStore = makeStoreTest(initStore)
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
  const realStore = makeStoreTest(initStore)

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
  const realStore = makeStoreTest(initStore)

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
  const realStore = makeStoreTest(initStore)

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

test.serial('Test sort by name', async t => {
  const realStore = makeStoreTest(initStore)

  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=Growing`
  myMock.getOnce(api, ops)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' orderby='name' />
    </Provider>
  )
  await sleep(1)
  wrapper.update()
  // Checking first and last name in opcard list
  t.is(wrapper.find('OpCard').first().text().includes('1 Mentor'), true)
  t.is(wrapper.find('OpCard').last().text().includes('5 Going'), true)
  t.truthy(myMock.done())
  myMock.restore()
})
test.serial('Test sort by date', async t => {
  try {
    const realStore = makeStoreTest(initStore)

    const myMock = fetchMock.sandbox()
    reduxApi.use('fetch', adapterFetch(myMock))
    const api = `${API_URL}/opportunities/?search=Growing`

    const opsModified = ops.map((op, index) => {
      if (index === 0) {
        op.date = ['2019-11-22T10:15:38.972Z', '2019-11-23T10:15:59.110Z']
      } else if (index === 1) {
        op.date = [null, 'undefined']
      } else if (index === 2) {
        op.date = [null, '2019-11-25T10:21:12.614Z']
      } else if (index === 3) {
        op.date[0] = '2019-11-28T10:23:24.823Z'
        delete op.date[1]
      }
      return op
    })
    myMock.getOnce(api, opsModified)

    const wrapper = await mountWithIntl(
      <Provider store={realStore}>
        <OpListSection search='Growing' orderby='date' />
      </Provider>
    )
    await sleep(1)
    wrapper.update()
    // Checking first and last name of an opportunity in opcard list based on their dates
    t.is(wrapper.find('OpCard').at(0).text().includes('1 Mentor a year 12 business Impact Project'), true)
    t.is(wrapper.find('OpCard').at(4).text().includes('4 The first 100 metres'), true)
    t.truthy(myMock.done())
    myMock.restore()
  } catch (e) {
    console.error(e)
  }
})
test.serial('Test sort by commitment', async t => {
  const realStore = makeStoreTest(initStore)

  const myMock = fetchMock.sandbox()
  reduxApi.use('fetch', adapterFetch(myMock))
  const api = `${API_URL}/opportunities/?search=Growing`
  myMock.getOnce(api, ops)

  const wrapper = await mountWithIntl(
    <Provider store={realStore}>
      <OpListSection search='Growing' orderby='commitment' />
    </Provider>
  )
  await sleep(1)
  wrapper.update()
  // Checking first and last duration in opcard list. The oplist is sorted from low to high, i.e short to long
  // should put #3 15 mins before #2 at 4 hours
  t.is(wrapper.find('OpCard').at(1).text().includes('3 Growing in the garden'), true)
  t.is(wrapper.find('OpCard').at(2).text().includes('2 Self driving model cars'), true)
  t.truthy(myMock.done())
  myMock.restore()
})
