import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { OpTypeStamp, OpType } from '../OpType'
import { OpportunityType } from '../../../server/api/opportunity/opportunity.constants'

test('render OpTypeStamp for ask op', t => {
  const wrapper = mountWithIntl(
    <OpTypeStamp
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.find('span').length, 1)
  t.is(wrapper.find('span').text(), 'Ask')
})

test('render OpTypeStamp for offer op', t => {
  const wrapper = mountWithIntl(
    <OpTypeStamp
      type={OpportunityType.OFFER}
    />
  )
  t.is(wrapper.find('span').length, 1)
})
test('render OpTypeStamp for no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeStamp />
  )
  t.is(wrapper.find('span').length, 0)
})
test('render OpTypeStamp for invalid type', t => {
  const wrapper = mountWithIntl(
    <OpTypeStamp type='INVALID' />
  )
  t.is(wrapper.find('span').length, 0)
})
test('render OpType for offer op', t => {
  const wrapper = mountWithIntl(
    <OpType
      type={OpportunityType.OFFER}
    />
  )
  t.is(wrapper.text(), 'Offer')
})  

test('render OpType with no type', t => {
  const wrapper = mountWithIntl(
    <OpType />
  )
  t.is(wrapper.text(), '')
})
