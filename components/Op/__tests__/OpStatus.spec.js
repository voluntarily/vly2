import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { OpStatusStamp, OpStatus } from '../OpStatus'
import { OpportunityStatus } from '../../../server/api/opportunity/opportunity.constants'

test('render OpStatusStamp for draft op', t => {
  const wrapper = mountWithIntl(
    <OpStatusStamp
      status={OpportunityStatus.DRAFT}
    />
  )
  t.is(wrapper.find('span').length, 1)
  t.is(wrapper.find('span').text(), 'Draft')
})

test('render OpStatusStamp for active op', t => {
  const wrapper = mountWithIntl(
    <OpStatusStamp
      status={OpportunityStatus.ACTIVE}
    />
  )
  t.is(wrapper.find('span').length, 0)
})
test('render OpStatusStamp for no state', t => {
  const wrapper = mountWithIntl(
    <OpStatusStamp />
  )
  t.is(wrapper.find('span').length, 0)
})
test('render OpStatusStamp for invalid state', t => {
  const wrapper = mountWithIntl(
    <OpStatusStamp state='INVALID' />
  )
  t.is(wrapper.find('span').length, 0)
})
test('render OpStatus for active op', t => {
  const wrapper = mountWithIntl(
    <OpStatus
      status={OpportunityStatus.ACTIVE}
    />
  )
  t.is(wrapper.text(), '')
})

test('render OpStatus with no status', t => {
  const wrapper = mountWithIntl(
    <OpStatus />
  )
  t.is(wrapper.text(), '')
})
