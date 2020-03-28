import test from 'ava' // only available in node ^12.7.0
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import { act } from 'react-dom/test-utils'
import fetchMock from 'fetch-mock'

import sinon from 'sinon'
import Summary from '../../pages/reports/summary'
import { OpportunityType } from '../../server/api/opportunity/opportunity.constants'

test.before('Setup summary fixture', (t) => {
  const summary = {
    Person: { total: 10 },
    Opportunity: { total: 20, [OpportunityType.ASK]: 30, [OpportunityType.OFFER]: 40 },
    Interest: { total: 30 },
    Activity: { total: 40 }
  }

  t.context.summary = summary
})

test.beforeEach(t => {
  t.context.mockServer = fetchMock.sandbox()
  global.fetch = t.context.mockServer
  t.context.cls = console.error
  console.error = sinon.spy()
})

test.afterEach(t => {
  fetchMock.reset()
  console.error = t.context.cls
})

test.skip('render Summary with mocked data (SKIPPED until isAdmin can be stubbed without Redux)', async t => {
  const props = {
    isAuthenticated: true,
    isAdmin: true
  }
  t.context.mockServer.get('end:/api/reports/summary', { body: t.context.summary })

  const wrapper = mountWithIntl(<Summary {...props} />)

  t.is(wrapper.find('h1').first().text(), 'Summary Report')
  await act() // Wait for hooks to complete
  wrapper.update()

  t.is(wrapper.find('Statistic')[0].prop('label'), 'People')
  t.is(wrapper.find('Statistic')[0].prop('value'), t.context.summary.Person)
  t.is(wrapper.find('Statistic')[1].prop('label'), 'Asks')
  t.is(wrapper.find('Statistic')[1].prop('value'), t.context.summary.Opportunity.ask)
  t.is(wrapper.find('Statistic')[2].prop('label'), 'Offers')
  t.is(wrapper.find('Statistic')[2].prop('value'), t.context.summary.Opportunity.offer)
  t.is(wrapper.find('Statistic')[3].prop('label'), 'Interests')
  t.is(wrapper.find('Statistic')[3].prop('value'), t.context.summary.Interest)
  t.is(wrapper.find('Statistic')[4].prop('label'), 'Activities')
  t.is(wrapper.find('Statistic')[4].prop('value'), t.context.summary.Activity)
})
