import React from 'react'
import test from 'ava'
import { shallowWithIntl } from '../../../lib/react-intl-test-helper'

import ActCard from '../ActCard'

// Initial activities
const act = {
  _id: '5cc903e5f94141437622cea7',
  name: 'Growing in the garden',
  subtitle: 'Growing digitally in the garden',
  imgUrl: 'https://image.flaticon.com/icons/svg/206/206857.svg',
  description: 'Project to grow something in the garden',
  duration: '15 Minutes',
  space: '1 acre',
  volunteers: '0.2',
  location: 'Newmarket, Auckland',
  status: 'draft'
}

test('shallow the card with act', t => {
  const wrapper = shallowWithIntl(
    <ActCard act={act} onPress={() => {}} />
  )

  t.is((wrapper.find('Link').first().props().href), '/acts/' + act._id)
  t.is(wrapper.find('h1').text(), `<OpStatus />${act.name}`)
  t.is(wrapper.find('img').prop('src'), act.imgUrl)
  t.is(wrapper.find('figcaption').find('p').at(3).text(), '<OpCommitment />')
  t.is(wrapper.find('figcaption').find('p').first().text(), `${act.subtitle}`)
})

test('shallow the card with no pic', t => {
  const act = {
    _id: '5cc903e5f94141437622cea7',
    name: 'Growing in the garden',
    subtitle: 'Growing digitally in the garden',
    description: 'Project to grow something in the garden',
    location: 'Newmarket, Auckland',
    status: 'active'
  }

  const wrapper = shallowWithIntl(
    <ActCard act={act} onPress={() => {}} />
  )
  t.is((wrapper.find('Link').first().props().href), '/acts/' + act._id)
  t.is(wrapper.find('h1').text(), `<OpStatus />${act.name}`)
  t.is(wrapper.find('img').prop('src'), '/static/missingimage.svg')
  t.is(wrapper.find('figcaption').find('p').first().text(), `${act.subtitle}`)
})
// test.todo('Click the card and see if the link works')
