import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'
import OpBanner from '../OpBanner'
import ops from './Op.fixture'
import withMockRoute from '../../../server/util/mockRouter'

test.before('Setup fixtures', (t) => {
  // Initial opportunities
  t.context.ops = ops
  t.context.op = ops[0]
})

test('Banner for op with no date', t => {
  const op = t.context.ops[0]
  const RoutedOpBanner = withMockRoute(OpBanner)
  const outer = shallowWithIntl(
    <RoutedOpBanner op={op}>
      <p>child</p>
    </RoutedOpBanner>
  )
  const wrapper = outer.dive().dive()
  const img = wrapper.find('ItemList__ItemImage').first()
  t.true(wrapper.exists('ItemList__ItemImage'))
  t.is(img.props().src, op.imgUrl)
  t.is(wrapper.find('ItemList__Right').find('h1').text(), op.name)
  t.is(wrapper.find('ItemDuration').props().duration, op.duration)
  t.is(wrapper.find('ItemDate').props().startDate, 'Negotiable')
})

test('Banner for op with open date', t => {
  const op = t.context.ops[1]
  const RoutedOpBanner = withMockRoute(OpBanner)
  const outer = shallowWithIntl(
    <RoutedOpBanner op={op}>
      <p>child</p>
    </RoutedOpBanner>
  )
  const wrapper = outer.dive().dive()
  t.is(wrapper.find('ItemList__Right').find('h1').text(), op.name)
  t.is(wrapper.find('ItemDuration').props().duration, op.duration)
  t.is(wrapper.find('ItemDate').props().startDate, '12:26AM · Fri 24/05/19')
})

test('Banner for op with date range', t => {
  const op = t.context.ops[2]
  const RoutedOpBanner = withMockRoute(OpBanner)
  const outer = shallowWithIntl(
    <RoutedOpBanner op={op}>
      <p>child</p>
    </RoutedOpBanner>
  )
  const wrapper = outer.dive().dive()
  const img = wrapper.find('ItemList__ItemImage').first()
  t.true(wrapper.exists('ItemList__ItemImage'))
  t.is(img.props().src, op.imgUrl)
  t.is(wrapper.find('ItemList__Right').find('h1').text(), op.name)
  t.is(wrapper.find('ItemDuration').props().duration, op.duration)
  t.is(wrapper.find('ItemDate').props().startDate, '12:26AM · Fri 24/05/19')
  t.is(wrapper.find('ItemDate').props().endDate, '  →  4:55PM · Wed 12/06/2019')
})
