import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import OrgTabs from '../OrgTabs'
import orgs from './Org.fixture'

test('shallows the tabs', t => {
  const org = orgs[0]
  const wrapper = shallow(
    <OrgTabs org={org} onChange={() => {}} />
  )
  t.is(wrapper.find('TabPane').length, 4)
  t.true(wrapper.exists('OrgAboutPanel'))
})
