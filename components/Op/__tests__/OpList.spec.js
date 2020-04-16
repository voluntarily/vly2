import React from 'react'
import test from 'ava'
import { shallowWithIntl, renderWithIntl } from '../../../lib/react-intl-test-helper'
import OpList from '../OpList'

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
    status: 'draft',
    requestor: {
      nickname: 'Testy McTestface'
    },
    date: [
      {
        $date: '2019-05-23T12:26:18.000Z'
      },
      {
        $date: '2019-06-12T04:55:10.014Z'
      }
    ]
  },
  {
    _id: '5cc903e5f94141437622ce87',
    name: 'The first 100 metres',
    subtitle: 'Launching into space',
    imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
    description: 'Project to build a simple rocket that will reach 100m',
    duration: '2 hours',
    location: 'Albany, Auckland',
    status: 'draft',
    requestor: {
      nickname: 'Testy McTestface'
    },
    date: [
      {
        $date: '2019-05-23T12:26:18.000Z'
      },
      {
        $date: '2019-06-12T04:55:10.014Z'
      }
    ]
  }
]

test('shallow the list with ops', t => {
  const wrapper = shallowWithIntl(
    <OpList ops={ops} handleShowOp={() => {}} handleDeleteOp={() => {}} />
  )
  t.is(wrapper.find('OpCard').length, 2)
})

test('renders the list with ops to get card coverage', t => {
  const wrapper = renderWithIntl(
    <OpList ops={ops} handleShowOp={() => {}} handleDeleteOp={() => {}} />
  )

  t.is(wrapper.find('a').length, 2)
})

test('renders the list with no ops', t => {
  const wrapper = renderWithIntl(
    <OpList handleShowOp={() => {}} handleDeleteOp={() => {}} ops={[]} />
  )
  t.is(wrapper.find('OpCard').length, 0)
  t.is(wrapper.text(), '')
})
