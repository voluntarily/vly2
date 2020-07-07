import test from 'ava'
import StatisticsActivityTagsReport from '../StatisticsActivityTagsReport'
import mockFetch from 'fetch-mock'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'

test.cb('StatisticsActivityTagsReport renders properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockResponse = [{
    name: 'javascript',
    value: 45
  }, {
    name: 'golang',
    value: 32
  }]

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/activityTags/${orgId}/${timeframe}`, { body: mockResponse })
  global.fetch = mockServer

  const wrapper = mountWithIntl(<StatisticsActivityTagsReport orgId={orgId} timeframe={timeframe} />)
  t.true(wrapper.exists())

  // needed to wait for fetch promises to resolve
  setTimeout(() => {
    // sync wrapper state
    wrapper.update()

    // verify mocked fetch endpoint has been called
    t.true(mockServer.done())

    // verify data is rendered properly
    t.true(wrapper.findWhere(n => n.text() === 'What did they do?').exists())

    // end of the test
    t.pass()
    t.end()
  }, 0)
})

test.cb('StatisticsActivityTagsReport renders error message properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/activityTags/${orgId}/${timeframe}`, { status: 500 })
  global.fetch = mockServer

  const wrapper = mountWithIntl(<StatisticsActivityTagsReport orgId={orgId} timeframe={timeframe} />)
  t.true(wrapper.exists())

  // needed to wait for fetch promises to resolve
  setTimeout(() => {
    // sync wrapper state
    wrapper.update()

    // verify mocked fetch endpoint has been called
    t.true(mockServer.done())

    // verify data is rendered properly
    t.true(wrapper.findWhere(n => n.text() === 'Activity tags information currently unavailable. Please try again later.').exists())

    // end of the test
    t.pass()
    t.end()
  }, 0)
})

test('StatisticsActivityTagsReport renders loading properly', t => {
  const orgId = 'abcd'
  const timeframe = 'year'

  const mockResponse = [{
    name: 'javascript',
    value: 45
  }, {
    name: 'golang',
    value: 32
  }]

  const mockServer = mockFetch.sandbox()
  mockServer.get(`/api/statistics/activityTags/${orgId}/${timeframe}`, { body: mockResponse })
  global.fetch = mockServer

  const wrapper = mountWithIntl(<StatisticsActivityTagsReport orgId={orgId} timeframe={timeframe} />)

  t.true(wrapper.exists())
  t.true(wrapper.find('LoadSpinner').exists())
})
