import React from 'react'
import test from 'ava'
import { shallowWithIntl, mountWithIntl } from '../../../lib/react-intl-test-helper'
import OpCard from '../OpCard'
import ops from './Op.fixture'
import moment from 'moment'

test.before('Setup fixtures', (t) => {
  // Initial opportunities
  t.context.ops = ops
  t.context.op = ops[0]
  t.context.archivedOp = {
    ...ops[1],
    status: 'completed'
  }
})

test('Card include name imgUrl location duration and subtitle', t => {
  const op = t.context.op
  const wrapper = shallowWithIntl(
    <OpCard op={op} onPress={() => {}} />
  )
  t.is(wrapper.find('a').length, 1)
  t.is(wrapper.find('figcaption').find('h1').text(), op.name)
  t.is(wrapper.find('img').prop('src'), op.imgUrl)
  // four p tags for location time duration subtitle+interest
  t.is(wrapper.find('figcaption').find('p').length, 4)
  t.is(wrapper.find('figcaption').find('p').first().text(), ` 🏫 ${op.location}`)
  // second p for time and should be blank as time is not set
  t.is(wrapper.find('figcaption').find('p').at(1).text().trim().length, 0)
  t.is(wrapper.find('figcaption').find('p').at(2).text(), ` ⏱ ${op.duration}`)
  t.is(wrapper.find('figcaption').find('p').last().text(), `${op.subtitle}`)
})

test('op without an image should be displayed with default image', t => {
  const op = t.context.op

  const wrapper = shallowWithIntl(
    <OpCard op={{ ...op, imgUrl: undefined }} onPress={() => {}} />
  )
  t.is(wrapper.find('img').prop('src'), '.././static/missingimage.svg')
})

test('draft ops should display name with prefix DRAFT: ', t => {
  t.plan(1)
  const op = t.context.op
  op.status = 'draft'

  const wrapper = shallowWithIntl(
    <OpCard op={op} onPress={() => {}} />
  )
  t.is(wrapper.find('figcaption').find('h1').text(), `DRAFT: ${op.name}`)
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
  t.is(wrapper.find('figcaption').find('h1').text(), op.name)
  t.is(wrapper.find('figcaption').find('p').at(1).text(), moment(op.date[0]).format(' 🗓 h:mmA - ddd DD/MM/YY '))
})

test('op with an interest status should have related icon appear in card', t => {
  const op = t.context.ops[2]
  const wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  // when interest status is interested, icon should be like
  t.truthy(wrapper.find('i').first().hasClass('anticon-like'))

  // Dynamic update is not working, make seperate tests ??
  op.interest.status = 'invited'
  wrapper.update().render()
  console.log(wrapper.html())
  t.truthy(wrapper.find('i').first().hasClass('anticon-message'))

  op.interest.status = 'committed'
  wrapper.update()
  t.truthy(wrapper.find('i').first().hasClass('anticon-check-circle'))

  // TODO tidy up old test logic and add test for each interest status
})

test('ops without location and duration should display P tags with blank', t => {
  const op = t.context.ops[4]
  op.location = undefined
  op.duration = undefined
  const wrapper = mountWithIntl(
    <OpCard op={op} />
  )
  t.is(wrapper.find('figcaption').find('h1').text(), op.name)
  t.is(wrapper.find('figcaption').find('p').at(1).text(), moment(op.date[0]).format(' 🗓 h:mmA - ddd DD/MM/YY '))
  t.is(wrapper.find('figcaption').find('p').at(0).text().trim().length, 0)
  t.is(wrapper.find('figcaption').find('p').at(2).text().trim().length, 0)
})
