import test from 'ava'
import StatisticsRatingsReport from '../StatisticsRatingsReport'
import mockFetch from 'fetch-mock'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

const mockResponse = [
  {
    name: 1,
    value: 1
  },
  {
    name: 2,
    value: 1
  },
  {
    name: 3,
    value: 1
  },
  {
    name: 4,
    value: 1
  },
  {
    name: 5,
    value: 1
  }
]

test.cb('StatisticsRatingsReport renders properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/ratings/${orgId}/${timeframe}`, { body: mockResponse })
  global.fetch = mockServer

  const wrapper = mountWithIntl(<StatisticsRatingsReport orgId={orgId} timeframe={timeframe} />)
  t.true(wrapper.exists())

  // needed to wait for fetch promises to resolve
  setTimeout(() => {
    // sync wrapper state
    wrapper.update()

    // verify mocked fetch endpoint has been called
    t.true(mockServer.done())

    // verify data is rendered properly
    t.true(wrapper.findWhere(n => n.text() === 'How did they find it?').exists())

    // end of the test
    t.pass()
    t.end()
  }, 0)
})

test.cb('StatisticsRatingsReport renders error message properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/ratings/${orgId}/${timeframe}`, { status: 500 })
  global.fetch = mockServer

  const wrapper = mountWithIntl(<StatisticsRatingsReport orgId={orgId} timeframe={timeframe} />)
  t.true(wrapper.exists())

  // needed to wait for fetch promises to resolve
  setTimeout(() => {
    // sync wrapper state
    wrapper.update()

    // verify mocked fetch endpoint has been called
    t.true(mockServer.done())

    // verify data is rendered properly
    t.true(wrapper.findWhere(n => n.text() === 'Ratings information currently unavailable. Please try again later.').exists())

    // end of the test
    t.pass()
    t.end()
  }, 0)
})

test('StatisticsRatingsReport renders loading properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/ratings/${orgId}/${timeframe}`, { body: mockResponse })
  global.fetch = mockServer

  const wrapper = mountWithIntl(<StatisticsRatingsReport orgId={orgId} timeframe={timeframe} />)

  t.true(wrapper.exists())
  t.true(wrapper.find('LoadSpinner').exists())
})
