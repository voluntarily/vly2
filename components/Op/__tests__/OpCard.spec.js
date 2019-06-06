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
    location: 'Newmarket, Auckland',
    status: 'active'
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

// test.todo('Click the card and see if the link works')
