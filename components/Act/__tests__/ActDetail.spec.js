import React from 'react'
import test from 'ava'
import { renderWithIntl } from '../../../lib/react-intl-test-helper'

import ActDetail from '../ActDetail'

// Initial activities
const act = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: '15 Minutes',
  location: 'Newmarket, Auckland',
  status: 'draft',
  tags: []
}

test('render the detail with act', t => {
  const wrapper = renderWithIntl(<ActDetail act={act} onPress={() => {}} />)
  // console.log(wrapper.html())
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), act.name)
})

// test.todo('verify markdown in description is rendered')
