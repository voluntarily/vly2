import React from 'react'
import test from 'ava'
import Navigation from '../Header/Navigation'
import { mountWithIntl } from '../../lib/react-intl-test-helper'

const menu = [
  {
    'key': 'acts',
    'text': 'Activities',
    'url': '/acts'
  },
  {
    'key': 'orgs',
    'text': 'Organisations',
    'url': '/orgs'
  }
]

test('renders the Navigation and Navigation properly', t => {
  const props = {
    items: menu,
    router: {
      pathname: 'orgs'
    },
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

test('renders the Navigation no route = no highlight', t => {
  const props = {
    items: menu,
    defaultItem: 'acts'
  }
  const wrapper = mountWithIntl(
    <Navigation {...props} />
  )

  t.is(wrapper.find('Link').first().text(), 'Activities')
  // t.is(wrapper.find('Link').first().hasClass('ant-menu-item-selected'))
  // t.is(wrapper.find('a').length, 2);
  t.snapshot()
})
