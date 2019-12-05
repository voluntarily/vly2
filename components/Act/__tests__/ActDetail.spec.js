import React from 'react'
import test from 'ava'
import { mountWithIntl, renderWithIntl } from '../../../lib/react-intl-test-helper'
import { ItemVolunteers } from '../../VTheme/ItemList'
import ActDetail from '../ActDetail'

// Initial activities
const actMin = {
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

const actMax = {
  _id: '5cc903e5f94141437622cea7',
  name: 'herding cats',
  subtitle: 'can you train cats using lazers',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Probably not ok to do this',
  volunteers: 5,
  duration: '6 hours',
  space: '1 acre',
  location: 'Newmarket, Auckland',
  equipment: ['cats', 'lasers', 'buckets'],
  status: 'active',
  tags: ['algorithms', 'scheduling']
}

test('render the detail with short act', t => {
  const wrapper = mountWithIntl(<ActDetail act={actMin} onPress={() => {}} />)
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), actMin.name)
  t.is(wrapper.find({ duration: actMin.duration }).length, 1)
  t.is(wrapper.find('li').length, 5) // only minimal items shown
})

test('render the detail with full act', t => {
  const wrapper = mountWithIntl(<ActDetail act={actMax} onPress={() => {}} />)
  t.truthy(wrapper.find('Head'))
  t.is(wrapper.find('h1').text(), actMax.name)
  t.is(wrapper.find({ space: actMax.space }).length, 1)
  t.is(wrapper.find({ volunteers: actMax.volunteers }).length, 2)
  t.is(wrapper.find('li').length, 11)
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
  t.is(wrapper.find('li').length, 5)
})

test('render Volunteers per student properly if the value is < 1', t => {
  const wrapper = renderWithIntl(<ItemVolunteers volunteers={0.2} type='act' />)
  t.is(wrapper.find('span').first().text(), 'Volunteers per student:')
})
