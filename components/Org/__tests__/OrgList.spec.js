import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import OrgList from '../OrgList'
import orgs from './Org.fixture'

test('renders the list', t => {
  const wrapper = shallow(
    <OrgList orgs={orgs} handleShowOrg={() => {}} />
  )

  t.is(wrapper.find('OrgCard').length, 6)
})

test('renders no orgs', t => {
  const wrapper = shallow(
    <OrgList handleShowOrg={() => {}} />
  )

  t.is(wrapper.find('OrgCard').length, 0)
})
