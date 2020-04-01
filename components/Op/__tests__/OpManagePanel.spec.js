import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import { OpManagePanel } from '../OpManagePanel'
import { OpportunityStatus } from '../../../server/api/opportunity/opportunity.constants'

test('render OpManagePanel for active op', t => {
  const op = {
    _id: 'fakeid',
    name: 'Test Opportunity',
    status: OpportunityStatus.ACTIVE
  }
  const wrapper = shallowWithIntl(<OpManagePanel op={op} />)
  t.is(wrapper.find('h2').first().find('FormattedMessage').props().id, 'interestSection.ask.name')
  t.true(wrapper.exists('InterestSection'))
  t.true(wrapper.exists('Connect(OpCloseOpportunity)'))
})

test('render OpManagePanel for completed op', t => {
  const op = {
    _id: 'fakeid',
    name: 'Test Opportunity',
    status: OpportunityStatus.COMPLETED
  }
  const wrapper = shallowWithIntl(<OpManagePanel op={op} />)
  t.is(wrapper.find('h2').first().find('FormattedMessage').props().id, 'interestSection.ask.name')
  t.true(wrapper.exists('InterestArchivedSection'))
})
