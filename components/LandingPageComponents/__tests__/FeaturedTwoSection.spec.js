import React from 'react'
import test from 'ava'
import { shallowWithIntl, renderWithIntl } from '../../../lib/react-intl-test-helper'
import FeaturedTwoSection from '../FeaturedTwoSection'

// Initial opportunities added into test db
const ops = [
  {
    _id: '5cc903e5f94141437622cea7',
    name: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    status: 'draft'
  },
  {
    _id: '5cc903e5f94141437622ce87',
    name: 'The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    location: 'Albany, Auckland',
    status: 'draft'
  }
]

test('shallow the list with ops', t => {
  const wrapper = shallowWithIntl(
    <FeaturedTwoSection ops={ops} title='MyTestTitle' subtitle='MyTestSubtitle' handleShowOp={() => {}} handleDeleteOp={() => {}} />
  )
  t.is(wrapper.find('OpCard').length, 2)
})

test('renders the list with no ops', t => {
  const wrapper = renderWithIntl(
    <FeaturedTwoSection handleShowOp={() => {}} title='' handleDeleteOp={() => {}} />
  )
  t.is(wrapper.find('OpCard').length, 0)
  t.is(wrapper.find('div').last().text(), 'No matching activities')
})
