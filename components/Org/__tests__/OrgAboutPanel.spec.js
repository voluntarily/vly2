import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import OrgAboutPanel from '../OrgAboutPanel'
import orgs from './Org.fixture'

test('shallows the panel', t => {
  const org = orgs[0]
  const wrapper = shallow(
    <OrgAboutPanel org={org} />
  )
  // console.log(wrapper.debug())
  t.is(wrapper.find('li').length, 6)
})

test('shallows the list no about data', t => {
  const org = orgs[5]
  const wrapper = shallow(
    <OrgAboutPanel org={org} />
  )
  t.is(wrapper.find('li').length, 0)
})
