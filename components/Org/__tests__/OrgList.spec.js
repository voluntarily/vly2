import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import OrgList from '../OrgList'

// Initial organisations added into test db
const orgs = [
  {
    _id: 'f34gb2bh24b24b2',
    name: 'OMGTech',
    slug: 'hello-omgtech',
    about: "All cats meow 'mern!'",
    type: 'activity_provider'
  },
  {
    _id: 'f34gb2bh24b24b3',
    name: 'Datacom',
    slug: 'hi-datacom',
    about: "All dogs bark 'mern!'",
    type: 'corporate'
  }
]

test('renders the list', t => {
  const wrapper = shallow(
    <OrgList orgs={orgs} handleShowOrg={() => {}}  />
  )

  t.is(wrapper.find('OrgCard').length, 2)
})
