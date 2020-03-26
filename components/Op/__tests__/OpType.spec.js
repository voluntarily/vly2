import React from 'react'
import test from 'ava'
import { mountWithIntl } from '../../../lib/react-intl-test-helper'
import { OpTypeStamp, OpType, OpTypeCount, OpCommitment } from '../OpType'
import { OpportunityType } from '../../../server/api/opportunity/opportunity.constants'

test('render OpTypeStamp for ask op', t => {
  const wrapper = mountWithIntl(
    <OpTypeStamp
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.find('span').length, 1)
  t.is(wrapper.find('span').text(), 'needs help with')
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
  t.is(wrapper.text(), 'can help you with')
})

test('render OpType with no type', t => {
  const wrapper = mountWithIntl(
    <OpType />
  )
  t.is(wrapper.text(), '')
})

test('render OpTypeCount for offer op', t => {
  const wrapper = mountWithIntl(
    <OpTypeCount
      counts={{ ask: 5, offer: 2 }}
      type={OpportunityType.OFFER}
    />
  )
  t.is(wrapper.text(), '💁🏻2 offering to help')
})
test('render OpTypeCount for ask op', t => {
  const wrapper = mountWithIntl(
    <OpTypeCount
      counts={{ ask: 5, offer: 2 }}
      type={OpportunityType.ASK}
    />
  )
  t.is(wrapper.text(), '🙋5 asking for help')
})
test('render OpTypeCount with no type', t => {
  const wrapper = mountWithIntl(
    <OpTypeCount />
  )
  t.is(wrapper.text(), '')
})

test('render OpCommitment ', t => {
  const wrapper = mountWithIntl(
    <OpCommitment duration='4 hours' />
  )
  t.is(wrapper.text(), '⏱4 hours commitment')
})

test('render OpCommitment with no type', t => {
  const wrapper = mountWithIntl(
    <OpCommitment />
  )
  t.is(wrapper.text(), '')
})
