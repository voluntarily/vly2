import React from 'react'
import test from 'ava'
import { shallowWithIntl, renderWithIntl } from '../../../lib/react-intl-test-helper'
import ActList from '../ActList'

// Initial activities added into test db
const acts = [
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

test('shallow the list with acts', t => {
  const wrapper = shallowWithIntl(
    <ActList acts={acts} handleShowAct={() => {}} handleDeleteAct={() => {}} />
  )
  t.is(wrapper.find('ActCard').length, 2)
})

test('renders the list with acts to get card coverage', t => {
  const wrapper = renderWithIntl(
    <ActList acts={acts} handleShowAct={() => {}} handleDeleteAct={() => {}} />
  )

  t.is(wrapper.find('a').length, 4)
})

test('renders the list with no acts', t => {
  const wrapper = renderWithIntl(
    <ActList handleShowAct={() => {}} handleDeleteAct={() => {}} />
  )
  t.is(wrapper.find('ActCard').length, 0)
  t.is(wrapper.text(), 'No matching activitiesSuggest a topicSuggest a topic you want help with, or can offer to help with.Learn more')
})
