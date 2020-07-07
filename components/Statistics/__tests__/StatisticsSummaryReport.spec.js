import test from 'ava'
import StatisticsSummaryReport from '../StatisticsSummaryReport'
import mockFetch from 'fetch-mock'
import { mount } from 'enzyme'

test.cb('StatisticsSummaryReport renders data properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockResponse = {
    totalVolunteers: 5,
    totalHours: 150.25,
    avgHoursPerVolunteer: 30.05
  }

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/summary/${orgId}/${timeframe}`, { body: mockResponse })
  global.fetch = mockServer

  const wrapper = mount(<StatisticsSummaryReport orgId={orgId} timeframe={timeframe} />)
  t.true(wrapper.exists())

  // needed to wait for fetch promises to resolve
  setTimeout(() => {
    // sync wrapper state
    wrapper.update()

    // verify mocked fetch endpoint has been called
    t.true(mockServer.done())

    // verify data is rendered properly
    t.true(wrapper.findWhere(n => n.text() === '5').exists())
    t.true(wrapper.findWhere(n => n.text() === '150.3').exists())
    t.true(wrapper.findWhere(n => n.text() === '30.1').exists())

    // end of the test
    t.pass()
    t.end()
  }, 0)
})

test.cb('StatisticsSummaryReport renders error message properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/summary/${orgId}/${timeframe}`, { status: 500 })
  global.fetch = mockServer

  const wrapper = mount(<StatisticsSummaryReport orgId={orgId} timeframe={timeframe} />)
  t.true(wrapper.exists())

  // needed to wait for fetch promises to resolve
  setTimeout(() => {
    // sync wrapper state
    wrapper.update()

    // verify mocked fetch endpoint has been called
    t.true(mockServer.done())

    // verify data is rendered properly
    t.true(wrapper.findWhere(n => n.text() === 'Summary information currently unavailable. Please try again later.').exists())

    // end of the test
    t.pass()
    t.end()
  }, 0)
})

test('StatisticsSummaryReport renders loading properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockResponse = {
    totalVolunteers: 5,
    totalHours: 150.25,
    avgHoursPerVolunteer: 30.05
  }

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/summary/${orgId}/${timeframe}`, { body: mockResponse })
  global.fetch = mockServer

  const wrapper = mount(<StatisticsSummaryReport orgId={orgId} timeframe={timeframe} />)

  t.true(wrapper.exists())
  t.true(wrapper.find('LoadSpinner').exists())
})
