import React from 'react'
import test from 'ava'
import Navigation from '../Navigation/Navigation'
import { mountWithIntl } from '../../lib/react-intl-test-helper'
import useMockRouter from '../../server/util/useMockRouter'
test.before('Setup Route', useMockRouter('/about'))
const menu = [
  {
    key: 'acts',
    text: 'Activities',
    href: '/acts'
  },
  {
    key: 'orgs',
    text: 'Organisations',
    href: '/orgs'
  },
  {
    key: 'notsecret',
    text: 'Not Secret',
    href: '/notsecret',
    anonymousOnly: true
  },
  {
    key: 'secret',
    text: 'Secret',
    href: '/secret',
    authRequired: true
  }
]

test('renders the Navigation and Navigation properly', t => {
  const props = {
    items: menu,
    defaultItem: 'acts'
  }
  const wrapper = mountWithIntl(
    <Navigation {...props} />
  )

  t.is(wrapper.find('Link').first().text(), 'Activities')
  // TODO test selected path is highlighted
  // t.is(wrapper.find('Link').first().hasClass('ant-menu-item-selected'))
  // t.is(wrapper.find('a').length, 2);
  t.snapshot()
})
