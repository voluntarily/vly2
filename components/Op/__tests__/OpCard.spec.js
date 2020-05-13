import React from 'react'
import test from 'ava'
import { shallowWithIntl, mountWithIntl } from '../../../lib/react-intl-test-helper'
import OpCard from '../OpCard'
import ops from './Op.fixture'
import moment from 'moment'
import { DescriptionWrapper } from '../../VTheme/VTheme'

test.before('Setup fixtures', (t) => {
  // Initial opportunities
  t.context.ops = ops
  t.context.op = ops[0]
  t.context.archivedOp = {
    ...ops[1],
    status: 'completed'
  }
})

test('Card include name school/org imgUrl location duration and subtitle', t => {
  const op = t.context.op
  const wrapper = shallowWithIntl(
    <OpCard op={op} onPress={() => {}} />
  )
  t.is(wrapper.find('a').length, 1)
  t.true(wrapper.find('figcaption').find('h1').text().includes(op.name))
  t.is(wrapper.find('img').prop('src'), op.imgUrl)
  // four p tags for location time duration subtitle+interest
  t.is(wrapper.find('figcaption').find('li').length, 2)
  t.is(wrapper.find('figcaption').find('li').first().text(), ` 📍 ${op.location}`)
  // second li for time and should be blank as time is not set
  t.is(wrapper.find('figcaption').find('li').at(1).text(), ` ⏱ ${op.duration}`)
  t.is(wrapper.find('figcaption').find(DescriptionWrapper).first().text(), `${op.subtitle}`)
})

test('op without an image should be displayed with default image', t => {
  const op = t.context.op

  const wrapper = shallowWithIntl(
    <OpCard op={{ ...op, imgUrl: undefined }} onPress={() => {}} />
  )
  t.is(wrapper.find('img').prop('src'), '/static/missingimage.svg')
})

test('draft ops should display name with prefix DRAFT: ', t => {
  t.plan(1)
  const op = t.context.op
  op.status = 'draft'

  const wrapper = shallowWithIntl(
    <OpCard op={op} onPress={() => {}} />
  )
  t.true(wrapper.find('figcaption').find('h1').text().includes(`DRAFT: ${op.name}`))
})

test('Link on card should point to ops/<opportunity_id>', t => {
  const op = t.context.op
  const wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  const archivedOpLink = wrapper.find('Link').first().props().href
  t.is((archivedOpLink), '/ops/' + op._id)
})

test('Link on cards in history tab, points to archived Opportunities.', t => {
  const archivedOp = t.context.archivedOp
  const wrapper = mountWithIntl(
    <OpCard op={archivedOp} />
  )
  const archivedOpLink = wrapper.find('Link').first().props().href
  t.is((archivedOpLink), '/archivedops/' + archivedOp._id)
})

test('ops with start and end date should be display start date', t => {
  const op = t.context.ops[4]
  const wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  t.true(wrapper.find('figcaption').find('h1').text().includes(op.name))
  t.is(wrapper.find('figcaption').find('li').at(1).text(), moment(op.date[0]).format(' 🗓 h:mmA - ddd DD/MM/YY '))
})

test('op with an interest status should have related icon appear in card', t => {
  const op = t.context.ops[2]
  let wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  t.truthy(wrapper.find('figcaption').find('p').last().text(), 'You offered to help')

  op.interest.status = 'invited'
  wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  t.truthy(wrapper.find('figcaption').find('p').last().text(), 'You are invited')

  op.interest.status = 'committed'
  wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  t.truthy(wrapper.find('figcaption').find('p').last().text(), 'Accepted')

  op.interest.status = 'declined'
  wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  t.truthy(wrapper.find('figcaption').find('p').last().text(), 'Cancelled')
})

test('op with uncatered interest status should not have related icon appear in card', t => {
  const op = t.context.ops[2]
  op.interest.status = 'otherstatus'
  const wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  // when interest status is interested, icon should be like
  t.is(wrapper.find('i.anticon').length, 0)
})

test('op with no interest status should not have related icon appear in card', t => {
  const op = t.context.ops[1]
  const wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  // when interest status is interested, icon should be like
  t.is(wrapper.find('i.anticon').length, 0)
})

test('ops without location and duration should skip lines', t => {
  const op = t.context.ops[4]
  op.location = undefined
  op.duration = undefined
  const wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  t.true(wrapper.find('figcaption').find('h1').text().includes(op.name))
  t.is(wrapper.find('figcaption').find('li').length, 1)
  t.is(wrapper.find('figcaption').find('li').at(0).text(), moment(op.date[0]).format(' 🗓 h:mmA - ddd DD/MM/YY '))
  // t.is(wrapper.find('figcaption').find('p').at(0).text().trim().length, 0)
  // t.is(wrapper.find('figcaption').find('p').at(2).text().trim().length, 0)
})
