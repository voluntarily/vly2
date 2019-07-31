import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'
import OrgList from '../OrgList'

// Initial organisations added into test db
const orgs = [
  {
    _id: 'f34gb2bh24b24b2',
    name: 'OMGTech',
    imgUrl: 'http://example.com/example.jpg',
    slug: 'hello-omgtech',
    about: 'Awesome Activity Provider',
    category: ['ap']
  },
  {
    _id: 'f34gb2bh24b24b3',
    name: 'Datacom',
    imgUrl: 'http://example.com/example2.jpg',
    slug: 'hi-datacom',
    about: "All dogs bark 'mern!'",
    category: ['vp']
  },
  {
    _id: 'f34gb2bh24b2b4',
    name: 'Voluntari.ly',
    imgUrl: 'http://example.com/example3.jpg',
    slug: 'voluntari-ly',
    about: 'Everything Provider',
    category: ['vp', 'op', 'admin']
  }
]

test('renders the list', t => {
  const wrapper = shallow(
    <OrgList orgs={orgs} handleShowOrg={() => {}} />
  )

  t.is(wrapper.find('OrgCard').length, 3)
})

test('renders no orgs', t => {
  const wrapper = shallow(
    <OrgList handleShowOrg={() => {}} />
  )

  t.is(wrapper.find('OrgCard').length, 0)
})
