import React from 'react'
import test from 'ava'
import { shallow } from 'enzyme'

import InterestConfirmationCard from '../InterestConfirmationCard'

test('render confirmation card', t => {
  const requestor = {
    _id: 'f34gb2bh24b24b2',
    name: 'Testy McTestface',
    nickname: 'Testy',
    email: 'testy@voluntar.ly',
    phone: '027 444 5555',
    imgUrl: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
    role: ['support', 'volunteer']
  }

  const wrapper = shallow(<InterestConfirmationCard organizer={requestor} />)
  t.truthy(wrapper.find('Head'))
  t.truthy(wrapper.find('Meta[title="Testy McTestface"]'))
  t.is(wrapper.find('ForwardRef(MailOutlined) + span').text(), ` ${requestor.email}`)
  t.regex(wrapper.find('span').at(1).text(), /.*027 444 5555/)
})
test('render confirmation card no number', t => {
  const requestor = {
    _id: 'f34gb2bh24b24b2',
    name: 'Testy McTestface',
    nickname: 'Testy',
    phone: '',
    email: 'testy@voluntar.ly',
    imgUrl: 'https://blogcdn1.secureserver.net/wp-content/uploads/2014/06/create-a-gravatar-beard.png',
    role: ['support', 'volunteer']
  }

  const wrapper = shallow(<InterestConfirmationCard organizer={requestor} />)
  t.is(wrapper.find('span').length, 1)
})
