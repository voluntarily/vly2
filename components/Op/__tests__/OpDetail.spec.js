import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
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

test('shallow the detail with op', t => {
  const wrapper = shallow(
    <OpDetail op={op} onPress={() => {}} />
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('div').length, 1)
  t.is(wrapper.find('Head').children().at(1).text(), op.title)
  t.is(wrapper.find('h1').children().first().text(), op.title)
})

test.todo('verify markdown in description is rendered')
