import React from 'react'
import test from 'ava'
import { shallowWithIntl, mountWithIntl } from '../../../lib/react-intl-test-helper'

import OpCard from '../OpCard'

test.before('Setup fixtures', (t) => {
  // Initial opportunities
  t.context.op = {
    _id: '5cc903e5f94141437622cea7',
    title: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Auckland',
    status: 'active',
    date: [
      {
        '$date': '2019-05-23T12:26:18.000Z'
      },
      {
        '$date': '2019-06-12T04:55:10.014Z'
      }
    ]
  }
  t.context.archivedOp = {
    _id: '5cc903e5f94141437622cea8',
    title: '1 Mentor a year 12 business Impact Project',
    subtitle: 'Help us create a programme connecting business with senior students',
    imgUrl: 'https://www.tvnz.co.nz/content/dam/images/news/2015/01/26/pacific-island-mentors-with-kelston-high-school-students.jpg.hashed.0d58ef7e.desktop.story.share.jpg',
    description: 'We want to set up our Connect Ed programme, help us understand how to communication with businesses, build a website and contact group etc.',
    duration: '12 weeks, 1 hour sessions',
    location: 'Auckland',
    status: 'completed',
    date: [
      null,
      null
    ]
  }
})

test('shallow the card with op', t => {
  const op = t.context.op
  const wrapper = shallowWithIntl(
    <OpCard size='Small' op={op} onPress={() => {}} />
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('.requestContainerSmall').length, 1)
  t.is(wrapper.find('.requestTitleSmall').text(), op.title)
  t.is(wrapper.find('.requestImgSmall').prop('src'), op.imgUrl)
  t.truthy(wrapper.find('.requestContainerSmall').first().html().includes(op.location))
})

test('op card with default image', t => {
  const op = t.context.op

  const wrapper = shallowWithIntl(
    <OpCard size='Small' op={{ ...op, imgUrl: undefined }} onPress={() => {}} />
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('.requestContainerSmall').length, 1)
  t.is(wrapper.find('.requestTitleSmall').text(), op.title)
  t.is(wrapper.find('.requestImgSmall').prop('src'), 'static/missingimage.svg')
})

test('shallow the big card with op', t => {
  const op = t.context.op

  const wrapper = shallowWithIntl(
    <OpCard size='Big' op={op} onPress={() => {}} />
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('.requestContainerBig').length, 1)
  t.is(wrapper.find('.requestTitleBig').text(), op.title)
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
    <OpCard op={archivedOp} />
  )
  let archivedOpLink = wrapper.find('#linkToOpportunity').props().href
  t.is((archivedOpLink), '/archivedops/' + archivedOp._id)
})
