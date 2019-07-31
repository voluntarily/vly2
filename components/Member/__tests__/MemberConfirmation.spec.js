import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'

import MemberConfirmationCard from '../MemberConfirmationCard'

test('render confirmation card', t => {
  const orgAdmin = {
    _id: 'f34gb2bh24b24b2',
    name: 'Organisation Administrator',
    nickname: 'OrgAdmin',
    email: 'admin@organisation.com',
    phone: '027 444 5555',
    avatar: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
    role: ['admin', 'volunteer']
  }

  const wrapper = shallow(<MemberConfirmationCard orgAdmin={orgAdmin} />)
  t.truthy(wrapper.find('Head'))
  t.truthy(wrapper.find('Meta[title="Organisation Administrator"]'))
  t.is(wrapper.find('Icon[type="mail"] + span').text(), ` ${orgAdmin.email}`)
  t.regex(wrapper.find('span').at(1).text(), /.*027 444 5555/)
})
test('render confirmation card no number', t => {
  const orgAdmin = {
    _id: 'f34gb2bh24b24b2',
    name: 'Testy McTestface',
    nickname: 'Testy',
    email: 'testy@voluntar.ly',
    avatar: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
    role: ['tester', 'volunteer']
  }

  const wrapper = shallow(<MemberConfirmationCard orgAdmin={orgAdmin} />)
  t.is(wrapper.find('span').length, 1)
})
