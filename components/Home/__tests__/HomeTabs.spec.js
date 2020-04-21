import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import HomeTabs from '../HomeTabs'

test('shallows the tabs', t => {
  const person = {
    _id: '12345',
    name: 'Testy McTestface'
  }
  const wrapper = shallow(
    <HomeTabs person={person} onChange={() => {}} />
  )
  t.is(wrapper.find('TabPane').length, 4)
  t.true(wrapper.exists('PersonalGoalSection'))
})
