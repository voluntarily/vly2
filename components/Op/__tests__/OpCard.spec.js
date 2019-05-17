import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import OpCard from '../OpCard'

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

test('shallow the card with op', t => {
  const wrapper = shallow(
    <OpCard op={op} onPress={() => {}} />
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('.requestContainer').length, 1)
  t.is(wrapper.find('.requestTitle').text(), op.title)
})

test.todo('Click the card and see if the link works')
