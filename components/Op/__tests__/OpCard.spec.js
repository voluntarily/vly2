import React from 'react'
import test from 'ava'
import { shallowWithIntl, mountWithIntl } from '../../../lib/react-intl-test-helper'
import OpCard from '../OpCard'
import ops from './Op.fixture'

test.before('Setup fixtures', (t) => {
  // Initial opportunities
  t.context.ops = ops
  t.context.op = ops[0]
  t.context.archivedOp = {
    ...ops[1],
    status: 'completed'
  }
})

test('shallow the card with op', t => {
  const op = t.context.op
  const wrapper = shallowWithIntl(
    <OpCard size='Small' op={op} onPress={() => {}} />
  )
  t.is(wrapper.find('.requestContainerSmall').length, 1)
  t.is(wrapper.find('.requestTitleSmall').text(), op.name)
  t.is(wrapper.find('.requestImgSmall').prop('src'), op.imgUrl)
  t.is(wrapper.find('.requestDateTimeSmall').first().text(), ` 🏫 ${op.location}`)

  t.truthy(wrapper.find('.requestContainerSmall').first().html().includes(op.location))
})

test('op card with default image', t => {
  const op = t.context.op

  const wrapper = shallowWithIntl(
    <OpCard size='Small' op={{ ...op, imgUrl: undefined }} onPress={() => {}} />
  )
  t.is(wrapper.find('.requestContainerSmall').length, 1)
  t.is(wrapper.find('.requestTitleSmall').text(), op.name)
  t.is(wrapper.find('.requestImgSmall').prop('src'), '../../static/missingimage.svg')
})

test('shallow the big card with op', t => {
  const op = t.context.op

  const wrapper = shallowWithIntl(
    <OpCard size='Big' op={op} onPress={() => {}} />
  )
  t.is(wrapper.find('.requestContainerBig').length, 1)
  t.is(wrapper.find('.requestTitleBig').text(), op.name)
})

test('mount the small card with op', t => {
  const op = t.context.op

  const wrapper = mountWithIntl(
    <OpCard size='Small' op={op} onPress={() => {}} />
  )
  t.is(wrapper.find('.requestContainerSmall').length, 1)
  t.is(wrapper.find('.requestTitleSmall').text(), op.name)
})

test('show card for a draft op', t => {
  const op = t.context.op
  op.status = 'draft'

  const wrapper = mountWithIntl(
    <OpCard size='Big' op={op} onPress={() => {}} />
  )
  t.is(wrapper.find('.requestContainerBig').length, 1)
  t.regex(wrapper.find('.requestTitleBig').text(), /DRAFT.*/)
})

test('Link on cards in history tab, points to archived Opportunities.', t => {
  const archivedOp = t.context.archivedOp
  const wrapper = mountWithIntl(
    <OpCard op={archivedOp} size='Small' />
  )
  let archivedOpLink = wrapper.find('Link').first().props().href
  t.is((archivedOpLink), '/archivedops/' + archivedOp._id)
})

test('should have a date', t => {
  const op = t.context.ops[4]
  const wrapper = mountWithIntl(
    <OpCard op={op} size='Small' />
  )

  // should have a real location
  t.is(wrapper.find('.requestDateTimeSmall').first().text(), ` 🏫 ${op.location}`)
})

test('should display that a requestor is interested', t => {
  const op = t.context.ops[2]
  const wrapper = mountWithIntl(
    <OpCard op={op} size='Small' interestStatus='interested' />
  )
  // should find interested status
  t.is(wrapper.find('strong').last().text(), ' - interested')
})
