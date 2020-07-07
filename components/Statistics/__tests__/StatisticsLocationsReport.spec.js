import test from 'ava'
import StatisticsLocationsReport from '../StatisticsLocationsReport'
import mockFetch from 'fetch-mock'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

test.cb('StatisticsLocationsReport renders properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockResponse = [{
    name: 'auckland',
    value: 45
  }, {
    name: 'wellington',
    value: 32
  }]

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/locations/${orgId}/${timeframe}`, { body: mockResponse })
  global.fetch = mockServer

  const wrapper = mountWithIntl(<StatisticsLocationsReport orgId={orgId} timeframe={timeframe} />)
  t.true(wrapper.exists())

  // needed to wait for fetch promises to resolve
  setTimeout(() => {
    // sync wrapper state
    wrapper.update()

    // verify mocked fetch endpoint has been called
    t.true(mockServer.done())

    // verify data is rendered properly
    t.true(wrapper.findWhere(n => n.text() === 'Where did volunteers help?').exists())

    // end of the test
    t.pass()
    t.end()
  }, 0)
})

test.cb('StatisticsLocationsReport renders error message properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/locations/${orgId}/${timeframe}`, { status: 500 })
  global.fetch = mockServer

  const wrapper = mountWithIntl(<StatisticsLocationsReport orgId={orgId} timeframe={timeframe} />)
  t.true(wrapper.exists())

  // needed to wait for fetch promises to resolve
  setTimeout(() => {
    // sync wrapper state
    wrapper.update()

    // verify mocked fetch endpoint has been called
    t.true(mockServer.done())

    // verify data is rendered properly
    t.true(wrapper.findWhere(n => n.text() === 'Locations information currently unavailable. Please try again later.').exists())

    // end of the test
    t.pass()
    t.end()
  }, 0)
})

test('StatisticsLocationsReport renders loading properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockResponse = {
    totalVolunteers: 5,
    totalHours: 150.25,
    avgHoursPerVolunteer: 30.05
  }

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/locations/${orgId}/${timeframe}`, { body: mockResponse })
  global.fetch = mockServer

  const wrapper = mountWithIntl(<StatisticsLocationsReport orgId={orgId} timeframe={timeframe} />)

  t.true(wrapper.exists())
  t.true(wrapper.find('LoadSpinner').exists())
})
