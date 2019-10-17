import React from 'react'
import test from 'ava'
import { mountWithIntl, renderWithIntl } from '../../../lib/react-intl-test-helper'
import { ItemVolunteers } from '../../VTheme/ItemList'
import ActDetail from '../ActDetail'

// Initial activities
const act = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  volunteers: 1,
  duration: '15 Minutes',
  space: '1 acre',
  location: 'Newmarket, Auckland',
  status: 'draft',
  tags: []
}

test('render the detail with act', t => {
  const wrapper = mountWithIntl(<ActDetail act={act} onPress={() => {}} />)
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), act.name)
  t.is(wrapper.find({ space: '1 acre' }).length, 1)
  t.is(wrapper.find({ volunteers: 1 }).length, 1)
  t.is(wrapper.find('li').length, 6)
})

test('render the detail with no picture ', t => {
  const actNoPic = {
    _id: '5cc903e5f94141437622cea7',
    name: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    description: 'Project to grow something in the garden',
    duration: '15 Minutes',
    location: 'Newmarket, Auckland',
    status: 'draft',
    tags: []
  }

  const wrapper = renderWithIntl(<ActDetail act={actNoPic} onPress={() => {}} />)
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find({ space: '1 acre' }).length, 0)
  t.is(wrapper.find('li').length, 4)
})

test('render Volunteers per student properly if the value is < 1', t => {
  const wrapper = renderWithIntl(<ItemVolunteers volunteers={0.2} type='act' />)
  t.is(wrapper.find('span').first().text(), 'Volunteers per student:')
})
