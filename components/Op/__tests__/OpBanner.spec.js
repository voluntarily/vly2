import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import OpBanner from '../OpBanner'
import ops from './Op.fixture'
import moment from 'moment'

test.before('Setup fixtures', (t) => {
  // Initial opportunities
  t.context.ops = ops
  t.context.op = ops[0]
})

test('Banner for op with no date', t => {
  const op = t.context.ops[0]
  const wrapper = shallowWithIntl(
    <OpBanner op={op}>
      <p>child</p>
    </OpBanner>
  )
  const img = wrapper.find('ItemList__ItemImage').first()
  t.true(wrapper.exists('ItemList__ItemImage'))
  t.is(img.props().src, op.imgUrl)
  t.is(wrapper.find('ItemDate').props().startDate, 'Negotiable')
})

test('Banner for op with open date', t => {
  const op = t.context.ops[1]
  const wrapper = shallowWithIntl(
    <OpBanner op={op}>
      <p>child</p>
    </OpBanner>
  )
  t.true(wrapper.find('h1').text().includes(op.name))
  t.is(wrapper.find('ItemDuration').props().duration, op.duration)
  const dateStr = moment(op.date[0]).format('h:mmA · ddd DD/MM/YY')
  t.is(wrapper.find('ItemDate').props().startDate, dateStr)
})

test('Banner for op with date range', t => {
  const op = t.context.ops[2]
  const wrapper = shallowWithIntl(
    <OpBanner op={op}>
      <p>child</p>
    </OpBanner>
  )
  const img = wrapper.find('ItemList__ItemImage').first()
  t.true(wrapper.exists('ItemList__ItemImage'))
  t.is(img.props().src, op.imgUrl)
  t.true(wrapper.find('h1').text().includes(op.name))
  t.is(wrapper.find('ItemDuration').props().duration, op.duration)
  const startDateStr = moment(op.date[0]).format('h:mmA · ddd DD/MM/YY')
  const endDateStr = moment(op.date[1]).format('  →  h:mmA · ddd DD/MM/YY')

  t.is(wrapper.find('ItemDate').props().startDate, startDateStr)
  t.is(wrapper.find('ItemDate').props().endDate, endDateStr)
})
