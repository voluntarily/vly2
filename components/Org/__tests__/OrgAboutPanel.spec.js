import React from 'react'
import test from 'ava'
import { render } from 'enzyme'
import OrgAboutPanel from '../OrgAboutPanel'
import orgs from './Org.fixture'

test('renders the list', t => {
  const org = orgs[0]
  const wrapper = render(
    <OrgAboutPanel org={org} />
  )
  t.is(wrapper.find('li').length, 6)
})

test('renders the list no about data', t => {
  const org = orgs[5]
  const wrapper = render(
    <OrgAboutPanel org={org} />
  )
  t.is(wrapper.find('li').length, 0)
})
