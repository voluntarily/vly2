import test from 'ava'
import StatisticsSummaryReport from '../StatisticsSummaryReport'
import mockFetch from 'fetch-mock'
import { mount } from 'enzyme'

test.cb('StatisticsSummaryReport renders properly', t => {
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
