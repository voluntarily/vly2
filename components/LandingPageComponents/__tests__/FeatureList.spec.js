import React from 'react'
import test from 'ava'
import { mount } from 'enzyme'
import { FeatureList } from '../FeatureList'

// Initial opportunities added into test db

test('FeatureList renders', t => {
  const wrapper = mount(
    <FeatureList />
  )
  t.is(wrapper.find('h2').text(), 'Features')
  t.is(wrapper.find('p').first().text(), 'Placeholder Title')
})
