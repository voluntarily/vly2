import React from 'react'
import test from 'ava'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'

import OpDetail from '../OpDetail'

// Initial opportunities
const op = {
  _id: '5cc903e5f94141437622cea7',
  title: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: '15 Minutes',
  location: 'Newmarket, Auckland',
  status: 'draft'
}

test('render the detail with op', t => {
  const wrapper = renderWithIntl(<OpDetail op={op} onPress={() => {}} />)
  // console.log(wrapper.html())
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), op.title)
})

// test.todo('verify markdown in description is rendered')
