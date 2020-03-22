import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import OrgTabs from '../OrgTabs'
import orgs from './Org.fixture'

test('shallows the tabs anon', t => {
  const org = orgs[0]
  const wrapper = shallow(
    <OrgTabs org={org} onChange={() => {}} />
  )
  t.is(wrapper.find('TabPane').length, 3)
  t.true(wrapper.exists('OrgAboutPanel'))
})

test('shallows the tabs authed', t => {
  const org = orgs[0]
  const wrapper = shallow(
    <OrgTabs org={org} onChange={() => {}} isAuthenticated />
  )
  t.is(wrapper.find('TabPane').length, 5)
  t.true(wrapper.exists('OrgAboutPanel'))
})

test('shallows the tabs admin', t => {
  const org = orgs[0]
  const wrapper = shallow(
    <OrgTabs org={org} onChange={() => {}} canManage isAuthenticated />
  )
  t.is(wrapper.find('TabPane').length, 6)
  t.true(wrapper.exists('OrgAboutPanel'))
})
